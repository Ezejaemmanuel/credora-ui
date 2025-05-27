import { z } from 'zod';
import { LoanStatus } from '@/types/contractTypes';

/**
 * Schema for a valid Ethereum address.
 */
export const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .refine(val => val.startsWith('0x'), { message: "Address must start with 0x" });

/**
 * Schema for raw BigInt values from smart contracts 
 */
export const RawBigIntSchema = z.preprocess((val) => {
    if (val === null || val === undefined) return BigInt(0);
    if (typeof val === 'string') {
        // Handle empty strings
        if (val.trim() === '') return BigInt(0);
        // Remove 'n' suffix if present (from console.log outputs)
        return BigInt(val.endsWith('n') ? val.slice(0, -1) : val);
    }
    if (typeof val === 'number') return BigInt(val);
    if (typeof val === 'bigint') return val;
    // Default fallback
    return BigInt(0);
}, z.bigint());

/**
 * Schema for formatted string values that represent numeric amounts
 */
export const FormattedNumberSchema = z.string();

/**
 * Schema for a contract error response.
 */
export const ContractErrorResponseSchema = z.object({
    error: z.string(),
    success: z.literal(false).optional(),
});

/**
 * Schema for a successful transaction response.
 */
export const TransactionSuccessResponseSchema = z.object({
    success: z.literal(true),
    message: z.string(),
    transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
});

/**
 * Schema for raw BorrowerRiskProfile from smart contract
 */
export const RawBorrowerRiskProfileSchema = z.object({
    maxLoanAmount: RawBigIntSchema,
    interestRateBPS: RawBigIntSchema,
    assessmentTimestamp: RawBigIntSchema,
    exists: z.boolean(),
});

/**
 * Schema for formatted BorrowerRiskProfile for UI display
 */
export const BorrowerRiskProfileSchema = z.object({
    maxLoanAmount: FormattedNumberSchema,
    interestRateBPS: FormattedNumberSchema,
    assessmentTimestamp: FormattedNumberSchema,
    exists: z.boolean(),
});

/**
 * Schema for raw PoolDynamicState from smart contract
 */
export const RawPoolDynamicStateSchema = z.object({
    status: z.number().int().describe("0: PENDING, 1: FUNDING, 2: ACTIVE, 3: REPAID, 4: DEFAULTED, 5: CANCELLED"),
    fundsRaised: RawBigIntSchema,
    principalRepaid: RawBigIntSchema,
    interestRepaid: RawBigIntSchema,
    installmentsPaidCount: RawBigIntSchema,
    nextDueDateTime: RawBigIntSchema.describe("Unix timestamp for the next due date"),
    currentlyPaused: z.boolean(),
});

/**
 * Schema for formatted PoolDynamicState for UI display
 */
export const PoolDynamicStateSchema = z.object({
    status: z.number().int().describe("0: PENDING, 1: FUNDING, 2: ACTIVE, 3: REPAID, 4: DEFAULTED, 5: CANCELLED"),
    statusLabel: z.enum(["PendingInitialization", "Funding", "Active", "Repaid", "Defaulted", "Cancelled"]),
    fundsRaised: FormattedNumberSchema,
    principalRepaid: FormattedNumberSchema,
    interestRepaid: FormattedNumberSchema,
    installmentsPaidCount: FormattedNumberSchema,
    nextDueDateTime: FormattedNumberSchema.describe("Formatted date/time for the next due date"),
    currentlyPaused: z.boolean(),
});

/**
 * Schema for raw FullLoanPoolDetails from smart contract
 */
export const RawFullLoanPoolDetailsSchema = z.object({
    poolAddress: AddressSchema,
    borrower: AddressSchema,
    loanAmountPrincipal: RawBigIntSchema,
    interestRateBPS: RawBigIntSchema,
    durationSeconds: RawBigIntSchema,
    numberOfInstallments: RawBigIntSchema,
    acceptedCurrency: AddressSchema,
    loanPurpose: z.string(),
    poolTokenName: z.string(),
    poolTokenSymbol: z.string(),
    tokenDecimals: z.number().int(),
    poolAdmin: AddressSchema,
    currentStatus: z.number().int().describe("0:PendingInitialization, 1:Funding, 2:Active, 3:Repaid, 4:Defaulted, 5:Cancelled"),
    totalFundsRaised: RawBigIntSchema,
    loanStartTime: RawBigIntSchema,
    maturityTime: RawBigIntSchema,
    totalPrincipalRepaid: RawBigIntSchema,
    totalInterestRepaid: RawBigIntSchema,
    currentInstallmentPaidCount: RawBigIntSchema,
    installmentIntervalSeconds: RawBigIntSchema,
    installmentPrincipalPerPeriod: RawBigIntSchema,
    installmentInterestPerPeriod: RawBigIntSchema,
    nextInstallmentDueDate: RawBigIntSchema,
    isPaused: z.boolean(),
}).describe("Raw comprehensive details for a loan pool from the smart contract");

