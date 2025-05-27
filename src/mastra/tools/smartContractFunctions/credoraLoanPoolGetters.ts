import { publicClient } from "@/lib/viemConfig";
import { credoraLoanPoolConfig } from "@/generated"; // Assuming this exists and contains the ABI
import {
    FullLoanPoolDetails,
    RawFullLoanPoolDetails,
    LenderPoolContributionDetails,
    PoolDynamicState,
    RawPoolDynamicState,
    NextInstallmentDetails,
    EarlyRepaymentQuote,
    FundingStatus,
    TimeMetrics,
    AccruedInterestDetails,
    ContractErrorResponse,
    mapLoanStatus
} from "@/types/contractTypes";
import { formatCurrency, formatInterestRate, formatTimestamp, formatDuration, formatNumber } from "@/lib/formatters";

const LOAN_POOL_ABI = credoraLoanPoolConfig.abi; // Make sure this path is correct

// Helper function to validate address
function isValidAddress(address: string): boolean {
    return !!address && address.startsWith('0x') && address.length === 42;
}

export const getLoanPoolInfo = async (loanPoolAddress: `0x${string}`): Promise<FullLoanPoolDetails | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "getLoanPoolInfo",
        });

        // The raw data from the contract
        const rawData = data as RawFullLoanPoolDetails;

        // Format the data for UI display
        return {
            poolAddress: rawData.poolAddress,
            borrower: rawData.borrower,
            loanAmountPrincipal: formatCurrency(rawData.loanAmountPrincipal),
            interestRateBPS: formatInterestRate(rawData.interestRateBPS),
            durationSeconds: formatDuration(rawData.durationSeconds),
            numberOfInstallments: formatNumber(rawData.numberOfInstallments),
            acceptedCurrency: rawData.acceptedCurrency,
            loanPurpose: rawData.loanPurpose,
            poolTokenName: rawData.poolTokenName,
            poolTokenSymbol: rawData.poolTokenSymbol,
            tokenDecimals: rawData.tokenDecimals,
            poolAdmin: rawData.poolAdmin,
            currentStatus: rawData.currentStatus,
            statusLabel: mapLoanStatus(rawData.currentStatus),
            totalFundsRaised: formatCurrency(rawData.totalFundsRaised),
            loanStartTime: formatTimestamp(rawData.loanStartTime),
            maturityTime: formatTimestamp(rawData.maturityTime),
            totalPrincipalRepaid: formatCurrency(rawData.totalPrincipalRepaid),
            totalInterestRepaid: formatCurrency(rawData.totalInterestRepaid),
            currentInstallmentPaidCount: formatNumber(rawData.currentInstallmentPaidCount),
            installmentIntervalSeconds: formatDuration(rawData.installmentIntervalSeconds),
            installmentPrincipalPerPeriod: formatCurrency(rawData.installmentPrincipalPerPeriod),
            installmentInterestPerPeriod: formatCurrency(rawData.installmentInterestPerPeriod),
            nextInstallmentDueDate: formatTimestamp(rawData.nextInstallmentDueDate),
            isPaused: rawData.isPaused,
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getLoanPoolInfo on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const name = async (loanPoolAddress: `0x${string}`): Promise<string | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "name",
        });
        return data as string;
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling name on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const symbol = async (loanPoolAddress: `0x${string}`): Promise<string | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "symbol",
        });
        return data as string;
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling symbol on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const decimals = async (loanPoolAddress: `0x${string}`): Promise<number | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "decimals",
        });
        return data as number;
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling decimals on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};


