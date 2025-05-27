import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { AddressSchema } from "./zodSchemas"; // Assuming zodSchemas.ts is in the same directory or path is adjusted
import { generateUserContextForAgent } from "@/src/lib/server/userDataService";

const GetUserContextInputSchema = z.object({
    userAddress: AddressSchema.describe("The user's Ethereum wallet address."),
    userName: z.string().optional().describe("The user's name, if provided."), // Optional name
});

const GetUserContextOutputSchema = z.object({
    contextString: z.string().describe("A comprehensive string detailing the user's profile, activities, and relevant protocol statistics."),
    userAddress: AddressSchema.describe("The user's Ethereum wallet address for confirmation."),
    userName: z.string().optional().describe("The user's name, if provided, for confirmation."),
    status: z.string().describe("A status message indicating the outcome of the context retrieval.")
});

/**
 * @description Fetches and formats a comprehensive context string for a given user address.
 * This context includes the user's risk profile, borrower/lender activities, and general protocol statistics.
 * It is intended to be used by the AI agent to personalize responses and update its working memory.
 */
export const getUserContextTool = createTool({
    id: 'credora-getUserContext',
    description: 'Fetches and formats a comprehensive context string for a given user address, including their financial profile on Credora and protocol stats. This should be used when a user provides their wallet address to load their information.',
    inputSchema: GetUserContextInputSchema,
    outputSchema: GetUserContextOutputSchema,
    execute: async ({ context }) => {
        try {
            const { userAddress, userName } = context;
            const contextString = await generateUserContextForAgent(userAddress as `0x${string}`);

            return {
                contextString,
                userAddress: userAddress as `0x${string}`,
                userName,
                status: `Successfully fetched context for ${userName || userAddress}.`
            };
        } catch (error: any) {
            console.error("Error in getUserContextTool:", error);
            return {
                contextString: `Error fetching context: ${error.message}`,
                userAddress: context.userAddress as `0x${string}`,
                userName: context.userName,
                status: `Failed to fetch context for ${context.userName || context.userAddress}. Error: ${error.message}`
            };
        }
    },
}); 