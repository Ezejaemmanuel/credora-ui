import { useState } from "react";
import { GlowingCard } from "@/components/ui/GlowingCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Credenza, CredenzaBody, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaDescription } from "@/components/credenza";
import { LoanPoolFullDetails, LenderPoolContributionDetails, LoanStatus, Address } from "@/types/credora";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { useWriteContract, usePublicClient, useAccount, useReadContract } from "wagmi";
import { credoraLoanPoolAbi, mockUsdcAbi, mockUsdcAddress } from "@/generated";
import { toast } from "sonner";
import { parseUnits } from "viem";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

// Helper to format currency (can be moved to lib/utils.ts)
const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numValue);
};

// Helper to format BigInt timestamp to readable date
const formatTimestamp = (timestamp?: bigint): string => {
    if (!timestamp || timestamp === 0n) return "N/A";
    try {
        return format(new Date(Number(timestamp) * 1000), 'MMM d, yyyy, HH:mm');
    } catch (e) {
        return "Invalid Date";
    }
};

// Helper to format duration from seconds
const formatDuration = (seconds?: bigint): string => {
    if (typeof seconds !== 'bigint' || seconds <= 0n) return "N/A";
    const totalSeconds = Number(seconds);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    const parts: string[] = [];
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (remainingDays > 0) parts.push(`${remainingDays} day${remainingDays > 1 ? 's' : ''}`);
    if (parts.length === 0 && totalSeconds > 0) {
        const hrs = Math.floor(totalSeconds / 3600);
        if (hrs > 0) return `${hrs} hour${hrs > 1 ? 's' : ''}`;
        const mins = Math.floor(totalSeconds / 60);
        if (mins > 0) return `${mins} min${mins > 1 ? 's' : ''}`;
        return `< 1 min`;
    }
    return parts.length > 0 ? parts.join(', ') : "< 1 day";
};

interface ActiveEngagementsProps {
    borrowedPools: LoanPoolFullDetails[];
    fundedPools: LenderPoolContributionDetails[];
    allPools: LoanPoolFullDetails[];
}

// Moved DetailItem to be defined once
const DetailItem: React.FC<{ label: string; value: React.ReactNode; className?: string, isCurrency?: boolean, isAddress?: boolean }> =
    ({ label, value, className, isCurrency, isAddress }) => (
        <div className={`py-2 border-b border-neutral-700/50 ${className}`}>
            <p className="text-xs text-white/60 font-shareTechMono uppercase tracking-wider">{label}</p>
            <p className={`text-md font-spaceGrotesk ${isCurrency ? 'text-neonGreen font-orbitron' : 'text-white'} ${isAddress ? 'truncate' : ''}`}>
                {isAddress && typeof value === 'string' ? `${value.slice(0, 6)}...${value.slice(-4)}` : value}
            </p>
        </div>
    );

const getStatusBadgeVariant = (statusText: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (statusText) {
        case 'Active': return 'default';
        case 'Funding': return 'secondary';
        case 'Repaid': return 'default';
        case 'Defaulted':
        case 'Cancelled': return 'destructive';
        case 'PendingInitialization': return 'outline';
        default: return 'secondary';
    }
};

