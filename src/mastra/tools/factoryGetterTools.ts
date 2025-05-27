import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
// import type { ToolExecutionContext, ToolExecutionOptions } from '@mastra/core'; // Removed for simplicity if causing parse errors
import {
    getLoanPoolImplementation as originalGetLoanPoolImplementation,
    getAcceptedCurrency as originalGetAcceptedCurrency,
    getRiskProfile as originalGetRiskProfile,
    getMaxInterestRateBps as originalGetMaxInterestRateBps,
    getPoolsByBorrower as originalGetPoolsByBorrower,
    getAllPools as originalGetAllPools,
    getTotalPools as originalGetTotalPools,
    getBorrowerDetails as originalGetBorrowerDetails,
    getBorrowerRiskProfileExists as originalGetBorrowerRiskProfileExists,
    getUserComprehensiveDetails as originalGetUserComprehensiveDetails,
    getAllPoolsGeneralDetails as originalGetAllPoolsGeneralDetails,
    getFactoryFinancialSnapshot as originalGetFactoryFinancialSnapshot,
} from '@/src/mastra/tools/smartContractFunctions/credoraPoolFactoryGetters';

import {
    AddressSchema,
    StringNonEmptySchema,
    ContractErrorResponseSchema,
    BorrowerRiskProfileSchema,
    UserComprehensiveDetailsSchema,
    FullLoanPoolDetailsSchema,
    FactorySnapshotSchema,
    AddressResponseSchema,
    FormattedNumberResponseSchema,
    BooleanResponseSchema,
    AddressArrayResponseSchema,
} from './zodSchemas';

/**
 * @description Retrieves the blockchain address of the master CredoraLoanPool contract implementation.
 * This is the blueprint contract from which all individual loan pools are cloned.
 * Knowing this address can be useful for auditing or understanding the core pool logic.
 */
export const getLoanPoolImplementationTool = createTool({
    id: 'credoraFactory-getLoanPoolImplementation',
    description: 'Fetches the master CredoraLoanPool implementation address. All loan pools are clones of this contract.',
    inputSchema: z.object({}),
    outputSchema: AddressResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetLoanPoolImplementation();
    },
});

/**
 * @description Retrieves the ERC20 token address that the Credora Pool Factory uses for all loan operations.
 * This is typically a stablecoin like USDC. All funding and repayments within pools created by this factory will use this currency.
 */
export const getAcceptedCurrencyTool = createTool({
    id: 'credoraFactory-getAcceptedCurrency',
    description: 'Fetches the ERC20 token address (e.g., USDC) used for all loan funding and repayments by this factory.',
    inputSchema: z.object({}),
    outputSchema: AddressResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetAcceptedCurrency();
    },
});

const GetRiskProfileInputSchema = z.object({
    borrowerAddress: AddressSchema.describe("The Ethereum address of the borrower whose risk profile is being queried."),
});
/**
 * @description Fetches the AI-assessed risk profile for a specific borrower from the Credora Pool Factory.
 * The profile includes their maximum eligible loan amount, a suggested interest rate in Basis Points (BPS),
 * the timestamp of the assessment, and a flag indicating if the profile exists.
 * This information is crucial for determining loan eligibility and terms.
 */
