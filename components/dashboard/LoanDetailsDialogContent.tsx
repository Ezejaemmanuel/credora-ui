import { useCallback, useState } from "react";
import { parseUnits } from "viem";
import { format } from 'date-fns';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CyberButton } from "@/components/ui/CyberButton";
import { Input } from "@/components/ui/input";
import { credoraLoanPoolAbi, mockUsdcAbi, mockUsdcAddress } from "@/generated";
import type { LoanPoolFullDetails } from "@/types/credora";
import { LoanStatus } from "@/types/credora";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
// Helper to format currency
const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numValue);
};

// Helper to format BigInt timestamp to readable date
const formatTimestamp = (timestamp?: bigint): string => {
    if (!timestamp) return "N/A";
    try {
        return format(new Date(Number(timestamp) * 1000), 'MMM d, yyyy HH:mm');
    } catch (e) {
        return "Invalid Date";
    }
};

// Helper to format duration from seconds
const formatDuration = (seconds?: bigint): string => {
    if (typeof seconds !== 'bigint' || seconds <= BigInt(0)) return "N/A";
    const totalSeconds = Number(seconds);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const months = Math.floor(days / 30);
    if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    return "< 1 day";
};

// Helper to render loan status string
const renderLoanStatus = (statusNum?: number): string => {
    if (typeof statusNum !== 'number') return "Unknown";
    return LoanStatus[statusNum] || "Unknown";
};

interface LoanDetailsDialogContentProps {
    loan: LoanPoolFullDetails | null;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode; className?: string; variant?: 'normal' | 'highlight' }> =
    ({ label, value, className, variant = 'normal' }) => (
        <div className={`py-2.5 border-b border-neutral-700/50 ${className}`}>
            <p className="text-xs text-white/60 font-shareTechMono uppercase tracking-wider">{label}</p>
            <p className={`text-md font-spaceGrotesk ${variant === 'highlight' ? 'text-neonGreen font-orbitron' : 'text-white'}`}>{value}</p>
        </div>
    );

