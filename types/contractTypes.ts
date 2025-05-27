/**
 * Types corresponding to structs and enums in Credora smart contracts
 */

// Corresponds to Solidity enum: CredoraLoanPool.LoanStatus
export type LoanStatus =
    | "PendingInitialization"
    | "Funding"
    | "Active"
    | "Repaid"
    | "Defaulted"
    | "Cancelled";

// Helper to map number from contract to LoanStatus string
export function mapLoanStatus(statusNumber: number): LoanStatus {
    switch (statusNumber) {
        case 0: return "PendingInitialization";
        case 1: return "Funding";
        case 2: return "Active";
        case 3: return "Repaid";
        case 4: return "Defaulted";
        case 5: return "Cancelled";
        default: throw new Error(`Unknown loan status number: ${statusNumber}`);
    }
}

// Raw interfaces to represent direct data from contracts (with bigint)
export interface RawBorrowerRiskProfile {
    maxLoanAmount: bigint;
    interestRateBPS: bigint;
    assessmentTimestamp: bigint;
    exists: boolean;
}

export interface RawFullLoanPoolDetails {
    poolAddress: `0x${string}`;
    borrower: `0x${string}`;
    loanAmountPrincipal: bigint;
    interestRateBPS: bigint;
    durationSeconds: bigint;
    numberOfInstallments: bigint;
    acceptedCurrency: `0x${string}`;
    loanPurpose: string;
    poolTokenName: string;
    poolTokenSymbol: string;
    tokenDecimals: number; // uint8
    poolAdmin: `0x${string}`;
    currentStatus: number; // uint8, maps to LoanStatus enum
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

export interface RawLenderPoolContributionDetails {
    poolAddress?: `0x${string}`; // Optional as it's part of UserComprehensiveDetails array context
    shares: bigint;
    principalAlreadyClaimedByLender: bigint;
    claimablePrincipalNow: bigint;
    claimableInterestNow: bigint;
}

export interface RawUserComprehensiveDetails {
    riskProfile: RawBorrowerRiskProfile;
    borrowedPools: RawFullLoanPoolDetails[];
    fundedPools: RawLenderPoolContributionDetails[];
}

export interface RawFactorySnapshot {
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

export interface RawPoolDynamicState {
    status: number; // maps to LoanStatus
    fundsRaised: bigint;
    principalRepaid: bigint;
    interestRepaid: bigint;
    installmentsPaidCount: bigint;
    nextDueDateTime: bigint;
    currentlyPaused: boolean;
}

export interface RawNextInstallmentDetails {
    principalDue: bigint;
    interestDue: bigint;
    dueDate: bigint;
    isFinalInstallment: boolean;
}

export interface RawEarlyRepaymentQuote {
    outstandingPrincipal: bigint;
    currentInterestDue: bigint;
    totalAmountDue: bigint;
}

export interface RawFundingStatus {
    fundedAmount: bigint;
    requiredAmount: bigint;
    remainingToFund: bigint;
    isFullyFunded: boolean;
}

export interface RawTimeMetrics {
    timeElapsedSinceStart: bigint;
    timeRemainingOnLoan: bigint;
    timeUntilNextInstallment: bigint;
}

export interface RawAccruedInterestDetails {
    totalInterestCalculatedForLoan: bigint;
    interestAccruedSoFar: bigint;
    interestRemainingToRepay: bigint;
}

// Formatted interfaces for UI use (with strings for numeric values)
// Corresponds to Solidity struct: BorrowerRiskProfile from CredoraPoolFactory.sol
export interface BorrowerRiskProfile {
    maxLoanAmount: string;
    interestRateBPS: string;
    assessmentTimestamp: string;
    exists: boolean;
}

// Corresponds to Solidity struct: FullLoanPoolInfo from CredoraLoanPool.sol
// and BorrowerPoolFullDetails from CredoraPoolFactory.sol
export interface FullLoanPoolDetails {
    poolAddress: `0x${string}`;
    borrower: `0x${string}`;
    loanAmountPrincipal: string;
    interestRateBPS: string;
    durationSeconds: string;
    numberOfInstallments: string;
    acceptedCurrency: `0x${string}`;
    loanPurpose: string;
    poolTokenName: string;
    poolTokenSymbol: string;
    tokenDecimals: number; // uint8
    poolAdmin: `0x${string}`;
    currentStatus: number; // uint8, maps to LoanStatus enum
    statusLabel: LoanStatus; // Human readable status
    totalFundsRaised: string;
    loanStartTime: string;
    maturityTime: string;
    totalPrincipalRepaid: string;
    totalInterestRepaid: string;
    currentInstallmentPaidCount: string;
    installmentIntervalSeconds: string;
    installmentPrincipalPerPeriod: string;
    installmentInterestPerPeriod: string;
    nextInstallmentDueDate: string;
    isPaused: boolean;
}

// Corresponds to Solidity struct: LenderPoolInfo from CredoraLoanPool.sol
// and LenderPoolContributionDetails from CredoraPoolFactory.sol
export interface LenderPoolContributionDetails {
    poolAddress?: `0x${string}`; // Optional as it's part of UserComprehensiveDetails array context
    shares: string;
    principalAlreadyClaimedByLender: string;
    claimablePrincipalNow: string;
    claimableInterestNow: string;
}

// Corresponds to Solidity struct: UserComprehensiveDetails from CredoraPoolFactory.sol
export interface UserComprehensiveDetails {
    riskProfile: BorrowerRiskProfile;
    borrowedPools: FullLoanPoolDetails[];
    fundedPools: LenderPoolContributionDetails[];
}

// Corresponds to Solidity struct: FactorySnapshot from CredoraPoolFactory.sol
export interface FactorySnapshot {
    totalPoolsCreated: string;
    countFundingPools: string;
    countActivePools: string;
    countRepaidPools: string;
    countDefaultedPools: string;
    countCancelledPools: string;
    countPendingInitializationPools: string;
    totalValueInFunding: string;
    totalPrincipalActiveLoans: string;
    totalOverallPrincipalRepaid: string;
    totalOverallInterestRepaid: string;
}

// --- Types for Tuple returns from CredoraLoanPool.sol getters ---

export interface PoolDynamicState {
    status: number; // maps to LoanStatus
    statusLabel: LoanStatus; // Human readable status
    fundsRaised: string;
    principalRepaid: string;
    interestRepaid: string;
    installmentsPaidCount: string;
    nextDueDateTime: string;
    currentlyPaused: boolean;
}

export interface NextInstallmentDetails {
    principalDue: string;
    interestDue: string;
    dueDate: string;
    isFinalInstallment: boolean;
}

export interface EarlyRepaymentQuote {
    outstandingPrincipal: string;
    currentInterestDue: string;
    totalAmountDue: string;
}

export interface FundingStatus {
    fundedAmount: string;
    requiredAmount: string;
    remainingToFund: string;
    isFullyFunded: boolean;
}

export interface TimeMetrics {
    timeElapsedSinceStart: string;
    timeRemainingOnLoan: string;
    timeUntilNextInstallment: string;
}

export interface AccruedInterestDetails {
    totalInterestCalculatedForLoan: string;
    interestAccruedSoFar: string;
    interestRemainingToRepay: string;
}


// --- Generic Response Types for contract interactions ---

// Type for a successful transaction response from setter functions
export interface TransactionSuccessResponse {
    success: true;
    message: string;
    transactionHash: `0x${string}`;
}

// Type for a generic error response from contract interaction functions
export interface ContractErrorResponse {
    success?: false;
    error: string;
} 