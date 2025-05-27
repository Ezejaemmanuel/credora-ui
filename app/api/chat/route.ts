import { publicClient } from "@/lib/viemConfig";
import { mastra } from "@/src/mastra";
import { NextRequest, NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // Extract the messages from the request body
  const body = await req.json();
  console.log("this is the whole body that is being sent to the agent", body);
  const { messages } = body;
  console.log('messages', messages);

  // Get userAddress from header
  const userAddress = req.headers.get('X-User-Address');
  console.log('userAddress', userAddress);

  if (!userAddress || userAddress === 'unknown') {
    return NextResponse.json({ error: "User address is required and cannot be unknown." }, { status: 400 });
  }

  // Use userAddress as resourceId and a fixed threadId for now
  const resourceId = userAddress;
  const threadId = userAddress; // Fixed threadId since there's only one thread for now

  console.log('resourceId', resourceId);
  console.log('threadId', threadId);

  // Get the unifiedCredoraAgent instance from Mastra
  const agent = mastra.getAgent("unifiedCredoraAgent");

  // Stream the response using the agent with the determined resourceId and threadId
  const result = await agent.stream(messages, { threadId, resourceId });

  // Return the result as a data stream response
  return result.toDataStreamResponse();
}