/**
 * Schema for formatted FullLoanPoolDetails for UI display
 */
export const FullLoanPoolDetailsSchema = z.object({
    poolAddress: AddressSchema,
    borrower: AddressSchema,
    loanAmountPrincipal: FormattedNumberSchema,
    interestRateBPS: FormattedNumberSchema,
    durationSeconds: FormattedNumberSchema,
    numberOfInstallments: FormattedNumberSchema,
    acceptedCurrency: AddressSchema,
    loanPurpose: z.string(),
    poolTokenName: z.string(),
    poolTokenSymbol: z.string(),
    tokenDecimals: z.number().int(),
    poolAdmin: AddressSchema,
    currentStatus: z.number().int().describe("0:PendingInitialization, 1:Funding, 2:Active, 3:Repaid, 4:Defaulted, 5:Cancelled"),
    statusLabel: z.enum(["PendingInitialization", "Funding", "Active", "Repaid", "Defaulted", "Cancelled"]),
    totalFundsRaised: FormattedNumberSchema,
    loanStartTime: FormattedNumberSchema,
    maturityTime: FormattedNumberSchema,
    totalPrincipalRepaid: FormattedNumberSchema,
    totalInterestRepaid: FormattedNumberSchema,
    currentInstallmentPaidCount: FormattedNumberSchema,
    installmentIntervalSeconds: FormattedNumberSchema,
    installmentPrincipalPerPeriod: FormattedNumberSchema,
    installmentInterestPerPeriod: FormattedNumberSchema,
    nextInstallmentDueDate: FormattedNumberSchema,
    isPaused: z.boolean(),
}).describe("Formatted comprehensive details for a loan pool for UI display");

/**
 * Schema for raw FactorySnapshot from smart contract
 */
export const RawFactorySnapshotSchema = z.object({
    totalPoolsCreated: RawBigIntSchema,
    countFundingPools: RawBigIntSchema,
    countActivePools: RawBigIntSchema,
    countRepaidPools: RawBigIntSchema,
    countDefaultedPools: RawBigIntSchema,
    countCancelledPools: RawBigIntSchema,
    countPendingInitializationPools: RawBigIntSchema,
    totalValueInFunding: RawBigIntSchema,
    totalPrincipalActiveLoans: RawBigIntSchema,
    totalOverallPrincipalRepaid: RawBigIntSchema,
    totalOverallInterestRepaid: RawBigIntSchema,
}).describe("Raw financial and operational snapshot of the Credora Pool Factory from the smart contract");

/**
 * Schema for formatted FactorySnapshot for UI display
 */
export const FactorySnapshotSchema = z.object({
    totalPoolsCreated: FormattedNumberSchema,
    countFundingPools: FormattedNumberSchema,
    countActivePools: FormattedNumberSchema,
    countRepaidPools: FormattedNumberSchema,
    countDefaultedPools: FormattedNumberSchema,
    countCancelledPools: FormattedNumberSchema,
    countPendingInitializationPools: FormattedNumberSchema,
    totalValueInFunding: FormattedNumberSchema,
    totalPrincipalActiveLoans: FormattedNumberSchema,
    totalOverallPrincipalRepaid: FormattedNumberSchema,
    totalOverallInterestRepaid: FormattedNumberSchema,
}).describe("Formatted financial and operational snapshot of the Credora Pool Factory for UI display");

/**
 * Schema for raw LenderPoolContributionDetails from smart contract
 */
export const RawLenderPoolContributionDetailsSchema = z.object({
    poolAddress: AddressSchema.optional().describe("The address of the loan pool. Optional, as it might be part of a larger structure where the pool address is already known."),
    shares: RawBigIntSchema.describe("Current balance of pool tokens (LP shares) held by the lender."),
    principalAlreadyClaimedByLender: RawBigIntSchema.describe("Total principal amount the lender has already claimed from this pool."),
    claimablePrincipalNow: RawBigIntSchema.describe("Principal amount the lender can currently claim (typically when loan is Repaid)."),
    claimableInterestNow: RawBigIntSchema.describe("Interest amount the lender can currently claim (typically when loan is Repaid).")
}).describe("Raw details of a lender's contribution and status in a specific loan pool from the smart contract");

