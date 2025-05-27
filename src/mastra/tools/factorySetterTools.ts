import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import {
    setRiskProfile as originalSetRiskProfile,
    createLoanPool as originalCreateLoanPool,
} from '@/src/mastra/tools/smartContractFunctions/credoraPoolFactorySetters';

import {
    AddressSchema,
    StringNonEmptySchema,
    ContractErrorResponseSchema,
    TransactionSuccessResponseSchema,
} from './zodSchemas';

// Define a string schema for numeric values
const NumericStringSchema = z.string().regex(/^\d+$/, "Must be a numeric string");

const SetRiskProfileInputSchema = z.object({
    userAddress: AddressSchema.describe("The Ethereum address of the user (borrower) whose risk profile is being established or updated."),
    maxLoanAmount: z.number().int().positive().describe("The maximum loan amount (in USDC, will be converted to smallest units with 6 decimals) the user is deemed eligible for, based on AI assessment."),
    interestRateBPS: z.number().int().nonnegative().describe("The suggested annual interest rate in Basis Points (BPS) for the user (e.g., 500 for 5.00%). This rate will be validated against the factory's MAX_INTEREST_RATE_BPS on-chain."),
});

/**
 * @description Sets or updates the risk profile for a specific user (borrower) on the Credora Pool Factory contract.
 * This is a critical step in the onboarding process, defining the borrower's creditworthiness within the system.
 * The operation records the maximum loan amount they are eligible for and a suggested interest rate.
 * Execution of this tool requires the caller to possess the `AI_ROLE` on-chain, ensuring that only authorized (AI) systems can perform this assessment.
 * The provided interest rate will be checked against the factory's `MAX_INTEREST_RATE_BPS`.
 */
export const setRiskProfileTool = createTool({
    id: 'credoraFactory-setRiskProfile',
    description: 'Sets/updates a borrower\'s risk profile: max loan amount & interest rate (BPS). Requires AI_ROLE.',
    inputSchema: SetRiskProfileInputSchema,
    outputSchema: z.union([
        TransactionSuccessResponseSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalSetRiskProfile(
            context.userAddress as `0x${string}`,
            context.maxLoanAmount,
            context.interestRateBPS
        );
    },
});

const CreateLoanPoolInputSchema = z.object({
    borrowerAddress: AddressSchema.describe("The Ethereum address of the borrower for whom this loan pool is being created. A risk profile must already exist for this borrower."),
    loanAmount: z.number().int().positive().describe("The principal amount requested for the loan (in USDC, will be converted to smallest units with 6 decimals). Must not exceed the borrower's approved maxLoanAmount from their risk profile."),
    durationSeconds: z.number().int().positive().describe("The total duration of the loan in seconds (e.g., 2592000 for 30 days). Must be a positive value."),
    numberOfInstallments: z.number().int().positive().describe("The total number of installments for loan repayment (e.g., 3 for 3 installments). Must be positive, and `durationSeconds` must be divisible by this number."),
    poolTokenName: StringNonEmptySchema.describe("A descriptive name for the ERC20 token that will represent lenders' shares in this specific loan pool (e.g., 'Credora Project Alpha Loan Token')."),
    poolTokenSymbol: StringNonEmptySchema.describe("A symbol for the loan pool's ERC20 token (e.g., 'CRPALPHA')."),
    purpose: StringNonEmptySchema.describe("A brief description of the purpose for which the loan is being sought (e.g., 'Working capital for Q3 development cycle')."),
});

/**
 * @description Creates a new, individual loan pool for a specified borrower through the Credora Pool Factory contract.
 * This involves deploying a new `CredoraLoanPool` contract (as a clone) and initializing it with the provided loan parameters.
 * The borrower must have an existing risk profile, and the requested loan amount must be within their approved limit.
 * The interest rate for the pool will be taken from the borrower's existing risk profile.
 * Execution of this tool requires the caller to possess the `POOL_CREATOR_ROLE` on-chain.
 */
export const createLoanPoolTool = createTool({
    id: 'credoraFactory-createLoanPool',
    description: 'Creates a new loan pool with specified parameters for a borrower. Requires POOL_CREATOR_ROLE.',
    inputSchema: CreateLoanPoolInputSchema,
    outputSchema: z.union([
        TransactionSuccessResponseSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalCreateLoanPool(
            context.borrowerAddress as `0x${string}`,
            context.loanAmount,
            context.durationSeconds,
            context.numberOfInstallments,
            context.poolTokenName as string,
            context.poolTokenSymbol as string,
            context.purpose as string
        );
    },
});

// Add other factory setter tools here if any more are defined in the future. 