export const getLenderPoolInformation = async (loanPoolAddress: `0x${string}`, lenderAddress: `0x${string}`): Promise<LenderPoolContributionDetails | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    if (!isValidAddress(lenderAddress)) return { error: "Invalid lender address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "getLenderPoolInformation",
            args: [lenderAddress]
        });

        // Format the raw data
        const rawData = data as {
            shares: bigint;
            principalAlreadyClaimedByLender: bigint;
            claimablePrincipalNow: bigint;
            claimableInterestNow: bigint;
        };

        return {
            poolAddress: loanPoolAddress, // Add the pool address since it's optional in the type
            shares: formatCurrency(rawData.shares),
            principalAlreadyClaimedByLender: formatCurrency(rawData.principalAlreadyClaimedByLender),
            claimablePrincipalNow: formatCurrency(rawData.claimablePrincipalNow),
            claimableInterestNow: formatCurrency(rawData.claimableInterestNow),
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getLenderPoolInformation on ${loanPoolAddress} for lender ${lenderAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const getPoolDynamicState = async (loanPoolAddress: `0x${string}`): Promise<PoolDynamicState | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "getPoolDynamicState",
        });
        const result = data as readonly [number, bigint, bigint, bigint, bigint, bigint, boolean];

        // Create a raw data object
        const rawState: RawPoolDynamicState = {
            status: result[0],
            fundsRaised: result[1],
            principalRepaid: result[2],
            interestRepaid: result[3],
            installmentsPaidCount: result[4],
            nextDueDateTime: result[5],
            currentlyPaused: result[6],
        };

        // Format the data for UI display
        return {
            status: rawState.status,
            statusLabel: mapLoanStatus(rawState.status),
            fundsRaised: formatCurrency(rawState.fundsRaised),
            principalRepaid: formatCurrency(rawState.principalRepaid),
            interestRepaid: formatCurrency(rawState.interestRepaid),
            installmentsPaidCount: formatNumber(rawState.installmentsPaidCount),
            nextDueDateTime: formatTimestamp(rawState.nextDueDateTime),
            currentlyPaused: rawState.currentlyPaused,
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getPoolDynamicState on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const getNextInstallmentDetails = async (loanPoolAddress: `0x${string}`): Promise<NextInstallmentDetails | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "getNextInstallmentDetails",
        });
        const result = data as readonly [bigint, bigint, bigint, boolean];
        return {
            principalDue: formatCurrency(result[0]),
            interestDue: formatCurrency(result[1]),
            dueDate: formatTimestamp(result[2]),
            isFinalInstallment: result[3],
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getNextInstallmentDetails on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const getEarlyRepaymentQuote = async (loanPoolAddress: `0x${string}`): Promise<EarlyRepaymentQuote | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "getEarlyRepaymentQuote",
        });
        const result = data as readonly [bigint, bigint, bigint];
        return {
            outstandingPrincipal: formatCurrency(result[0]),
            currentInterestDue: formatCurrency(result[1]),
            totalAmountDue: formatCurrency(result[2]),
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getEarlyRepaymentQuote on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const getFundingStatus = async (loanPoolAddress: `0x${string}`): Promise<FundingStatus | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "getFundingStatus",
        });
        const result = data as readonly [bigint, bigint, bigint, boolean];
        return {
            fundedAmount: formatCurrency(result[0]),
            requiredAmount: formatCurrency(result[1]),
            remainingToFund: formatCurrency(result[2]),
            isFullyFunded: result[3],
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getFundingStatus on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const getTimeMetrics = async (loanPoolAddress: `0x${string}`): Promise<TimeMetrics | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "getTimeMetrics",
        });
        const result = data as readonly [bigint, bigint, bigint];
        return {
            timeElapsedSinceStart: formatDuration(result[0]),
            timeRemainingOnLoan: formatDuration(result[1]),
            timeUntilNextInstallment: formatDuration(result[2]),
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getTimeMetrics on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const getAccruedInterestDetails = async (loanPoolAddress: `0x${string}`): Promise<AccruedInterestDetails | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "getAccruedInterestDetails",
        });
        const result = data as readonly [bigint, bigint, bigint];
        return {
            totalInterestCalculatedForLoan: formatCurrency(result[0]),
            interestAccruedSoFar: formatCurrency(result[1]),
            interestRemainingToRepay: formatCurrency(result[2]),
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getAccruedInterestDetails on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

// View functions from ERC20 part of CredoraLoanPool
export const totalSupply = async (loanPoolAddress: `0x${string}`): Promise<string | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "totalSupply",
        });
        return formatCurrency(data as bigint);
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling totalSupply on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const balanceOf = async (loanPoolAddress: `0x${string}`, account: `0x${string}`): Promise<string | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    if (!isValidAddress(account)) return { error: "Invalid account address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "balanceOf",
            args: [account]
        });
        return formatCurrency(data as bigint);
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling balanceOf on ${loanPoolAddress} for account ${account}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

// Other relevant view functions from CredoraLoanPool
export const borrower = async (loanPoolAddress: `0x${string}`): Promise<`0x${string}` | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "borrower",
        });
        return data as `0x${string}`;
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling borrower on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

export const loanAmountPrincipal = async (loanPoolAddress: `0x${string}`): Promise<string | ContractErrorResponse> => {
    if (!isValidAddress(loanPoolAddress)) return { error: "Invalid loan pool address provided." };
    try {
        const data = await publicClient.readContract({
            address: loanPoolAddress,
            abi: LOAN_POOL_ABI,
            functionName: "loanAmountPrincipal",
        });
        return formatCurrency(data as bigint);
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling loanAmountPrincipal on ${loanPoolAddress}:`, error);
        return { error: error.message || `An unexpected error occurred.` };
    }
};

// Add other view functions like interestRateBPS, durationSeconds, acceptedCurrency, poolAdmin, loanPurpose etc.
// For brevity, I'll stop here, but the pattern is the same. 