export const ActiveEngagements: React.FC<ActiveEngagementsProps> = ({ borrowedPools, fundedPools, allPools }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<LoanPoolFullDetails | LenderPoolContributionDetails | null>(null);
    const [itemType, setItemType] = useState<'borrowing' | 'lending' | null>(null);
    const [repaymentAmount, setRepaymentAmount] = useState<string>("");
    const [repaymentMode, setRepaymentMode] = useState<'installment' | 'full' | null>(null);
    const queryClient = useQueryClient();

    const { writeContractAsync, isPending: isTransactionPending } = useWriteContract();
    const publicClient = usePublicClient();
    const { address } = useAccount();

    const handleViewDetails = (item: LoanPoolFullDetails | LenderPoolContributionDetails, type: 'borrowing' | 'lending') => {
        setSelectedItem(item);
        setItemType(type);
        setIsDetailsOpen(true);
    };

    const renderLoanStatus = (statusNum?: number): string => {
        if (typeof statusNum !== 'number') return "Unknown";
        return LoanStatus[statusNum] || "Unknown";
    };

    const handleRepayInstallment = async (poolAddress: string) => {
        if (!address || !publicClient) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            setRepaymentMode('installment');
            // Get the next installment details
            const [principalDue, interestDue] = await publicClient.readContract({
                address: poolAddress as `0x${string}`,
                abi: credoraLoanPoolAbi,
                functionName: 'getNextInstallmentDetails'
            }) as [bigint, bigint, bigint, boolean];

            // Total amount needed for the installment (principal + interest)
            const totalDue = principalDue + interestDue;

            if (totalDue <= 0n) {
                toast.error("No installment due at this time");
                return;
            }

            // 1. First, approve the USDC transfer
            const acceptedCurrency = (selectedItem as LoanPoolFullDetails).acceptedCurrency as `0x${string}`;

            const approveTxHash = await toast.promise(
                writeContractAsync({
                    address: acceptedCurrency,
                    abi: mockUsdcAbi,
                    functionName: 'approve',
                    args: [poolAddress as `0x${string}`, totalDue]
                }),
                {
                    loading: 'Approving currency transfer...',
                    success: 'Approval transaction submitted!',
                    error: (err) => `Error approving: ${err.message}`
                }
            ).unwrap();

            // Wait for approval transaction
            await toast.promise(
                publicClient.waitForTransactionReceipt({
                    hash: approveTxHash
                }),
                {
                    loading: 'Waiting for approval confirmation...',
                    success: 'Currency transfer approved!',
                    error: (err) => `Approval failed: ${err.message}`
                }
            ).unwrap();

            // 2. Now make the repayment
            const repayTxHash = await toast.promise(
                writeContractAsync({
                    address: poolAddress as `0x${string}`,
                    abi: credoraLoanPoolAbi,
                    functionName: 'repayInstallment'
                }),
                {
                    loading: 'Processing installment payment...',
                    success: 'Payment transaction submitted!',
                    error: (err) => `Error making payment: ${err.message}`
                }
            ).unwrap();

            // Wait for repayment transaction
            await toast.promise(
                publicClient.waitForTransactionReceipt({
                    hash: repayTxHash as `0x${string}`
                }),
                {
                    loading: 'Waiting for payment confirmation...',
                    success: 'Installment successfully paid!',
                    error: (err) => `Payment failed: ${err.message}`
                }
            ).unwrap();
            queryClient.invalidateQueries();

            setRepaymentMode(null);
            setIsDetailsOpen(false);

        } catch (error: any) {
            console.error("Transaction failed:", error);
            toast.error(`Transaction failed: ${error.message || "Unknown error"}`);
            setRepaymentMode(null);
        }
    };

    const handleFullLoanRepayment = async (poolAddress: string) => {
        if (!address || !publicClient) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            setRepaymentMode('full');
            // Get early repayment details
            const [outstandingPrincipal, currentInterestDue, totalAmountDue] = await publicClient.readContract({
                address: poolAddress as `0x${string}`,
                abi: credoraLoanPoolAbi,
                functionName: 'getEarlyRepaymentQuote'
            }) as [bigint, bigint, bigint];

            if (totalAmountDue <= 0n) {
                toast.error("No amount due for repayment");
                return;
            }

            // 1. First, approve the USDC transfer
            const acceptedCurrency = (selectedItem as LoanPoolFullDetails).acceptedCurrency as `0x${string}`;

            const approveTxHash = await toast.promise(
                writeContractAsync({
                    address: acceptedCurrency,
                    abi: mockUsdcAbi,
                    functionName: 'approve',
                    args: [poolAddress as `0x${string}`, totalAmountDue]
                }),
                {
                    loading: 'Approving currency transfer...',
                    success: 'Approval transaction submitted!',
                    error: (err) => `Error approving: ${err.message}`
                }
            ).unwrap();

            // Wait for approval transaction
            await toast.promise(
                publicClient.waitForTransactionReceipt({
                    hash: approveTxHash
                }),
                {
                    loading: 'Waiting for approval confirmation...',
                    success: 'Currency transfer approved!',
                    error: (err) => `Approval failed: ${err.message}`
                }
            ).unwrap();

            // 2. Now make the full repayment
            const repayTxHash = await toast.promise(
                writeContractAsync({
                    address: poolAddress as `0x${string}`,
                    abi: credoraLoanPoolAbi,
                    functionName: 'repayFullLoan'
                }),
                {
                    loading: 'Processing full loan repayment...',
                    success: 'Repayment transaction submitted!',
                    error: (err) => `Error making repayment: ${err.message}`
                }
            ).unwrap();

            // Wait for repayment transaction
            await toast.promise(
                publicClient.waitForTransactionReceipt({
                    hash: repayTxHash as `0x${string}`
                }),
                {
                    loading: 'Waiting for repayment confirmation...',
                    success: 'Loan successfully repaid in full!',
                    error: (err) => `Repayment failed: ${err.message}`
                }
            ).unwrap();
            queryClient.invalidateQueries();

            setRepaymentMode(null);
            setIsDetailsOpen(false);

        } catch (error: any) {
            console.error("Transaction failed:", error);
            toast.error(`Transaction failed: ${error.message || "Unknown error"}`);
            setRepaymentMode(null);
        }
    };

    const handleClaimYield = async (poolAddress: string) => {
        if (!address || !publicClient) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            const claimTxHash = await toast.promise(
                writeContractAsync({
                    address: poolAddress as `0x${string}`,
                    abi: credoraLoanPoolAbi,
                    functionName: 'claimYield'
                }),
                {
                    loading: 'Processing yield claim...',
                    success: 'Claim transaction submitted!',
                    error: (err) => `Error claiming: ${err.message}`
                }
            ).unwrap();

            // Wait for claim transaction
            await toast.promise(
                publicClient.waitForTransactionReceipt({
                    hash: claimTxHash as `0x${string}`
                }),
                {
                    loading: 'Waiting for claim confirmation...',
                    success: 'Successfully claimed your yield!',
                    error: (err) => `Claim failed: ${err.message}`
                }
            ).unwrap();
            queryClient.invalidateQueries();

            setIsDetailsOpen(false);

        } catch (error: any) {
            console.error("Transaction failed:", error);
            toast.error(`Transaction failed: ${error.message || "Unknown error"}`);
        }
    };

    const handleWithdrawCancelledFunds = async (poolAddress: string) => {
        if (!address || !publicClient) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            const withdrawTxHash = await toast.promise(
                writeContractAsync({
                    address: poolAddress as `0x${string}`,
                    abi: credoraLoanPoolAbi,
                    functionName: 'withdrawCancelledFunds'
                }),
                {
                    loading: 'Processing withdrawal...',
                    success: 'Withdrawal transaction submitted!',
                    error: (err) => `Error withdrawing: ${err.message}`
                }
            ).unwrap();

            // Wait for withdrawal transaction
            await toast.promise(
                publicClient.waitForTransactionReceipt({
                    hash: withdrawTxHash as `0x${string}`
                }),
                {
                    loading: 'Waiting for withdrawal confirmation...',
                    success: 'Successfully withdrew your funds!',
                    error: (err) => `Withdrawal failed: ${err.message}`
                }
            ).unwrap();
            queryClient.invalidateQueries();

            setIsDetailsOpen(false);

        } catch (error: any) {
            console.error("Transaction failed:", error);
            toast.error(`Transaction failed: ${error.message || "Unknown error"}`);
        }
    };

    return (
        <>
            <GlowingCard variant="red" className="p-6 min-h-[400px]">
                <h3 className="text-xl font-orbitron mb-4">My Active Engagements</h3>
                <Tabs defaultValue="borrowings" className="w-full flex flex-col flex-grow">
                    <TabsList className="grid grid-cols-2 mb-4 bg-neutral-800/50 border border-neutral-700 rounded-md">
                        <TabsTrigger value="borrowings" className="data-[state=active]:bg-neonRed/80 data-[state=active]:text-black font-orbitron py-2.5">My Borrowings</TabsTrigger>
                        <TabsTrigger value="lendings" className="data-[state=active]:bg-neonGreen/80 data-[state=active]:text-black font-orbitron py-2.5">My Lendings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="borrowings" className="space-y-3 max-h-[25rem] min-h-[25rem]   overflow-y-auto custom-scrollbar-transparent pr-1">
                        {borrowedPools && borrowedPools.length > 0 ? borrowedPools.map(loan => {
                            const displayStatus = renderLoanStatus(loan.currentStatus);
                            const interestRate = (Number(loan.interestRateBPS) / 100).toFixed(2) + '%';
                            return (
                                <div key={loan.poolAddress} className="border border-neonRed/40 rounded-md p-3.5 bg-black/40 hover:border-neonRed transition-all flex flex-col justify-between min-h-[180px]">
                                    <div>
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h4 className="text-md font-orbitron text-neonRed/90 truncate max-w-[calc(100%-80px)] glow-text-red">{loan.loanPurpose || "Unnamed Loan"}</h4>
                                            <Badge variant={getStatusBadgeVariant(displayStatus)} className="text-xs whitespace-nowrap">{displayStatus}</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2 font-spaceGrotesk">
                                            <div><span className="text-white/60">Amount:</span> <span className="text-white/90 font-medium">{formatCurrency(loan.loanAmountPrincipal)}</span></div>
                                            <div><span className="text-white/60">Rate:</span> <span className="text-white/90 font-medium">{interestRate}</span></div>
                                            <div><span className="text-white/60">Duration:</span> <span className="text-white/90 font-medium">{formatDuration(loan.durationSeconds)}</span></div>
                                            <div><span className="text-white/60">Next Due:</span> <span className="text-white/90 font-medium">{formatTimestamp(loan.nextInstallmentDueDate)}</span></div>
                                        </div>
                                    </div>
                                    <CyberButton variant="red" className="w-full text-xs py-2 mt-auto" onClick={() => handleViewDetails(loan, 'borrowing')}>
                                        View Details & Manage
                                    </CyberButton>
                                </div>
                            );
                        }) : <p className="text-center text-white/50 font-spaceGrotesk py-10">No active borrowings.</p>}
                    </TabsContent>

                    <TabsContent value="lendings" className="space-y-3 max-h-[25rem] min-h-[25rem] overflow-y-auto custom-scrollbar-transparent pr-1">
                        {fundedPools && fundedPools.length > 0 ? fundedPools.map(fund => {
                            const correspondingPool = allPools.find(p => p.poolAddress === fund.poolAddress);
                            if (!correspondingPool) return null; // Should not happen if data is consistent

                            let ownershipPercentage: string | null = null;
                            const userSharesValue = parseFloat(fund.shares);
                            const totalPoolValue = parseFloat(correspondingPool.totalFundsRaised);
                            if (totalPoolValue > 0) {
                                ownershipPercentage = ((userSharesValue / totalPoolValue) * 100).toFixed(2) + "%";
                            }
                            const displayStatus = renderLoanStatus(correspondingPool.currentStatus);
                            const poolInterestRate = (Number(correspondingPool.interestRateBPS) / 100).toFixed(2) + '%';

                            return (
                                <div key={fund.poolAddress} className="border border-neonGreen/40 rounded-md p-3.5 bg-black/40 hover:border-neonGreen transition-all flex flex-col justify-between min-h-[180px]">
                                    <div>
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h4 className="text-md font-orbitron text-neonGreen/90 truncate max-w-[calc(100%-80px)] glow-text-green">{correspondingPool.loanPurpose || `Pool ${fund.poolAddress.slice(0, 6)}...`}</h4>
                                            <Badge variant={getStatusBadgeVariant(displayStatus)} className="text-xs whitespace-nowrap">{displayStatus}</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2 font-spaceGrotesk">
                                            <div><span className="text-white/60">Your Share:</span> <span className="text-white/90 font-medium">{formatCurrency(fund.shares)}</span></div>
                                            {ownershipPercentage && <div><span className="text-white/60">Ownership:</span> <span className="text-white/90 font-medium">{ownershipPercentage}</span></div>}
                                            <div><span className="text-white/60">Pool Rate:</span> <span className="text-white/90 font-medium">{poolInterestRate}</span></div>
                                            <div><span className="text-white/60">Pool Duration:</span> <span className="text-white/90 font-medium">{formatDuration(correspondingPool.durationSeconds)}</span></div>
                                            <div><span className="text-white/60">Claimable:</span> <span className="text-neonGreen font-medium">{formatCurrency(parseFloat(fund.claimablePrincipalNow) + parseFloat(fund.claimableInterestNow))}</span></div>
                                            <div><span className="text-white/60">Total Raised:</span> <span className="text-white/90 font-medium">{formatCurrency(correspondingPool.totalFundsRaised)}</span></div>
                                        </div>
                                    </div>
                                    <CyberButton variant="green" className="w-full text-xs py-2 mt-auto" onClick={() => handleViewDetails(fund, 'lending')}>
                                        View Details & Manage
                                    </CyberButton>
                                </div>
                            );
                        }) : <p className="text-center text-white/50 font-spaceGrotesk py-10">No active lendings.</p>}
                    </TabsContent>
                </Tabs>
            </GlowingCard>

            <Credenza open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <CredenzaContent className="bg-black border-2 text-white max-w-xl transform-gpu font-spaceGrotesk border-neonGreen glow-neonGreen-border">
                    <CredenzaHeader>
                        <CredenzaTitle className="text-2xl font-orbitron text-neonGreen glow-neonGreen-text">
                            {itemType === 'borrowing'
                                ? (selectedItem as LoanPoolFullDetails)?.loanPurpose || "Loan Details"
                                : (allPools.find(p => p.poolAddress === (selectedItem as LenderPoolContributionDetails)?.poolAddress)?.loanPurpose || "Lending Investment Details")}
                        </CredenzaTitle>
                        <CredenzaDescription className="text-white/70 font-shareTechMono">
                            Pool Address: {selectedItem?.poolAddress}
                        </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody className="max-h-[calc(80vh-100px)] overflow-y-auto custom-scrollbar-transparent space-y-1 text-sm pr-2 md:pr-3">
                        {selectedItem && itemType === 'borrowing' && (
                            (() => {
                                const loan = selectedItem as LoanPoolFullDetails;
                                const status = renderLoanStatus(loan.currentStatus);
                                return (
                                    <>
                                        <DetailItem label="Loan Purpose" value={loan.loanPurpose} />
                                        <DetailItem label="Status" value={status} />
                                        <DetailItem label="Principal Amount" value={formatCurrency(loan.loanAmountPrincipal)} isCurrency />
                                        <DetailItem label="Interest Rate" value={`${(Number(loan.interestRateBPS) / 100).toFixed(2)}%`} />
                                        <DetailItem label="Loan Duration" value={formatDuration(loan.durationSeconds)} />
                                        <DetailItem label="Installments" value={`${loan.currentInstallmentPaidCount.toString()} / ${loan.numberOfInstallments.toString()} Paid`} />
                                        <DetailItem label="Total Funds Raised" value={formatCurrency(loan.totalFundsRaised)} isCurrency />
                                        <DetailItem label="Loan Start Date" value={formatTimestamp(loan.loanStartTime)} />
                                        <DetailItem label="Maturity Date" value={formatTimestamp(loan.maturityTime)} />
                                        <DetailItem label="Next Due Date" value={formatTimestamp(loan.nextInstallmentDueDate)} />
                                        <DetailItem label="Principal per Period" value={formatCurrency(loan.installmentPrincipalPerPeriod)} isCurrency />
                                        <DetailItem label="Interest per Period" value={formatCurrency(loan.installmentInterestPerPeriod)} isCurrency />
                                        <DetailItem label="Total Principal Repaid" value={formatCurrency(loan.totalPrincipalRepaid)} isCurrency />
                                        <DetailItem label="Total Interest Repaid" value={formatCurrency(loan.totalInterestRepaid)} isCurrency />
                                        <DetailItem label="Installment Interval" value={formatDuration(loan.installmentIntervalSeconds)} />
                                        <DetailItem label="Accepted Currency" value={loan.acceptedCurrency} isAddress />
                                        <DetailItem label="Pool Token" value={`${loan.poolTokenName} (${loan.poolTokenSymbol})`} />
                                        <DetailItem label="Token Decimals" value={loan.tokenDecimals.toString()} />
                                        <DetailItem label="Pool Admin" value={loan.poolAdmin} isAddress />
                                        <DetailItem label="Paused" value={loan.isPaused ? 'Yes' : 'No'} />

                                        {status === 'Active' && (
                                            <motion.div
                                                className="pt-4 space-y-3"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <h4 className="text-lg font-orbitron text-neonRed glow-text-red border-b border-neonRed/30 pb-1">Repayment Options</h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                                    <CyberButton
                                                        variant="red"
                                                        className="w-full text-sm"
                                                        onClick={() => handleRepayInstallment(loan.poolAddress)}
                                                        disabled={isTransactionPending || repaymentMode !== null}
                                                    >
                                                        {isTransactionPending && repaymentMode === 'installment' ? 'Processing...' : 'Pay Next Installment'}
                                                    </CyberButton>

                                                    <CyberButton
                                                        variant="red"
                                                        className="w-full text-sm"
                                                        onClick={() => handleFullLoanRepayment(loan.poolAddress)}
                                                        disabled={isTransactionPending || repaymentMode !== null}
                                                    >
                                                        {isTransactionPending && repaymentMode === 'full' ? 'Processing...' : 'Repay Loan in Full'}
                                                    </CyberButton>
                                                </div>
                                            </motion.div>
                                        )}
                                    </>
                                );
                            })()
                        )}
                        {selectedItem && itemType === 'lending' && (
                            (() => {
                                const fund = selectedItem as LenderPoolContributionDetails;
                                const pool = allPools.find(p => p.poolAddress === fund.poolAddress);
                                if (!pool) return <p className="text-neonRed">Error: Pool details not found.</p>;

                                let ownershipPercentage: string | null = null;
                                const userSharesValue = parseFloat(fund.shares);
                                const totalPoolValue = parseFloat(pool.totalFundsRaised);
                                if (totalPoolValue > 0) {
                                    ownershipPercentage = ((userSharesValue / totalPoolValue) * 100).toFixed(2) + "%";
                                }

                                const status = renderLoanStatus(pool.currentStatus);
                                const hasClaimable = parseFloat(fund.claimablePrincipalNow) > 0 || parseFloat(fund.claimableInterestNow) > 0;
                                const isCancelled = status === 'Cancelled';

                                return (
                                    <>

                                        <h4 className="text-lg font-orbitron text-neonGreen/80 pt-2 pb-1 border-b border-neonGreen/20">Your Contribution</h4>
                                        <DetailItem label="Value of Shares Owned" value={formatCurrency(fund.shares)} isCurrency />
                                        {ownershipPercentage && <DetailItem label="Your Pool Ownership" value={ownershipPercentage} />}
                                        <DetailItem label="Claimable Principal Now" value={formatCurrency(fund.claimablePrincipalNow)} isCurrency />
                                        <DetailItem label="Claimable Interest Now" value={formatCurrency(fund.claimableInterestNow)} isCurrency />
                                        <DetailItem label="Principal Already Claimed" value={formatCurrency(fund.principalAlreadyClaimedByLender)} isCurrency />

                                        <h4 className="text-lg font-orbitron text-neonGreen/80 pt-4 pb-1 border-b border-neonGreen/20">Pool Details</h4>
                                        <DetailItem label="Pool Purpose" value={pool.loanPurpose} />
                                        <DetailItem label="Status" value={status} />
                                        <DetailItem label="Target Amount" value={formatCurrency(pool.loanAmountPrincipal)} isCurrency />
                                        <DetailItem label="Total Funds Raised" value={formatCurrency(pool.totalFundsRaised)} isCurrency />
                                        <DetailItem label="Interest Rate" value={`${(Number(pool.interestRateBPS) / 100).toFixed(2)}%`} />
                                        <DetailItem label="Loan Duration" value={formatDuration(pool.durationSeconds)} />
                                        <DetailItem label="Installments" value={`${pool.currentInstallmentPaidCount.toString()} / ${pool.numberOfInstallments.toString()} Paid`} />
                                        <DetailItem label="Loan Start Date" value={formatTimestamp(pool.loanStartTime)} />
                                        <DetailItem label="Maturity Date" value={formatTimestamp(pool.maturityTime)} />
                                        <DetailItem label="Accepted Currency" value={pool.acceptedCurrency} isAddress />
                                        <DetailItem label="Pool Token" value={`${pool.poolTokenName} (${pool.poolTokenSymbol})`} />
                                        <DetailItem label="Paused" value={pool.isPaused ? 'Yes' : 'No'} />

                                        <motion.div
                                            className="pt-4 space-y-3"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {status === 'Repaid' && hasClaimable && (
                                                <CyberButton
                                                    variant="green"
                                                    className="w-full"
                                                    onClick={() => handleClaimYield(fund.poolAddress)}
                                                    disabled={isTransactionPending}
                                                >
                                                    {isTransactionPending ? 'Processing...' : 'Claim Available Yield'}
                                                </CyberButton>
                                            )}

                                            {isCancelled && parseFloat(fund.shares) > 0 && (
                                                <CyberButton
                                                    variant="green"
                                                    className="w-full"
                                                    onClick={() => handleWithdrawCancelledFunds(fund.poolAddress)}
                                                    disabled={isTransactionPending}
                                                >
                                                    {isTransactionPending ? 'Processing...' : 'Withdraw Cancelled Funds'}
                                                </CyberButton>
                                            )}

                                            {!hasClaimable && !isCancelled && (
                                                <p className="text-center text-white/60 font-spaceGrotesk text-sm italic">
                                                    {status === 'Repaid' ? 'No yield currently available to claim' :
                                                        status === 'Active' ? 'Yield will be available when loan is repaid' :
                                                            'No actions available for this pool'}
                                                </p>
                                            )}
                                        </motion.div>
                                    </>
                                );
                            })()
                        )}
                    </CredenzaBody>
                </CredenzaContent>
            </Credenza>
            <style jsx global>{`
                .glow-text-green {
                    text-shadow: 0 0 4px #00FF00, 0 0 8px #00FF00;
                }
                .glow-text-red {
                    text-shadow: 0 0 4px #FF3131, 0 0 8px #FF3131;
                }
                .glow-neonGreen-text {
                    text-shadow: 0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 15px #00FF00;
                }
                .glow-neonGreen-border {
                    box-shadow: 0 0 8px #00FF00, 0 0 12px #00FF00, 0 0 16px #00FF00;
                }
                .custom-scrollbar-transparent::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar-transparent::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-transparent::-webkit-scrollbar-thumb {
                    background: rgba(0, 255, 0, 0.3);
                    border-radius: 3px;
                }
                .custom-scrollbar-transparent::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 255, 0, 0.5);
                }
            `}</style>
        </>
    );
};

export default ActiveEngagements; 