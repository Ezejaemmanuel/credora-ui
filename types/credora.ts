export type Address = `0x${string}`;

/**
 * @notice Structure to store the risk profile of a borrower as assessed by the AI.
 * Corresponds to CredoraPoolFactory.BorrowerRiskProfile
 */
export interface BorrowerRiskProfile {
    maxLoanAmount: string;
    interestRateBPS: bigint;
    assessmentTimestamp: bigint; // Solidity uint64, can be bigint or number in JS
    exists: boolean;
}

/**
 * @notice Details of a loan pool.
 * Corresponds to CredoraPoolFactory.BorrowerPoolFullDetails and ICredoraLoanPool.FullLoanPoolInfo
 * LoanStatus enum mapping (uint8):
 * 0:PendingInitialization, 1:Funding, 2:Active, 3:Repaid, 4:Defaulted, 5:Cancelled.
 */
export interface LoanPoolFullDetails {
    poolAddress: Address;
    borrower: Address;
    loanAmountPrincipal: string;
    interestRateBPS: bigint;
    durationSeconds: bigint;
    numberOfInstallments: bigint;
    acceptedCurrency: Address;
    loanPurpose: string;
    poolTokenName: string;
    poolTokenSymbol: string;
    tokenDecimals: number; // Solidity uint8
    poolAdmin: Address;
    currentStatus: number; // Corresponds to CredoraLoanPool.LoanStatus enum (0-5)
    totalFundsRaised: string;
    loanStartTime: bigint;
    maturityTime: bigint;
    totalPrincipalRepaid: string;
    totalInterestRepaid: string;
    currentInstallmentPaidCount: bigint;
    installmentIntervalSeconds: bigint;
    installmentPrincipalPerPeriod: string;
    installmentInterestPerPeriod: string;
    nextInstallmentDueDate: bigint;
    isPaused: boolean;
}

/**
 * @notice Details of a loan pool where the user is a lender/funder.
 * Corresponds to CredoraPoolFactory.LenderPoolContributionDetails
 */
export interface LenderPoolContributionDetails {
    poolAddress: Address;
    shares: string;
    principalAlreadyClaimedByLender: string;
    claimablePrincipalNow: string;
    claimableInterestNow: string;
}

/**
 * @notice Comprehensive details about a user.
 * Corresponds to CredoraPoolFactory.UserComprehensiveDetails
 */
export interface UserComprehensiveDetails {
    riskProfile: BorrowerRiskProfile;
    borrowedPools: LoanPoolFullDetails[]; // Re-using LoanPoolFullDetails as it matches BorrowerPoolFullDetails
    fundedPools: LenderPoolContributionDetails[];
}

/**
 * @notice Aggregated financial and operational snapshot of the entire lending platform.
 * Corresponds to CredoraPoolFactory.FactorySnapshot
 * LoanStatus enum mapping: 0:PendingInit, 1:Funding, 2:Active, 3:Repaid, 4:Defaulted, 5:Cancelled
 */
export interface FactorySnapshot {
    totalPoolsCreated: bigint;
    countFundingPools: bigint;
    countActivePools: bigint;
    countRepaidPools: bigint;
    countDefaultedPools: bigint;
    countCancelledPools: bigint;
    countPendingInitializationPools: bigint;
    totalValueInFunding: string;
    totalPrincipalActiveLoans: string;
    totalOverallPrincipalRepaid: string;
    totalOverallInterestRepaid: string;
}

/**
 * Data structure for the combined factory data hook.
 */
export interface CredoraFactoryData {
    userComprehensiveDetails?: UserComprehensiveDetails;
    allPoolsGeneralDetails?: LoanPoolFullDetails[];
    factoryFinancialSnapshot?: FactorySnapshot;
}

/**
 * LoanStatus enum from CredoraLoanPool.sol
 * Mirrors enum LoanStatus { PendingInitialization, Funding, Active, Repaid, Defaulted, Cancelled }
 */
export enum LoanStatus {
    PendingInitialization = 0,
    Funding = 1,
    Active = 2,
    Repaid = 3,
    Defaulted = 4,
    Cancelled = 5,
} 