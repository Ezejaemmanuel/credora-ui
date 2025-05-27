# Credora Protocol AI: Architecture and Implementation Guide

This document outlines the suggested architecture for building an interactive AI for the Credora protocol, leveraging Mastra AI's AgentNetwork and a secure, tool-based approach for smart contract interactions.

## 1. Core AI Architecture: Mastra AgentNetwork

The AI will be built around Mastra AI's **AgentNetwork**. This network consists of a central **Orchestrator/Router Agent** that intelligently delegates tasks to a suite of **Specialized Agents**. Each specialized agent is equipped with specific tools to perform its functions.

```
+--------------------------+
|     User Interface       |
| (Futuristic, Cinematic)  |
+--------------------------+
           | (GraphQL API)
           v
+--------------------------+
| Mastra AgentNetwork      |
| (Orchestrator/Router LLM)|
+--------------------------+
     |         |         |
     v         v         v
 [Specialized Agents & Tools]
```

## 2. Orchestrator/Router Agent (Mastra AgentNetwork Core)

*   **Purpose**: The central intelligence of the AI. It receives user requests (or system triggers via the backend), understands the intent, and dynamically routes tasks to the most appropriate specialized agent or a sequence of them.
*   **Mastra Implementation**:
    *   `new AgentNetwork({ name: "Credora Protocol AI Network", instructions: "...", model: "gpt-4o_or_similar", agents: [/* array of specialized agents */] })`
*   **Key Instructions**: "You are the central coordinator for the Credora DeFi protocol AI. Your primary function is to understand user requests or system tasks and delegate them to the appropriate specialized agents. Prioritize information gathering and verification before initiating any state-changing operations. Ensure all interactions are clear, secure, and align with Credora protocol rules. You must use the provided specialized agents and their tools to fulfill requests."
*   **Primary Tool**: Mastra AgentNetwork's internal `transmit` tool to call other agents.

## 3. Specialized Agents & Their Tools

Each specialized agent is a Mastra `Agent` instance with tailored instructions and tools.

### 3.1. User Interaction & Query Agent

*   **Name**: `UserQueryAgent`
*   **Instructions**: "You specialize in understanding and responding to user queries about the Credora protocol. Fetch publicly available information from smart contracts and explain it clearly and concisely. For actions involving transactions or sensitive data, defer to and coordinate with other specialized agents as directed by the Orchestrator."
*   **Tools**:
    *   **`SmartContractQueryTool`**:
        *   **Functionality**: Executes read-only calls (`view` or `pure` functions) on `CredoraPoolFactory.sol` and `CredoraLoanPool.sol`.
        *   **Capabilities**: Fetching pool details, user-specific information (risk profiles, loan involvements), factory statistics, dynamic pool states, etc.
        *   **Implementation**: Uses a blockchain interaction library (e.g., Ethers.js) with a read-only provider, configured with contract ABIs and addresses. Can be a single tool with dynamic function calling or multiple specific query tools.
    *   **`DocumentationQueryTool` (RAG-based, Optional)**:
        *   **Functionality**: Answers questions based on the project's markdown documentation (e.g., `CredoraLoanPool.md`, `CredoraPoolFactory.md`).
        *   **Implementation**: Utilizes Mastra's RAG capabilities.

### 3.2. Risk Oracle Agent

*   **Name**: `RiskOracleAgent`
*   **Instructions**: "You are the AI oracle for assessing borrower risk. Use web search tools to gather external, publicly available data relevant to risk assessment (if applicable and designed). You are responsible for interacting with the `CredoraPoolFactory` contract to set or update risk profiles based on comprehensive analysis. Adhere strictly to protocol limits like `MAX_INTEREST_RATE_BPS` and operate only with explicit instruction from the Orchestrator."
*   **Tools**:
    *   **`WebSearchTool` (Optional)**:
        *   **Functionality**: Searches the web for specified information (e.g., for KYC/AML or general reputation, if part of the risk model).
    *   **`SetRiskProfileTool` (AI-Initiated Transaction)**:
        *   **Functionality**: Calls `setRiskProfile(borrower, maxLoanAmount, interestRateBPS)` on `CredoraPoolFactory.sol`.
        *   **Security**: This tool **must** use a securely managed backend wallet (private key stored in environment variables or secrets manager, NOT accessible by the LLM) authorized with the `AI_ROLE`.