export const getRiskProfileTool = createTool({
    id: 'credoraFactory-getRiskProfile',
    description: 'Fetches a borrower\'s risk profile: max loan amount, interest rate BPS, assessment timestamp, and existence status.',
    inputSchema: GetRiskProfileInputSchema,
    outputSchema: z.union([
        BorrowerRiskProfileSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetRiskProfile(context.borrowerAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves the maximum permissible annual interest rate in Basis Points (BPS) for loans created by the Credora Pool Factory.
 * For instance, a value of 100000 BPS represents a 1000% maximum annual interest rate.
 * This serves as an upper limit for interest rates set in borrower risk profiles.
 */
export const getMaxInterestRateBpsTool = createTool({
    id: 'credoraFactory-getMaxInterestRateBps',
    description: 'Fetches the platform-wide maximum allowable interest rate in Basis Points (BPS) for new loans (e.g., 100000 BPS = 1000%).',
    inputSchema: z.object({}),
    outputSchema: FormattedNumberResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetMaxInterestRateBps();
    },
});

const GetPoolsByBorrowerInputSchema = z.object({
    borrowerAddress: AddressSchema.describe("The Ethereum address of the borrower."),
});
/**
 * @description Retrieves a list of all loan pool contract addresses that have been created for a specific borrower via the Credora Pool Factory.
 * Useful for tracking a borrower's loan history and current obligations.
 */
export const getPoolsByBorrowerTool = createTool({
    id: 'credoraFactory-getPoolsByBorrower',
    description: 'Fetches an array of all loan pool addresses associated with a given borrower address.',
    inputSchema: GetPoolsByBorrowerInputSchema,
    outputSchema: AddressArrayResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetPoolsByBorrower(context.borrowerAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves a list of all loan pool contract addresses ever created by this Credora Pool Factory instance.
 * Provides a complete inventory of pools on the platform managed by this factory.
 */
export const getAllPoolsTool = createTool({
    id: 'credoraFactory-getAllPools',
    description: 'Fetches an array of all loan pool addresses ever created by this factory instance.',
    inputSchema: z.object({}),
    outputSchema: AddressArrayResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetAllPools();
    },
});

/**
 * @description Retrieves the total number of loan pools that have been created by the Credora Pool Factory.
 * This gives a simple count of all pools instantiated by this factory.
 */
export const getTotalPoolsTool = createTool({
    id: 'credoraFactory-getTotalPools',
    description: 'Fetches the total numerical count of all loan pools created by this factory.',
    inputSchema: z.object({}),
    outputSchema: FormattedNumberResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetTotalPools();
    },
});

const GetBorrowerDetailsInputSchema = z.object({
    borrowerAddress: AddressSchema.describe("The Ethereum address of the borrower."),
});
/**
 * @description Retrieves a more detailed view of a specific borrower, combining their risk profile
 * (max loan, interest rate, etc.) and a list of all loan pool addresses associated with them.
 */
export const getBorrowerDetailsTool = createTool({
    id: 'credoraFactory-getBorrowerDetails',
    description: 'Fetches a combination of a borrower\'s risk profile and a list of their associated loan pool addresses.',
    inputSchema: GetBorrowerDetailsInputSchema,
    outputSchema: z.union([
        z.object({
            riskProfile: BorrowerRiskProfileSchema,
            pools: z.array(AddressSchema),
        }),
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetBorrowerDetails(context.borrowerAddress as `0x${string}`);
    },
});

const GetBorrowerRiskProfileExistsInputSchema = z.object({
    borrowerAddress: AddressSchema.describe("The Ethereum address of the borrower."),
});
/**
 * @description Checks whether a risk profile has been established and exists for a given borrower address within the Credora Pool Factory.
 * Returns true if a profile is found, false otherwise.
 */
export const getBorrowerRiskProfileExistsTool = createTool({
    id: 'credoraFactory-getBorrowerRiskProfileExists',
    description: 'Checks and returns a boolean indicating if a risk profile has been set for the specified borrower address.',
    inputSchema: GetBorrowerRiskProfileExistsInputSchema,
    outputSchema: BooleanResponseSchema,
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetBorrowerRiskProfileExists(context.borrowerAddress as `0x${string}`);
    },
});

const GetUserComprehensiveDetailsInputSchema = z.object({
    userAddress: AddressSchema.describe("The Ethereum address of the user (can be a borrower and/or a lender)."),
});
/**
 * @description Retrieves a comprehensive overview of a user's engagement with the Credora platform.
 * This includes their risk profile (if they are a borrower), a list of pools they have borrowed from (with full details),
 * and a list of pools they have funded as a lender (with their contribution details).
 * This tool makes multiple on-chain calls and is primarily intended for detailed off-chain analysis or user portfolio views.
 */
export const getUserComprehensiveDetailsTool = createTool({
    id: 'credoraFactory-getUserComprehensiveDetails',
    description: 'Fetches a comprehensive summary of a user\'s platform activity: their risk profile, borrowed pools, and funded pools with details.',
    inputSchema: GetUserComprehensiveDetailsInputSchema,
    outputSchema: z.union([
        UserComprehensiveDetailsSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetUserComprehensiveDetails(context.userAddress as `0x${string}`);
    },
});

/**
 * @description Retrieves an array containing detailed information for every loan pool created by the Credora Pool Factory.
 * Each element in the array includes static parameters and the dynamic state for a pool.
 * Due to fetching details for all pools, this can be resource-intensive and is best suited for off-chain data aggregation.
 */
export const getAllPoolsGeneralDetailsTool = createTool({
    id: 'credoraFactory-getAllPoolsGeneralDetails',
    description: 'Fetches an array of detailed information for every loan pool created by the factory. Intensive call, best for off-chain use.',
    inputSchema: z.object({}),
    outputSchema: z.union([
        z.array(FullLoanPoolDetailsSchema),
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        console.log("before fetching all of the pools");
        const allOfThePools = await originalGetAllPoolsGeneralDetails();
        console.log("this is the details about all of the pool", allOfThePools);
        return allOfThePools;
    },
});

/**
 * @description Retrieves a high-level financial and operational snapshot of the entire Credora lending platform, aggregated at the factory level.
 * This includes metrics such as total number of pools created, counts of pools in various statuses (Funding, Active, Repaid, Defaulted, Cancelled),
 * total value locked in funding pools, total principal in active loans, and overall principal and interest repaid across all pools.
 * This is useful for platform health monitoring and analytics. It iterates through all pools, making it resource-intensive.
 */
export const getFactoryFinancialSnapshotTool = createTool({
    id: 'credoraFactory-getFactoryFinancialSnapshot',
    description: 'Fetches an aggregated financial and operational snapshot of the factory (e.g., TVL, pool counts by status). Intensive call.',
    inputSchema: z.object({}),
    outputSchema: z.union([
        FactorySnapshotSchema,
        ContractErrorResponseSchema,
    ]),
    execute: async ({ context }, options) => {
        const abortSignal = options?.abortSignal;
        if (abortSignal?.aborted) {
            throw new Error("Tool execution aborted.");
        }
        return await originalGetFactoryFinancialSnapshot();
    },
}); 