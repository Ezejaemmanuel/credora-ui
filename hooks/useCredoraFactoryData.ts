import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import {
    useReadCredoraPoolFactoryGetUserComprehensiveDetails,
    useReadCredoraPoolFactoryGetAllPoolsGeneralDetails,
    useReadCredoraPoolFactoryGetFactoryFinancialSnapshot,
} from "@/generated";
import type {
    UserComprehensiveDetails as FormattedUserComprehensiveDetails,
    LoanPoolFullDetails as FormattedLoanPoolFullDetails,
    FactorySnapshot as FormattedFactorySnapshot,
    BorrowerRiskProfile as FormattedBorrowerRiskProfile,
    LenderPoolContributionDetails as FormattedLenderPoolContributionDetails,
    CredoraFactoryData,
    Address
} from "@/types/credora";

// --- Raw types (as returned by wagmi hooks with bigints) ---
// These mirror the structures but ensure currency fields are bigints for formatUnits.

interface RawBorrowerRiskProfile {
    maxLoanAmount: bigint;
    interestRateBPS: bigint;
    assessmentTimestamp: bigint;
    exists: boolean;
}

interface RawLoanPoolFullDetails {
    poolAddress: Address;
    borrower: Address;
    loanAmountPrincipal: bigint;
    interestRateBPS: bigint;
    durationSeconds: bigint;
    numberOfInstallments: bigint;
    acceptedCurrency: Address;
    loanPurpose: string;
    poolTokenName: string;
    poolTokenSymbol: string;
    tokenDecimals: number;
    poolAdmin: Address;
    currentStatus: number;
    totalFundsRaised: bigint;
    loanStartTime: bigint;
    maturityTime: bigint;
    totalPrincipalRepaid: bigint;
    totalInterestRepaid: bigint;
    currentInstallmentPaidCount: bigint;
    installmentIntervalSeconds: bigint;
    installmentPrincipalPerPeriod: bigint;
    installmentInterestPerPeriod: bigint;
    nextInstallmentDueDate: bigint;
    isPaused: boolean;
}

interface RawLenderPoolContributionDetails {
    poolAddress: Address;
    shares: bigint;
    principalAlreadyClaimedByLender: bigint;
    claimablePrincipalNow: bigint;
    claimableInterestNow: bigint;
}

interface RawUserComprehensiveDetails {
    riskProfile: RawBorrowerRiskProfile;
    borrowedPools: readonly RawLoanPoolFullDetails[]; // wagmi often returns readonly arrays
    fundedPools: readonly RawLenderPoolContributionDetails[]; // wagmi often returns readonly arrays
}

interface RawFactorySnapshot {
    totalPoolsCreated: bigint;
    countFundingPools: bigint;
    countActivePools: bigint;
    countRepaidPools: bigint;
    countDefaultedPools: bigint;
    countCancelledPools: bigint;
    countPendingInitializationPools: bigint;
    totalValueInFunding: bigint;
    totalPrincipalActiveLoans: bigint;
    totalOverallPrincipalRepaid: bigint;
    totalOverallInterestRepaid: bigint;
}

// Hook's return type using Formatted types
interface UseCredoraFactoryDataResult {
    data: CredoraFactoryData | undefined;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    error: Error | null;
    refetchAll: () => void;
}

const USDC_DECIMALS = 6;

// --- Helper formatting functions ---
// Input: Raw types with bigints
// Output: Formatted types with strings

function formatBorrowerRiskProfile(profile: RawBorrowerRiskProfile): FormattedBorrowerRiskProfile {
    return {
        ...profile,
        maxLoanAmount: formatUnits(profile.maxLoanAmount, USDC_DECIMALS),
    };
}

