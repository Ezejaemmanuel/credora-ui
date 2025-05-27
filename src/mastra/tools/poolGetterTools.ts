import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import {
    getLoanPoolInfo as originalGetLoanPoolInfo,
    name as originalName,
    symbol as originalSymbol,
    decimals as originalDecimals,
    getLenderPoolInformation as originalGetLenderPoolInformation,
    getPoolDynamicState as originalGetPoolDynamicState,
    getNextInstallmentDetails as originalGetNextInstallmentDetails,
    getEarlyRepaymentQuote as originalGetEarlyRepaymentQuote,
    getFundingStatus as originalGetFundingStatus,
    getTimeMetrics as originalGetTimeMetrics,
    getAccruedInterestDetails as originalGetAccruedInterestDetails,
    totalSupply as originalTotalSupply,
    balanceOf as originalBalanceOf,
    borrower as originalBorrower,
    loanAmountPrincipal as originalLoanAmountPrincipal,
} from '@/src/mastra/tools/smartContractFunctions/credoraLoanPoolGetters';

import {
    AddressSchema,
    FormattedNumberSchema,
    ContractErrorResponseSchema,
    FullLoanPoolDetailsSchema,
    LenderPoolContributionDetailsSchema,
    PoolDynamicStateSchema,
    NextInstallmentDetailsSchema,
    EarlyRepaymentQuoteSchema,
    FundingStatusSchema,
    TimeMetricsSchema,
    AccruedInterestDetailsSchema,
    StringResponseSchema,
    NumberResponseSchema,
    FormattedNumberResponseSchema,
    AddressResponseSchema,
} from './zodSchemas';

const LoanPoolAddressInputSchema = z.object({
    loanPoolAddress: AddressSchema.describe("The Ethereum address of the specific Credora Loan Pool contract to query."),
});

/**
 * @description Retrieves a comprehensive set of static and dynamic information about a specific loan pool.
 * This includes all parameters set at its initialization (e.g., borrower, loan amount, interest rate, duration, purpose)
 * and its current on-chain state variables (e.g., status, total funds raised, principal/interest repaid, installment progress, next due date, pause status).
 * This is a primary tool for getting a full picture of a single loan pool.
 */
