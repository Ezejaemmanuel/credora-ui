# 🌐 **Credora** — AI-Powered Undercollateralized Lending on Web3

> **Credora** is a decentralized lending protocol that lets users borrow crypto **without needing collateral**. It uses an AI-based credit scoring system and tokenized loan participation to give people and businesses access to capital based on their **data and trustworthiness**, not just their existing crypto wealth.

---

## 🎯 Who is Credora For?

Credora serves several key groups:

- **Borrowers:** Individuals or businesses seeking access to capital (loans in cryptocurrency like USDC) without needing to provide traditional crypto collateral. They leverage their financial data and on-chain history to get a risk assessment.
- **Lenders:** Individuals or entities looking to earn yield on their cryptocurrency by funding loans. They can browse different loan opportunities, assess the AI-generated risk scores, and decide where to allocate their capital.
- **AI Providers/Oracles (Future):** Entities responsible for running the AI models that assess borrower risk profiles. In the current version, this is a role managed by the platform administrators.
- **Pool Creators/Platform Administrators:** Entities with permissions to set up new loan pools based on AI risk assessments and manage the overall platform.

---

## ✨ How Credora Works: A Step-by-Step Guide

Credora streamlines the lending process using smart contracts and AI:

1.  **Borrower Profile Assessment (AI-Driven):**

    - A potential borrower provides necessary data (e.g., wallet activity, financial statements, invoice screenshots).
    - An AI engine analyzes this data to determine the borrower's risk profile.
    - The AI outputs a **risk score**, a **suggested interest rate**, and the **maximum loan amount** the borrower is eligible for.

2.  **Risk Profile Recorded On-Chain:**

    - An authorized account (with `AI_ROLE`) submits this risk profile (max loan amount, interest rate) to the `CredoraPoolFactory` smart contract. This securely stores the borrower's assessment on the blockchain.

3.  **Loan Request & Pool Creation:**

    - The borrower (or a platform admin on their behalf) requests a loan, specifying the amount (within their assessed limit), desired duration, and purpose.
    - An authorized account (with `POOL_CREATOR_ROLE`) calls the `CredoraPoolFactory` to create a new, unique `CredoraLoanPool` smart contract for this specific loan.
    - This new loan pool contract also acts as an **ERC-20 token** (e.g., `crLoan-XYZ`). These tokens will represent lenders' shares in this particular loan.

4.  **Lender Participation (Funding the Loan):**

    - Lenders can browse available loan pools listed by the `CredoraPoolFactory`.
    - They review the borrower's risk score, loan terms (amount, interest, duration), and purpose.
    - If they choose to fund a loan, they send the `acceptedCurrency` (e.g., USDC) to the `CredoraLoanPool` contract.
    - In return, they receive an equivalent amount of that pool's specific ERC-20 tokens, representing their stake in the loan.

5.  **Loan Activation:**

    - Once the total `loanAmountPrincipal` is raised from lenders, the `CredoraLoanPool` automatically transitions to an `Active` status.
    - The pooled funds (e.g., USDC) are then available to be transferred to the borrower (this step is implicitly part of the design; the collected funds are held by the pool contract for the borrower or for repayment distribution). _Note: The current implementation keeps funds in the pool to manage repayments directly._

6.  **Loan Repayment:**

    - The borrower repays the loan according to the agreed schedule (e.g., monthly installments or a lump sum).
    - Repayments (principal + interest) are made in the `acceptedCurrency` directly to the `CredoraLoanPool` contract.
    - The contract tracks installments paid, total principal repaid, and total interest repaid.
    - Borrowers can make regular installment payments or repay the entire outstanding loan early.

7.  **Yield Distribution & Claiming:**

    - Once the loan is fully `Repaid` by the borrower, lenders who hold the pool's ERC-20 tokens can claim their share of the collected principal and interest.
    - They do this by interacting with the `CredoraLoanPool` contract, which burns their pool tokens and transfers their proportional share of the repaid funds.

8.  **Handling Defaults or Cancellations:**
    - If a borrower fails to repay, an admin can mark the loan as `Defaulted`.
    - If a loan doesn't get fully funded within a certain timeframe or needs to be stopped, an admin can `Cancel` it (if still in the `Funding` stage). Lenders can then withdraw their contributed funds.