/**
 * Schema for formatted LenderPoolContributionDetails for UI display
 */
export const LenderPoolContributionDetailsSchema = z.object({
    poolAddress: AddressSchema.optional().describe("The address of the loan pool. Optional, as it might be part of a larger structure where the pool address is already known."),
    shares: FormattedNumberSchema.describe("Current balance of pool tokens (LP shares) held by the lender."),
    principalAlreadyClaimedByLender: FormattedNumberSchema.describe("Total principal amount the lender has already claimed from this pool."),
    claimablePrincipalNow: FormattedNumberSchema.describe("Principal amount the lender can currently claim (typically when loan is Repaid)."),
    claimableInterestNow: FormattedNumberSchema.describe("Interest amount the lender can currently claim (typically when loan is Repaid).")
}).describe("Formatted details of a lender's contribution and status in a specific loan pool for UI display");

/**
 * Schema for raw UserComprehensiveDetails from smart contract
 */
export const RawUserComprehensiveDetailsSchema = z.object({
    riskProfile: RawBorrowerRiskProfileSchema,
    borrowedPools: z.array(RawFullLoanPoolDetailsSchema),
    fundedPools: z.array(RawLenderPoolContributionDetailsSchema),
}).describe("Raw comprehensive details for a user from the smart contract");

/**
 * Schema for formatted UserComprehensiveDetails for UI display
 */
export const UserComprehensiveDetailsSchema = z.object({
    riskProfile: BorrowerRiskProfileSchema,
    borrowedPools: z.array(FullLoanPoolDetailsSchema),
    fundedPools: z.array(LenderPoolContributionDetailsSchema),
}).describe("Formatted comprehensive details for a user for UI display");

/**
 * Schema for raw NextInstallmentDetails from smart contract
 */
export const RawNextInstallmentDetailsSchema = z.object({
    principalDue: RawBigIntSchema.describe("The principal amount due for the next installment (in currency units, e.g., USDC)."),
    interestDue: RawBigIntSchema.describe("The interest amount due for the next installment (in currency units, e.g., USDC)."),
    dueDate: RawBigIntSchema.describe("The Unix timestamp (seconds) for when this installment is due."),
    isFinalInstallment: z.boolean().describe("Boolean flag indicating if this is the final installment of the loan."),
}).describe("Raw details of the next loan installment from the smart contract");

/**
 * Schema for formatted NextInstallmentDetails for UI display
 */
export const NextInstallmentDetailsSchema = z.object({
    principalDue: FormattedNumberSchema.describe("The principal amount due for the next installment (in currency units, e.g., USDC)."),
    interestDue: FormattedNumberSchema.describe("The interest amount due for the next installment (in currency units, e.g., USDC)."),
    dueDate: FormattedNumberSchema.describe("Formatted due date timestamp."),
    isFinalInstallment: z.boolean().describe("Boolean flag indicating if this is the final installment of the loan."),
}).describe("Formatted details of the next loan installment for UI display");

/**
 * Schema for raw EarlyRepaymentQuote from smart contract
 */
export const RawEarlyRepaymentQuoteSchema = z.object({
    outstandingPrincipal: RawBigIntSchema.describe("The remaining principal amount to be repaid (in currency units, e.g., USDC)."),
    currentInterestDue: RawBigIntSchema.describe("The interest amount that has accrued up to this point (in currency units, e.g., USDC)."),
    totalAmountDue: RawBigIntSchema.describe("The total amount needed to repay the loan fully (outstandingPrincipal + currentInterestDue)."),
}).describe("Raw early repayment quote from the smart contract");

/**
 * Schema for formatted EarlyRepaymentQuote for UI display
 */
export const EarlyRepaymentQuoteSchema = z.object({
    outstandingPrincipal: FormattedNumberSchema.describe("The remaining principal amount to be repaid (in currency units, e.g., USDC)."),
    currentInterestDue: FormattedNumberSchema.describe("The interest amount that has accrued up to this point (in currency units, e.g., USDC)."),
    totalAmountDue: FormattedNumberSchema.describe("The total amount needed to repay the loan fully (outstandingPrincipal + currentInterestDue)."),
}).describe("Formatted early repayment quote for UI display");

/**
 * Schema for raw FundingStatus from smart contract
 */
