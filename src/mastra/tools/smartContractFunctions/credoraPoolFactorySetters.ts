import { credoraPoolFactoryConfig } from "@/generated";
import { aiWalletClient, publicClient } from "@/lib/viemConfig";
import { TransactionSuccessResponse, ContractErrorResponse } from "@/types/contractTypes";
import { parseUnits } from "viem";

const FACTORY_ADDRESS = credoraPoolFactoryConfig.address[42421]; // Assuming 42421 is the correct chainId
const FACTORY_ABI = credoraPoolFactoryConfig.abi;
const USDC_DECIMALS = 6; // USDC has 6 decimals

/**
 * Sets the risk profile for a user on the CredoraPoolFactory contract.
 * Can only be called by an account with AI_ROLE.
 * @param userAddress The address of the user (borrower).
 * @param maxLoanAmount The maximum loan amount the user is eligible for (in USDC).
 * @param interestRateBPS The suggested interest rate in basis points (as a number).
 * @returns A promise that resolves to a success object or an error message.
 */
export const setRiskProfile = async (
    userAddress: `0x${string}`,
    maxLoanAmount: number,
    interestRateBPS: number
): Promise<TransactionSuccessResponse | ContractErrorResponse> => {
    // Input validation
    if (!userAddress || !userAddress.startsWith('0x')) {
        return { error: "Invalid user address." };
    }

    try {
        // Convert maxLoanAmount to BigInt with proper USDC decimals
        const maxLoanAmountBigInt = parseUnits(maxLoanAmount.toString(), USDC_DECIMALS);

        // Convert interestRateBPS to BigInt
        const interestRateBPSBigInt = BigInt(interestRateBPS);

        // Fetch MAX_INTEREST_RATE_BPS from contract for validation
        const maxInterestRateFromContract = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "MAX_INTEREST_RATE_BPS",
        }) as bigint;

        if (interestRateBPSBigInt < 0n || interestRateBPSBigInt > maxInterestRateFromContract) {
            return { error: `Interest rate BPS is out of valid range (0-${maxInterestRateFromContract}).` };
        }

        // Proceed with writing to the contract
        const txHash = await aiWalletClient.writeContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "setRiskProfile",
            args: [userAddress, maxLoanAmountBigInt, interestRateBPSBigInt],
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'success') {
            console.log(`setRiskProfile executed successfully. Transaction hash:`, txHash);
            return {
                success: true,
                message: "Risk profile set successfully.",
                transactionHash: txHash
            };
        } else {
            console.error(`Transaction for setRiskProfile failed. Receipt:`, receipt);
            return { error: `Transaction for setRiskProfile failed with status: ${receipt.status}` };
        }

    } catch (err: any) {
        // Catch errors from both readContract (MAX_INTEREST_RATE_BPS) and writeContract/waitForTransactionReceipt
        console.error(`Error in setRiskProfile for ${userAddress}:`, err);
        let errorMessage = "An unexpected error occurred while setting the risk profile.";
        if (err.shortMessage) {
            errorMessage = err.shortMessage;
        } else if (err.message) {
            errorMessage = err.message;
        }
        // Distinguish if error was during MAX_INTEREST_RATE_BPS fetch or the main transaction
        if (err.functionName === "MAX_INTEREST_RATE_BPS" || (err.message && err.message.includes("MAX_INTEREST_RATE_BPS"))) {
            return { error: `Failed to validate interest rate: ${errorMessage}` };
        }
        return { error: `Error setting risk profile: ${errorMessage}` };
    }
};

/**
 * Creates a new loan pool for a borrower using the CredoraPoolFactory contract.
 * Can only be called by an account with POOL_CREATOR_ROLE (which can be the AI).
 * @param borrower The address of the borrower.
 * @param loanAmount The principal amount for the loan in USDC.
 * @param durationSeconds The duration of the loan in seconds (as a number).
 * @param numberOfInstallments The number of installments for the loan (as a number).
 * @param poolTokenName The name for the ERC20 token representing shares in this new pool.
 * @param poolTokenSymbol The symbol for the ERC20 token.
 * @param purpose The stated purpose of the loan.
 * @returns A promise that resolves to a success object or an error message.
 */
export const createLoanPool = async (
    borrower: `0x${string}`,
    loanAmount: number,
    durationSeconds: number,
    numberOfInstallments: number,
    poolTokenName: string,
    poolTokenSymbol: string,
    purpose: string
): Promise<TransactionSuccessResponse | ContractErrorResponse> => {
    // Basic input validation
    if (!borrower || !borrower.startsWith('0x')) {
        return { error: "Invalid borrower address." };
    }
    if (loanAmount <= 0) {
        return { error: "Loan amount must be positive." };
    }
    if (durationSeconds <= 0) {
        return { error: "Duration must be positive." };
    }
    if (numberOfInstallments <= 0) {
        return { error: "Number of installments must be positive." };
    }
    if (durationSeconds < numberOfInstallments) {
        // This check is also in the contract, good to have client-side for immediate feedback.
        // Assuming 1 installment per second is the minimum granularity.
        return { error: "Duration in seconds cannot be less than the number of installments." };
    }
    if (!poolTokenName.trim()) {
        return { error: "Pool token name cannot be empty." };
    }
    if (!poolTokenSymbol.trim()) {
        return { error: "Pool token symbol cannot be empty." };
    }
    if (!purpose.trim()) {
        return { error: "Loan purpose cannot be empty." };
    }

    try {
        // Convert number inputs to BigInt
        const loanAmountBigInt = parseUnits(loanAmount.toString(), USDC_DECIMALS);
        const durationSecondsBigInt = BigInt(durationSeconds);
        const numberOfInstallmentsBigInt = BigInt(numberOfInstallments);

        // The contract has more robust checks against the borrower's risk profile,
        // such as if the risk profile exists and if the loanAmount exceeds maxLoanAmount.
        // We'll let the contract handle those specific reverts.

        const txHash = await aiWalletClient.writeContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "createLoanPool",
            args: [
                borrower,
                loanAmountBigInt,
                durationSecondsBigInt,
                numberOfInstallmentsBigInt,
                poolTokenName,
                poolTokenSymbol,
                purpose
            ],
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'success') {
            // Attempt to find the LoanPoolCreated event to get the poolAddress
            // This is a more robust way than assuming the return value of createLoanPool if it doesn't return it directly
            // For now, we just confirm success. If poolAddress is needed, event parsing would be added here.
            console.log(`createLoanPool executed successfully. Transaction hash:`, txHash);
            return {
                success: true,
                message: "Loan pool created successfully.",
                transactionHash: txHash
            };
        } else {
            console.error(`Transaction for createLoanPool failed. Receipt:`, receipt);
            return { error: `Transaction for createLoanPool failed with status: ${receipt.status}` };
        }

    } catch (err: any) {
        console.error(`Error in createLoanPool for borrower ${borrower}:`, err);
        let errorMessage = "An unexpected error occurred while creating the loan pool.";
        if (err.shortMessage) {
            errorMessage = err.shortMessage;
        } else if (err.message) {
            errorMessage = err.message;
        }
        return { error: `Error creating loan pool: ${errorMessage}` };
    }
}; 