---

## 🚀 Core Features

- **Undercollateralized Lending:** Borrowers can access loans without locking up significant crypto assets as collateral.
- **AI-Powered Risk Assessment:** An AI engine evaluates borrower risk, suggesting terms and loan amounts.
- **Tokenized Loan Shares:** Each loan pool issues its own ERC-20 tokens to lenders, representing their share of the loan. These tokens can potentially be traded on secondary markets (future feature).
- **Dedicated Loan Pools:** Each loan is managed by its own smart contract instance, ensuring isolation and clarity.
- **Flexible Repayments:** Supports both periodic installments and full early loan repayments.
- **On-Chain Transparency:** Loan terms, funding status, and repayment progress are recorded on the blockchain.
- **Role-Based Access Control:** Specific actions like setting risk profiles or creating pools are restricted to authorized roles.
- **Pausable Contracts:** Loan pool operations can be paused by administrators in emergencies.

---

## 🧩 Smart Contracts: The Engine of Credora

Credora's logic is primarily managed by the following Solidity smart contracts:

### 1. `CredoraPoolFactory.sol`

- **Purpose:** This is the "master factory" contract. It doesn't manage individual loans itself but is responsible for creating and keeping track of all individual loan pool contracts. It also stores the AI-assessed risk profiles for borrowers.
- **Key Responsibilities:**
  - **Storing Risk Profiles:** Allows an `AI_ROLE` (an account designated to represent the AI assessment process) to record a borrower's maximum loan amount and suggested interest rate.
  - **Creating Loan Pools:** Allows a `POOL_CREATOR_ROLE` to deploy new `CredoraLoanPool` contracts (as clones/proxies of a master implementation) for borrowers, based on their approved risk profiles and requested loan terms.
  - **Tracking Pools:** Maintains a list of all loan pools ever created.
- **Key Functions (Simplified):**
  - `setRiskProfile(borrower, maxLoanAmount, interestRateBPS)`: Called by the AI role to save a borrower's credit assessment.
  - `createLoanPool(borrower, loanAmount, duration, installments, tokenName, tokenSymbol, purpose)`: Called by a pool creator to launch a new loan pool.
  - `getPoolsByBorrower(borrower)`: Returns a list of all loan pools associated with a specific borrower.
  - `getAllPools()`: Returns a list of every loan pool created by the factory.
  - `getUserComprehensiveDetails(userAddress)`: Provides a detailed view of a user's risk profile, their borrowed loans, and loans they've funded.
  - `getFactoryFinancialSnapshot()`: Gives an overview of the platform's financial health (total active loans, funds in funding pools, etc.).
- **More Details:** [CredoraPoolFactory.md](./docs/core/CredoraPoolFactory.md)

### 2. `CredoraLoanPool.sol`

- **Purpose:** This contract represents a single, specific loan. Every time a new loan is approved and initiated via the `CredoraPoolFactory`, a new instance (a "clone") of this contract is deployed.
- **Key Responsibilities:**
  - **ERC-20 Token:** Functions as an ERC-20 token. When lenders fund the loan, they receive tokens from this contract, representing their share. The token typically has a unique name and symbol for each loan (e.g., "Credora Loan Project Alpha", "crALPHA").
  - **Loan Lifecycle Management:** Manages the entire lifecycle of the loan:
    - `PendingInitialization`: Initial state before `initialize` is called.
    - `Funding`: Lenders can contribute funds.
    - `Active`: Loan is fully funded, borrower can (conceptually) use funds, and repayments are expected.
    - `Repaid`: Borrower has successfully paid back the principal and all interest.
    - `Defaulted`: Loan is marked as defaulted if the borrower fails to meet obligations.
    - `Cancelled`: Loan is cancelled (e.g., if not funded) and lenders can withdraw their contributions.
  - **Funding:** Accepts the `acceptedCurrency` (e.g., USDC) from lenders.
  - **Repayments:** Handles principal and interest repayments from the borrower, supporting both periodic installments and full early repayment.
  - **Yield Claiming:** Allows lenders to burn their pool tokens to redeem their proportional share of the repaid principal and interest once the loan is fully `Repaid`.
  - **Installment Logic:** Calculates and tracks due dates, principal per period, and interest per period for installment-based loans.