export const LoanDetailsDialogContent: React.FC<LoanDetailsDialogContentProps> = ({ loan }) => {
    const [amount, setAmount] = useState<string>("");
    const queryClient = useQueryClient();

    const publicClient = usePublicClient();
    const { address } = useAccount();
    const { writeContractAsync, isPending: isProcessing } = useWriteContract();

    if (!loan) return (
        <div className="text-center py-10 text-white/70 font-spaceGrotesk">
            No loan details to display.
        </div>
    );

    const raisedAmount = parseFloat(loan.totalFundsRaised);
    const targetAmount = parseFloat(loan.loanAmountPrincipal);
    const progressPercentage = targetAmount > 0 ? (raisedAmount / targetAmount) * 100 : 0;
    const interestRatePercent = (Number(loan.interestRateBPS) / 100).toFixed(2);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numbers and decimals
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleContributeFunds = async () => {
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (!publicClient) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!address) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            // Parse amount to USDC decimals (6)
            const amountInUSDC = parseUnits(amount, 6);

            // Check current allowance using publicClient
            const currentAllowance = await publicClient.readContract({
                address: mockUsdcAddress[42421] as `0x${string}`,
                abi: mockUsdcAbi,
                functionName: 'allowance',
                args: [address, loan.poolAddress as `0x${string}`],
            });

            // Only approve if the current allowance is less than the amount we want to transfer
            if (currentAllowance < amountInUSDC) {
                const approveTxHash = await toast.promise(
                    writeContractAsync({
                        address: mockUsdcAddress[42421] as `0x${string}`,
                        abi: mockUsdcAbi,
                        functionName: 'approve',
                        args: [loan.poolAddress, amountInUSDC],
                    }),
                    {
                        loading: 'Approving USDC transfer...',
                        success: 'Approval transaction submitted!',
                        error: (err) => `Error approving: ${err.message}`
                    }
                ).unwrap();

                // Wait for the transaction to be mined
                await toast.promise(
                    publicClient.waitForTransactionReceipt({
                        hash: approveTxHash
                    }),
                    {
                        loading: 'Waiting for approval confirmation...',
                        success: 'USDC transfer approved!',
                        error: (err) => `Approval failed: ${err.message}`
                    }
                ).unwrap();
            } else {
                toast.info("Sufficient allowance already exists");
            }

            // Now fund the loan
            const fundTxHash = await toast.promise(
                writeContractAsync({
                    address: loan.poolAddress as `0x${string}`,
                    abi: credoraLoanPoolAbi,
                    functionName: 'fund',
                    args: [amountInUSDC],
                }),
                {
                    loading: 'Funding loan pool...',
                    success: 'Funding transaction submitted!',
                    error: (err) => `Error funding: ${err.message}`
                }
            ).unwrap();

            // Wait for the funding transaction to be mined
            await toast.promise(
                publicClient.waitForTransactionReceipt({
                    hash: fundTxHash as `0x${string}`
                }),
                {
                    loading: 'Waiting for funding confirmation...',
                    success: 'Successfully funded the loan pool!',
                    error: (err) => `Funding failed: ${err.message}`
                }
            ).unwrap();
            queryClient.invalidateQueries();

            // Reset the input field after successful funding
            setAmount("");

        } catch (error: any) {
            console.error("Transaction failed:", error);
            toast.error(`Transaction failed: ${error.message || "Unknown error"}`);
        }
    };

    return (
        <div className="space-y-3 py-2 font-spaceGrotesk">
            <DetailItem label="Pool Address" value={loan.poolAddress} />
            <DetailItem label="Status" value={renderLoanStatus(loan.currentStatus)} variant="highlight" />
            <DetailItem label="Target Amount" value={formatCurrency(loan.loanAmountPrincipal)} variant="highlight" />
            <DetailItem label="Total Funds Raised" value={formatCurrency(loan.totalFundsRaised)} variant="highlight" />
            <DetailItem label="Interest Rate" value={`${interestRatePercent}%`} />
            <DetailItem label="Loan Duration" value={formatDuration(loan.durationSeconds)} />
            <DetailItem label="Accepted Currency" value={loan.acceptedCurrency} />
            <DetailItem label="Pool Token" value={`${loan.poolTokenName} (${loan.poolTokenSymbol})`} />
            <DetailItem label="Installments" value={`${loan.currentInstallmentPaidCount.toString()} / ${loan.numberOfInstallments.toString()} Paid`} />
            <DetailItem label="Loan Start Date" value={formatTimestamp(loan.loanStartTime)} />
            <DetailItem label="Maturity Date" value={formatTimestamp(loan.maturityTime)} />
            <DetailItem label="Next Installment Due" value={formatTimestamp(loan.nextInstallmentDueDate)} />
            <DetailItem label="Installment Principal" value={formatCurrency(loan.installmentPrincipalPerPeriod)} />
            <DetailItem label="Installment Interest" value={formatCurrency(loan.installmentInterestPerPeriod)} />

            <div className="pt-3">
                <p className="text-sm text-white/70 mb-1 font-shareTechMono">Funding Progress: {progressPercentage.toFixed(0)}%</p>
                <div className="w-full bg-neutral-700/50 rounded-full h-3 border border-neutral-600">
                    <motion.div
                        className="bg-gradient-to-r from-neonGreen/70 to-neonGreen h-full rounded-full shadow-md shadow-neonGreen/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <p className="text-right text-xs mt-1 text-white/60 font-shareTechMono">
                    {formatCurrency(loan.totalFundsRaised)} / {formatCurrency(loan.loanAmountPrincipal)} raised
                </p>
            </div>

            {renderLoanStatus(loan.currentStatus) === 'Funding' && (
                <motion.div
                    className="pt-6 space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className="text-lg font-orbitron text-neonGreen text-center">Fund This Loan Pool</p>
                    <Input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder={`Enter amount in ${loan.poolTokenSymbol || 'USDC'}...`}
                        className="bg-black border-2 border-neonGreen/70 p-3 rounded-md w-full text-white font-spaceGrotesk focus:ring-1 focus:ring-neonGreen focus:border-neonGreen placeholder:text-white/50 shadow-inner shadow-neonGreen/20"
                        disabled={isProcessing}
                    />
                    <CyberButton
                        variant="green"
                        className="w-full text-md py-3"
                        onClick={handleContributeFunds}
                        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                    >
                        {isProcessing ? 'Processing...' : 'Contribute Funds'}
                    </CyberButton>
                </motion.div>
            )}
        </div>
    );
};

export default LoanDetailsDialogContent; 