export const RawFundingStatusSchema = z.object({
    fundedAmount: RawBigIntSchema.describe("The amount of currency already funded into this loan pool."),
    requiredAmount: RawBigIntSchema.describe("The total target amount needed to fully fund this loan."),
    remainingToFund: RawBigIntSchema.describe("The delta between requiredAmount and fundedAmount (requiredAmount - fundedAmount)."),
    isFullyFunded: z.boolean().describe("Boolean flag indicating if the loan has reached its funding target."),
}).describe("Raw funding status from the smart contract");

/**
 * Schema for formatted FundingStatus for UI display
 */
export const FundingStatusSchema = z.object({
    fundedAmount: FormattedNumberSchema.describe("The amount of currency already funded into this loan pool."),
    requiredAmount: FormattedNumberSchema.describe("The total target amount needed to fully fund this loan."),
    remainingToFund: FormattedNumberSchema.describe("The delta between requiredAmount and fundedAmount (requiredAmount - fundedAmount)."),
    isFullyFunded: z.boolean().describe("Boolean flag indicating if the loan has reached its funding target."),
}).describe("Formatted funding status for UI display");

/**
 * Schema for raw TimeMetrics from smart contract
 */
export const RawTimeMetricsSchema = z.object({
    timeElapsedSinceStart: RawBigIntSchema.describe("The time elapsed (in seconds) since the loan became active."),
    timeRemainingOnLoan: RawBigIntSchema.describe("The time remaining (in seconds) until the loan reaches maturity."),
    timeUntilNextInstallment: RawBigIntSchema.describe("The time (in seconds) until the next installment is due."),
}).describe("Raw time-related metrics from the smart contract");

/**
 * Schema for formatted TimeMetrics for UI display
 */
export const TimeMetricsSchema = z.object({
    timeElapsedSinceStart: FormattedNumberSchema.describe("Formatted duration of elapsed time since loan start."),
    timeRemainingOnLoan: FormattedNumberSchema.describe("Formatted duration of time remaining on loan."),
    timeUntilNextInstallment: FormattedNumberSchema.describe("Formatted duration of time until next installment."),
}).describe("Formatted time-related metrics for UI display");

/**
 * Schema for raw AccruedInterestDetails from smart contract
 */
export const RawAccruedInterestDetailsSchema = z.object({
    totalInterestCalculatedForLoan: RawBigIntSchema.describe("The total interest calculated for the entire loan duration."),
    interestAccruedSoFar: RawBigIntSchema.describe("The amount of interest accrued from loan start until now."),
    interestRemainingToRepay: RawBigIntSchema.describe("The interest amount still to be repaid (totalInterestCalculatedForLoan - accrued interest already repaid)."),
}).describe("Raw accrued interest details from the smart contract");

/**
 * Schema for formatted AccruedInterestDetails for UI display
 */
export const AccruedInterestDetailsSchema = z.object({
    totalInterestCalculatedForLoan: FormattedNumberSchema.describe("The total interest calculated for the entire loan duration."),
    interestAccruedSoFar: FormattedNumberSchema.describe("The amount of interest accrued from loan start until now."),
    interestRemainingToRepay: FormattedNumberSchema.describe("The interest amount still to be repaid (totalInterestCalculatedForLoan - accrued interest already repaid)."),
}).describe("Formatted accrued interest details for UI display");

// --- Response schemas for basic types ---

/**
 * Schema for string responses from contract calls
 */
export const StringResponseSchema = z.union([
    z.string(),
    ContractErrorResponseSchema,
]);

/**
 * Schema for formatted number responses from contract calls
 */
export const FormattedNumberResponseSchema = z.union([
    FormattedNumberSchema,
    ContractErrorResponseSchema,
]);

/**
 * Schema for number responses from contract calls
 */
export const NumberResponseSchema = z.union([
    z.number(),
    ContractErrorResponseSchema,
]);

/**
 * Schema for boolean responses from contract calls
 */
export const BooleanResponseSchema = z.union([
    z.boolean(),
    ContractErrorResponseSchema,
]);

/**
 * Schema for Ethereum address responses from contract calls
 */
export const AddressResponseSchema = z.union([
    AddressSchema,
    ContractErrorResponseSchema,
]);

/**
 * Schema for array of Ethereum addresses responses from contract calls
 */
export const AddressArrayResponseSchema = z.union([
    z.array(AddressSchema),
    ContractErrorResponseSchema,
]);

/**
 * Schema for non-empty strings
 */
export const StringNonEmptySchema = z.string().trim().min(1, { message: "String cannot be empty." });

// For backward compatibility
export const BigIntSchema = RawBigIntSchema;
export const BigIntResponseSchema = RawBigIntSchema; 