- **Key Functions (Simplified):**
  - `initialize(...)`: Sets up the loan's specific parameters (borrower, amount, rate, duration, currency, token name/symbol, admin, purpose) when the pool is first created by the factory.
  - `fund(amount)`: Called by lenders to contribute to the loan. They send USDC and receive pool tokens.
  - `repayInstallment()`: Called by the borrower to pay a single due installment.
  - `repayFullLoan()`: Called by the borrower to pay off the entire remaining loan balance early.
  - `claimYield()`: Called by lenders after the loan is fully repaid to get their principal and interest back.
  - `cancelLoan()`: Called by an admin to cancel a loan (typically during the funding phase).
  - `withdrawCancelledFunds()`: Called by lenders to get their money back if a loan is cancelled.
  - `markAsDefaulted()`: Called by an admin if the borrower defaults.
  - `getLoanPoolInfo()`: Returns a comprehensive struct with all details about the loan pool.
  - `getLenderPoolInformation(lenderAddress)`: Shows a specific lender's stake and claimable amounts.
- **More Details:** [CredoraLoanPool.md](./docs/core/CredoraLoanPool.md)

### 3. `Roles.sol`

- **Purpose:** This contract defines and manages the different roles within the Credora system, using OpenZeppelin's `AccessControl` contract. This ensures that only authorized addresses can perform sensitive actions.
- **Key Roles Defined:**
  - `ADMIN_ROLE`: Has top-level control, can grant/revoke other roles, and manage system parameters. Typically the deployer or a multisig wallet.
  - `AI_ROLE`: Authorized to submit borrower risk profiles to the `CredoraPoolFactory`.
  - `POOL_CREATOR_ROLE`: Authorized to create new `CredoraLoanPool` instances via the `CredoraPoolFactory`.
  - `GOVERNANCE_ROLE`: Intended for future DAO-like actions, such as managing loan defaults or updating protocol parameters.
- **Functionality:** Provides functions to grant, revoke, and check roles. It also includes modifiers (like `onlyAdmin`, `onlyAI`) that can be used in other contracts to restrict access to certain functions.
- **More Details:** [roles.md](./docs/core/roles.md)

### 4. `MockUSDC.sol`

- **Purpose:** This is a **test version** of the USDC stablecoin. In a real-world deployment, Credora would integrate with the official USDC contract.
- **Key Features:**
  - It's an ERC-20 token with 6 decimals, just like real USDC.
  - It includes a public `mintTestTokens` function that allows anyone to get some MockUSDC for testing purposes within the Credora platform on a test network. **This minting function would not exist in a live environment with real USDC.**
- **Why it's used:** Essential for development and testing, allowing developers and users to experiment with the platform's lending and borrowing features without using real money.

### 5. `interfaces/ICredoraLoanPool.sol`

- **Purpose:** This isn't a full contract but an "interface." It defines _how_ other smart contracts (like `CredoraPoolFactory`) can interact with any `CredoraLoanPool` contract. It lists the functions that a `CredoraLoanPool` makes available, their parameters, and what they return, without showing the actual implementation (the code inside the functions).
- **Importance:** Ensures that different contracts can communicate with each other reliably. The `CredoraPoolFactory` uses this interface to call `initialize` on newly cloned loan pools, and to call view functions like `getLoanPoolInfo` or `getLenderPoolInformation`. It also defines the structures (`FullLoanPoolInfo`, `LenderPoolInfo`) used to pass complex data between contracts.

---

## 🔑 Understanding Key Terms