function formatLoanPoolFullDetails(pool: RawLoanPoolFullDetails): FormattedLoanPoolFullDetails {
    return {
        ...pool,
        loanAmountPrincipal: formatUnits(pool.loanAmountPrincipal, USDC_DECIMALS),
        totalFundsRaised: formatUnits(pool.totalFundsRaised, USDC_DECIMALS),
        totalPrincipalRepaid: formatUnits(pool.totalPrincipalRepaid, USDC_DECIMALS),
        totalInterestRepaid: formatUnits(pool.totalInterestRepaid, USDC_DECIMALS),
        installmentPrincipalPerPeriod: formatUnits(pool.installmentPrincipalPerPeriod, USDC_DECIMALS),
        installmentInterestPerPeriod: formatUnits(pool.installmentInterestPerPeriod, USDC_DECIMALS),
    };
}

function formatLenderPoolContributionDetails(contribution: RawLenderPoolContributionDetails): FormattedLenderPoolContributionDetails {
    return {
        ...contribution,
        shares: formatUnits(contribution.shares, USDC_DECIMALS),
        principalAlreadyClaimedByLender: formatUnits(contribution.principalAlreadyClaimedByLender, USDC_DECIMALS),
        claimablePrincipalNow: formatUnits(contribution.claimablePrincipalNow, USDC_DECIMALS),
        claimableInterestNow: formatUnits(contribution.claimableInterestNow, USDC_DECIMALS),
    };
}

function formatUserComprehensiveDetails(details: RawUserComprehensiveDetails): FormattedUserComprehensiveDetails {
    return {
        riskProfile: formatBorrowerRiskProfile(details.riskProfile),
        borrowedPools: details.borrowedPools.map(formatLoanPoolFullDetails),
        fundedPools: details.fundedPools.map(formatLenderPoolContributionDetails),
    };
}

function formatFactorySnapshot(snapshot: RawFactorySnapshot): FormattedFactorySnapshot {
    return {
        ...snapshot,
        totalValueInFunding: formatUnits(snapshot.totalValueInFunding, USDC_DECIMALS),
        totalPrincipalActiveLoans: formatUnits(snapshot.totalPrincipalActiveLoans, USDC_DECIMALS),
        totalOverallPrincipalRepaid: formatUnits(snapshot.totalOverallPrincipalRepaid, USDC_DECIMALS),
        totalOverallInterestRepaid: formatUnits(snapshot.totalOverallInterestRepaid, USDC_DECIMALS),
    };
}

/**
 * Custom hook to fetch comprehensive data from the CredoraPoolFactory contract.
 * It combines data from wagmi hooks and formats USDC values to strings.
 */
export function useCredoraFactoryData(): UseCredoraFactoryDataResult {
    const { address: userAddress } = useAccount();

    const userDetailsQuery = useReadCredoraPoolFactoryGetUserComprehensiveDetails({
        args: userAddress ? [userAddress as Address] : undefined,
    });

    const allPoolsQuery = useReadCredoraPoolFactoryGetAllPoolsGeneralDetails();

    const snapshotQuery = useReadCredoraPoolFactoryGetFactoryFinancialSnapshot();

    const isLoading = userDetailsQuery.isLoading || allPoolsQuery.isLoading || snapshotQuery.isLoading;
    const isFetching = userDetailsQuery.isFetching || allPoolsQuery.isFetching || snapshotQuery.isFetching;
    const isError = userDetailsQuery.isError || allPoolsQuery.isError || snapshotQuery.isError;
    const error = userDetailsQuery.error || allPoolsQuery.error || snapshotQuery.error;

    const refetchAll = () => {
        userDetailsQuery.refetch();
        allPoolsQuery.refetch();
        snapshotQuery.refetch();
    };

    const combinedData: CredoraFactoryData | undefined =
        !isLoading && !isError && userDetailsQuery.data && allPoolsQuery.data && snapshotQuery.data
            ? {
                userComprehensiveDetails: formatUserComprehensiveDetails(userDetailsQuery.data as RawUserComprehensiveDetails),
                allPoolsGeneralDetails: (allPoolsQuery.data as readonly RawLoanPoolFullDetails[]).map(formatLoanPoolFullDetails),
                factoryFinancialSnapshot: formatFactorySnapshot(snapshotQuery.data as RawFactorySnapshot),
            }
            : undefined;

    return {
        data: combinedData,
        isLoading,
        isError,
        isFetching,
        error: error ? new Error(String(error)) : null,
        refetchAll,
    };
} 