### 3.3. Loan Lifecycle Management Agent

*   **Name**: `LoanLifecycleAgent`
*   **Instructions**: "You manage the lifecycle of loan pools. You can initiate loan pool creation after a risk profile is established and a valid request is received. You also handle administrative actions like marking loans as defaulted or cancelled, but only when explicitly authorized and directed by the Orchestrator, adhering to governance rules."
*   **Tools**:
    *   **`CreateLoanPoolTool` (AI-Initiated Transaction)**:
        *   **Functionality**: Calls `createLoanPool(...)` on `CredoraPoolFactory.sol`.
        *   **Security**: Uses a securely managed backend wallet authorized with the `POOL_CREATOR_ROLE`.
    *   **`LoanAdminTool` (AI-Initiated Transaction)**:
        *   **Functionality**: Calls `markAsDefaulted(poolAddress)` or `cancelLoan(poolAddress)` on a `CredoraLoanPool` instance.
        *   **Security**: Uses a securely managed backend wallet that is the `poolAdmin` or holds an equivalent administrative role for the specific pool.

### 3.4. Borrower Interaction Agent

*   **Name**: `BorrowerAgent`
*   **Instructions**: "You assist borrowers with interactions related to their loans. You can guide them through repaying installments or their full loan. You will prepare transaction details, but the borrower must always sign and send the actual transaction using their own wallet. Confirm all details with the user before presenting transaction information."
*   **Tools**:
    *   **`PrepareRepaymentTool` (User-Initiated Transaction Preparation)**:
        *   **Functionality**: Prepares transaction parameters for `repayInstallment()` or `repayFullLoan()` on `CredoraLoanPool.sol`.
        *   **Output**: Returns transaction data (to, data, value) for the UI to pass to the user's wallet.

### 3.5. Lender Interaction Agent

*   **Name**: `LenderAgent`
*   **Instructions**: "You assist lenders with participating in loan pools and managing their investments. You can guide them through funding a pool, claiming yield, or withdrawing funds from a cancelled pool. You will prepare transaction details, but the lender must always sign and send the actual transaction using their own wallet. Confirm all details with the user before presenting transaction information."
*   **Tools**:
    *   **`PrepareFundingTool` (User-Initiated Transaction Preparation)**:
        *   **Functionality**: Prepares transaction parameters for `fund(amount)` on `CredoraLoanPool.sol`.
    *   **`PrepareClaimYieldTool` (User-Initiated Transaction Preparation)**:
        *   **Functionality**: Prepares transaction parameters for `claimYield()` on `CredoraLoanPool.sol`.
    *   **`PrepareWithdrawCancelledTool` (User-Initiated Transaction Preparation)**:
        *   **Functionality**: Prepares transaction parameters for `withdrawCancelledFunds()` on `CredoraLoanPool.sol`.

## 4. Smart Contract Interaction Strategy (Tool-Based)

The AI will interact with smart contracts exclusively through pre-defined, secure tools. **The LLM will NOT generate blockchain interaction code for execution, nor will it ever directly handle private keys.**

*   **Query Tools**:
    *   Make read-only calls.
    *   Use a library like Ethers.js with a read-only provider.
    *   Encapsulate ABI and function call logic.
*   **AI-Initiated Transaction Tools**:
    *   For state changes initiated by the AI system (e.g., `RiskOracleAgent` setting a profile).
    *   Each tool is hardcoded for a specific contract function.
    *   Uses a dedicated, securely stored private key on the backend, associated with the necessary on-chain role (e.g., `AI_ROLE`, `POOL_CREATOR_ROLE`). The LLM only triggers the tool with business-level parameters.
    *   Handles transaction signing, sending, and confirmation monitoring within the tool's secure backend logic.
*   **User-Initiated Transaction Preparation Tools**:
    *   For actions users must authorize and pay for (e.g., funding, repaying).
    *   The AI tool gathers necessary data and constructs the transaction parameters (`to`, `data`, `value`).
    *   These parameters are sent to the User Interface.
    *   The User Interface uses the user's connected wallet (e.g., MetaMask, via Wagmi/Viem) to prompt the user to sign and send the transaction. **The AI never sees the user's private key.**