- **Smart Contract:** A program that runs on the blockchain. They automatically execute the terms of an agreement, like the loan terms in Credora.
- **ERC-20 Token:** A standard for creating tokens on the Ethereum blockchain (and compatible chains). USDC is an ERC-20 token, and so are the shares lenders receive in each `CredoraLoanPool`.
- **Basis Points (BPS):** A unit of measure used in finance to describe a percentage. 100 BPS = 1%. So, an interest rate of 500 BPS is 5%.
- **Decentralized Finance (DeFi):** Financial applications built on blockchain technology, aiming to be open, transparent, and accessible without traditional intermediaries.
- **Collateral:** An asset pledged by a borrower to a lender to secure a loan. If the borrower defaults, the lender can seize the collateral. Credora focuses on _undercollateralized_ loans, meaning less or no direct collateral is required.
- **Yield:** The return earned on an investment, like the interest lenders receive for funding loans.
- **USDC (USD Coin):** A type of cryptocurrency known as a "stablecoin." It's designed to maintain a stable value, typically pegged 1:1 to the US dollar.

---

## 💡 Additional Features (Post-Hackathon)

These are advanced features that improve risk, compliance, and credibility — and can be added _after_ the MVP is complete.

### 🪪 Decentralized Identity (DID) + KYC

Borrowers will be able to link their wallet to a **decentralized identity (DID)**:

- Verifies who they are (individual or business)
- Uses zero-knowledge proofs to protect privacy
- Increases trust and reduces fraud

We may integrate providers like **Polygon ID**, **Fractal**, or **Lit Protocol** to manage this. For regulatory-compliant markets, full **KYC/KYB** flow will be added.

### 🧬 On-Chain Reputation Profiles

Borrowers can build **on-chain credit profiles** over time:

- Reputation NFTs (e.g., "On-Time Repayer")
- Loan history and repayment streaks
- Integration with other protocols (Gitcoin, Lens, etc.)

This helps establish **trust without collateral** and builds a long-term ecosystem of credible borrowers.

### 📈 Protocol Fees & Treasury

- **Implementation of Protocol Fee**: The platform could take a small percentage of the interest paid by borrowers as a protocol fee. This mechanism needs to be designed and implemented within the `CredoraLoanPool.sol` contract's repayment functions or via a wrapper contract.
- **Treasury Management**: Establish a treasury contract and governance process for managing collected fees, potentially funding further development, security audits, or ecosystem incentives.

### ↩️ Fund Management on Cancellation/Default

- **Enhanced Fund Return on Cancellation**: While `withdrawCancelledFunds` exists, the process can be further refined, perhaps with automated triggers or clearer UI flows if a loan is cancelled during the `Funding` phase.
- **Handling Defaulted Loans**: Define a clear process for managing defaulted loans. While they can be marked as `Defaulted`, the mechanism for potential recovery or loss distribution to lenders needs to be specified (e.g., secondary market for defaulted debt, partial claims if some funds are recoverable).

### ⏳ Grace Periods & Late Fees

- For installment-based loans in `CredoraLoanPool.sol`, consider adding logic for grace periods for repayments and a system for applying late fees. This would add flexibility for borrowers and a compensation mechanism for lenders for late payments.

### 🏷️ Enhanced Loan Purpose Tracking

- While a `purpose` field is stored, further integration or categorization of this data could provide better analytics and filtering for lenders.

---

## 🎯 Use Case Example

A microbusiness in Nairobi wants to borrow \$5,000 USDC to buy solar kits. They submit basic info (e.g., past revenue, mobile money statements) and get a risk score via AI integrated into Credora. Lenders from around the world, seeing the risk profile and loan purpose, contribute to fund the loan via the specific `CredoraLoanPool` for this business. The business repays the loan with interest over 6 months. Each lender earns their share of the interest.

There's no traditional collateral. The risk is managed through:

- Smart AI evaluation of the business's potential and trustworthiness.
- Transparent on-chain tracking of loan terms and repayments.
- Risk sharing among multiple lenders who receive tokenized shares of the loan.
- Potential future community governance for handling exceptions.

---

## 🌟 Vision

Credora is building a new kind of credit infrastructure:

- **Trust-based, not collateral-based:** Focusing on the borrower's potential and reliability.
- **Global and inclusive:** Aiming to provide access to capital regardless of geographic location or existing wealth.
- **AI-enhanced and DeFi-native:** Leveraging cutting-edge technology for smarter, more efficient lending.

> "If you're trustworthy and verifiable, you should have access to capital — no matter who you are or where you're from."