export const getLoanPoolInfoTool = createTool({
    id: 'credoraLoanPool-getLoanPoolInfo',
    description: 'Fetches all-encompassing static and dynamic details for a specific loan pool contract.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: z.union([
        FullLoanPoolDetailsSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalGetLoanPoolInfo(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves the human-readable name of the ERC20 token associated with a specific loan pool (e.g., "Credora Project Gamma Loan").
 * This name is defined when the pool is created.
 */
export const getNameTool = createTool({
    id: 'credoraLoanPool-name',
    description: 'Fetches the ERC20 token name of the specified loan pool.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: StringResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalName(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves the ERC20 token symbol for a specific loan pool (e.g., "CRPG").
 * This symbol is defined when the pool is created.
 */
export const getSymbolTool = createTool({
    id: 'credoraLoanPool-symbol',
    description: 'Fetches the ERC20 token symbol of the specified loan pool.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: StringResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalSymbol(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves the number of decimal places used by the ERC20 token of a specific loan pool.
 * For Credora loan pools, this is fixed at 6 decimals, aligning with common stablecoins like USDC.
 */
export const getDecimalsTool = createTool({
    id: 'credoraLoanPool-decimals',
    description: 'Fetches the number of decimals for the loan pool\'s ERC20 token (fixed at 6).',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: NumberResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalDecimals(context.loanPoolAddress as `0x${string}`);
    },
});

const GetLenderPoolInformationInputSchema = z.object({
    loanPoolAddress: AddressSchema.describe("The Ethereum address of the loan pool contract."),
    lenderAddress: AddressSchema.describe("The Ethereum address of the lender whose information is being queried."),
});
/**
 * @description Retrieves detailed information about a specific lender's financial position within a given loan pool.
 * This includes their current balance of pool shares (LP tokens), the amount of principal they have already claimed (if any),
 * and the amounts of principal and interest currently claimable if the loan has been fully repaid.
 */
export const getLenderPoolInformationTool = createTool({
    id: 'credoraLoanPool-getLenderPoolInformation',
    description: "Fetches a specific lender\'s share balance, claimed principal, and currently claimable principal/interest in a loan pool.",
    inputSchema: GetLenderPoolInformationInputSchema,
    outputSchema: z.union([
        LenderPoolContributionDetailsSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalGetLenderPoolInformation(context.loanPoolAddress as `0x${string}`, context.lenderAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves a snapshot of a specific loan pool's most frequently changing operational data.
 * This includes its current `LoanStatus` (e.g., Funding, Active, Repaid), total funds raised so far,
 * total principal and interest repaid by the borrower, the number of installments already paid,
 * the timestamp of the next installment due date (if applicable), and whether the contract is currently paused.
 */
export const getPoolDynamicStateTool = createTool({
    id: 'credoraLoanPool-getPoolDynamicState',
    description: 'Fetches a snapshot of key dynamic data for a loan pool: status, funds raised, repayments, installments paid, next due date, and pause status.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: z.union([
        PoolDynamicStateSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalGetPoolDynamicState(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description For a borrower interacting with a specific loan pool, this tool retrieves the details of their next upcoming installment.
 * Information includes the principal amount due, interest amount due, the due date timestamp, and a boolean indicating if this is the final installment of the loan.
 * Returns zero values if the loan is not active or if all installments have already been paid.
 */
export const getNextInstallmentDetailsTool = createTool({
    id: 'credoraLoanPool-getNextInstallmentDetails',
    description: 'Fetches details for the next upcoming installment of a loan: principal due, interest due, due date, and if it\'s the final one.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: z.union([
        NextInstallmentDetailsSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalGetNextInstallmentDetails(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Calculates and retrieves a quote for the amounts required if a borrower wishes to repay their entire outstanding loan amount early for a specific pool.
 * This is applicable only when the loan is in the `Active` status.
 * The quote includes the remaining principal, the current interest due (pro-rata up to the current time), and the total sum of these two amounts.
 */
export const getEarlyRepaymentQuoteTool = createTool({
    id: 'credoraLoanPool-getEarlyRepaymentQuote',
    description: 'Calculates and fetches a quote for an early full loan repayment: outstanding principal, current interest due, and total.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: z.union([
        EarlyRepaymentQuoteSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalGetEarlyRepaymentQuote(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Provides a consolidated view of the current funding status for a specific loan pool.
 * This includes the total amount of currency raised so far (fundedAmount), the target principal amount required for the loan (requiredAmount),
 * the amount still needed to fully fund the loan (remainingToFund), and a boolean indicating if the loan has been fully funded.
 */
export const getFundingStatusTool = createTool({
    id: 'credoraLoanPool-getFundingStatus',
    description: 'Fetches the current funding status of a loan pool: funded amount, required amount, remaining to fund, and if fully funded.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: z.union([
        FundingStatusSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalGetFundingStatus(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Returns various time-related metrics for a specific, active loan pool.
 * This includes the number of seconds passed since the loan became active (timeElapsedSinceStart),
 * the number of seconds remaining until the loan's scheduled maturity (timeRemainingOnLoan),
 * and the seconds remaining until the next installment is due (timeUntilNextInstallment).
 * Values are zero if not applicable (e.g., loan not yet active or already concluded).
 */
export const getTimeMetricsTool = createTool({
    id: 'credoraLoanPool-getTimeMetrics',
    description: 'Fetches time-based metrics for an active loan: time elapsed, time remaining on loan, and time until next installment.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: z.union([
        TimeMetricsSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalGetTimeMetrics(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Provides details about the interest calculations for a specific loan pool.
 * It returns the total interest amount calculated for the entire loan duration if held to maturity,
 * the total interest that has theoretically accrued based on the elapsed time (pro-rata basis),
 * and the amount of interest that still remains to be repaid by the borrower.
 */
export const getAccruedInterestDetailsTool = createTool({
    id: 'credoraLoanPool-getAccruedInterestDetails',
    description: 'Fetches details about loan interest: total calculated for term, interest accrued so far (pro-rata), and interest remaining to repay.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: z.union([
        AccruedInterestDetailsSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalGetAccruedInterestDetails(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves the total supply of shares (ERC20 LP tokens) for a specific loan pool.
 * This typically represents the total amount of currency funded into the pool, assuming a 1:1 minting ratio of shares to currency units during funding.
 */
export const getTotalSupplyTool = createTool({
    id: 'credoraLoanPool-totalSupply',
    description: 'Fetches the total supply of ERC20 LP tokens for the specified loan pool.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: FormattedNumberResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalTotalSupply(context.loanPoolAddress as `0x${string}`);
    },
});

const GetBalanceOfInputSchema = z.object({
    loanPoolAddress: AddressSchema.describe("The Ethereum address of the loan pool contract."),
    account: AddressSchema.describe("The Ethereum address of the account (typically a lender) whose LP token balance is being queried."),
});
/**
 * @description Retrieves the balance of loan pool shares (ERC20 LP tokens) held by a specific account (lender) for a given loan pool.
 */
export const getBalanceOfTool = createTool({
    id: 'credoraLoanPool-balanceOf',
    description: 'Fetches the LP token balance of a specific account within the specified loan pool.',
    inputSchema: GetBalanceOfInputSchema,
    outputSchema: FormattedNumberResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalBalanceOf(context.loanPoolAddress as `0x${string}`, context.account as `0x${string}`);
    },
});

/**
 * @description Retrieves the Ethereum address of the borrower for a specific loan pool.
 * Each loan pool is associated with a single borrower.
 */
export const getBorrowerTool = createTool({
    id: 'credoraLoanPool-borrower',
    description: 'Fetches the Ethereum address of the borrower associated with this loan pool.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: AddressResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalBorrower(context.loanPoolAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves the principal amount of the loan for a specific loan pool.
 * This is the target amount that was to be raised during the funding phase and forms the basis for interest calculations.
 */
export const getLoanAmountPrincipalTool = createTool({
    id: 'credoraLoanPool-loanAmountPrincipal',
    description: 'Fetches the total principal amount of the loan for this specific loan pool.',
    inputSchema: LoanPoolAddressInputSchema,
    outputSchema: FormattedNumberResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) throw new Error("Tool execution aborted.");
        return await originalLoanAmountPrincipal(context.loanPoolAddress as `0x${string}`);
    },
}); 