*   **Message Signing Tools (If Required)**:
    *   If the AI entity needs to sign off-chain messages (e.g., for EIP-712).
    *   A specific tool would use a dedicated, securely stored private key for this AI identity. The LLM requests the signature on a given message.

## 5. Security Principles for AI & Smart Contracts

*   **Principle of Least Privilege**: AI-controlled wallets should only have the specific roles necessary for their functions (e.g., `AI_ROLE` wallet cannot create pools).
*   **Secure Key Management**: Private keys for AI-initiated transactions must be stored securely on the backend (e.g., hardware security modules (HSMs), managed cloud KMS, or at minimum, securely configured environment variables with restricted access). They are *never* exposed to the LLM.
*   **User Sovereignty for Financial Transactions**: Users always sign their own financial transactions using their personal wallets. The AI acts as an assistant, preparing and explaining, but not executing on their behalf without their explicit wallet interaction.
*   **Tool-Based Constraint**: The LLM's ability to interact with contracts is strictly limited by the available, pre-audited tools. It cannot perform arbitrary calls.
*   **Input Validation**: Tools should validate inputs received from the LLM before constructing transactions.
*   **Named Imports and Type Safety**: Use named imports for ABIs and types in the backend tool implementations (TypeScript/JavaScript) to ensure correctness.

## 6. Enhancing Interactivity ("Very Interactive and Nice")

*   **Natural Language Flow**: Design agent instructions and prompts to facilitate natural, conversational interactions.
*   **Streaming Responses**: Utilize Mastra AI's `stream()` capabilities for agents and the network to send responses token by token, giving a real-time, "typing" effect.
*   **Contextual Memory**: Leverage Mastra's agent memory features (Working Memory, Semantic Recall) to maintain conversation context within a session.
*   **Explainability**: Before any transaction is prepared or initiated, the AI should clearly explain:
    *   What action it is about to perform/prepare.
    *   Why this action is being taken.
    *   What the expected outcome is.
    *   For user-initiated transactions, what the user needs to do (e.g., "Please review and confirm this transaction in your wallet to proceed with funding X amount to Y pool.").
*   **Proactive Assistance (Advanced)**:
    *   Example: If a loan installment is approaching its due date, a backend service could monitor this and trigger the Orchestrator to have the `UserQueryAgent` proactively notify the borrower through the UI.
*   **Visual Feedback in UI**: The UI should dynamically reflect the AI's status and actions (e.g., "Searching for information...", "Preparing transaction...", "Waiting for blockchain confirmation...").
*   **Voice Capabilities (Optional)**: Explore Mastra's voice features if your UI supports voice input/output for a more immersive experience.

## 7. High-Level Workflow Example (Loan Application)

1.  **User**: "I want to apply for a 10,000 USDC loan for 1 year for my project."
2.  **UI**: Sends request to backend GraphQL endpoint, which forwards to Mastra AgentNetwork (Orchestrator).
3.  **Orchestrator**:
    *   "User wants a loan. Need to check/set risk profile, then create a pool."
    *   Delegates to `UserQueryAgent`: "Does user X have a risk profile?"
4.  **UserQueryAgent**: Uses `SmartContractQueryTool` to call `getBorrowerRiskProfileExists`. Reports back.
5.  **Orchestrator** (if no profile): Delegates to `RiskOracleAgent`: "Assess and set risk profile for user X for a potential 10k loan."
6.  **RiskOracleAgent**: (Uses `WebSearchTool` if configured), determines parameters, uses `SetRiskProfileTool` to transact with `CredoraPoolFactory`. Reports success/failure.
7.  **Orchestrator**: Delegates to `UserQueryAgent`: "Inform user of risk assessment outcome: Eligible for Y amount at Z rate."
8.  **UserQueryAgent**: Relays info to user. User confirms.
9.  **Orchestrator**: Delegates to `LoanLifecycleAgent`: "Create loan pool for user X with amount A, duration B, installments C, purpose P."
10. **LoanLifecycleAgent**: Uses `CreateLoanPoolTool` to transact with `CredoraPoolFactory`. Reports success.
11. **Orchestrator**: Delegates to `UserQueryAgent`: "Inform user: Loan pool XYZ created. It is now in funding."
12. **UserQueryAgent**: Relays info to user.

This structured, tool-centric approach ensures that the AI is powerful and interactive while maintaining the necessary security and control for a DeFi application. 