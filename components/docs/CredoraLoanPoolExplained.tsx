"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { DatabaseZap, Users, RefreshCw, TrendingUp, AlertTriangle, XCircle, Landmark, CheckCircle2, HandCoins, FileText } from 'lucide-react';

const CredoraLoanPoolExplained: React.FC = () => {
    // const cardVariants = {
    //     offscreen: {
    //         opacity: 0,
    //         y: 50
    //     },
    //     onscreen: {
    //         opacity: 1,
    //         y: 0,
    //         transition: {
    //             type: "spring",
    //             bounce: 0.4,
    //             duration: 0.8,
    //             delay: 0.2
    //         }
    //     }
    // };

    return (
        <div
            className="p-6 md:p-8 rounded-xl border border-neonRed/50 bg-gray-900/70 shadow-2xl glow-container-neonRed-md hover:shadow-neonRed/70 transition-shadow duration-300"
        // initial="offscreen"
        // whileInView="onscreen"
        // viewport={{ once: true, amount: 0.2 }}
        // variants={cardVariants}
        >
            <div className="flex items-center mb-6">
                <DatabaseZap className="w-10 h-10 sm:w-12 sm:h-12 text-neonRed mr-4" />
                <h3 className="text-2xl sm:text-3xl font-orbitron text-neonRed glow-text-neonRed">
                    2. CredoraLoanPool.sol
                </h3>
            </div>

            <p className="text-lg text-white/90 mb-4 leading-relaxed">
                The <code>CredoraLoanPool.sol</code> contract is the heart of each individual lending operation. Every time a new loan is approved and initiated via the <code>CredoraPoolFactory</code>, a new instance (a clone) of this contract is deployed. It manages the entire lifecycle of a specific loan, from funding to repayment and yield distribution.
            </p>

            <div className="my-6 p-4 border border-dashed border-neonGreen/50 rounded-lg bg-black/30">
                <p className="text-neonGreen font-semibold text-md">
                    <strong className='font-orbitron'>Core Purpose:</strong> Manages a single, specific loan, including its funding, lifecycle, repayments, and yield distribution to lenders.
                </p>
            </div>

            <h4 className="text-xl font-orbitron text-neonGreen mb-4 mt-6">Key Responsibilities & Features:</h4>
            <ul className="space-y-4 list-inside list-image-[url(/assets/bullet-neon-red.svg)] text-white/80">
                <li>
                    <FileText className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>ERC-20 Token Functionality:</strong> Each loan pool contract also acts as an ERC-20 token. When lenders contribute funds (e.g., USDC) to the pool, they receive a proportional amount of these pool-specific tokens. These tokens represent their share in that particular loan and are unique to each pool (e.g., &quot;Credora Loan Project Alpha&quot;, symbol &quot;crALPHA&quot;).
                </li>
                <li>
                    <RefreshCw className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>Loan Lifecycle Management:</strong> The contract meticulously manages the loan through various statuses:
                    <ul className="ml-6 mt-2 space-y-1 list-disc list-inside text-white/70 text-sm">
                        <li><code>PendingInitialization</code>: Initial state before parameters are set by the factory.</li>
                        <li><code>Funding</code>: Lenders can contribute the accepted currency to the pool.</li>
                        <li><code>Active</code>: The loan is fully funded, and repayments are expected from the borrower.</li>
                        <li><code>Repaid</code>: The borrower has successfully paid back the principal and all interest.</li>
                        <li><code>Defaulted</code>: Marked by an admin if the borrower fails to meet their obligations.</li>
                        <li><code>Cancelled</code>: Marked by an admin if the loan is not funded or needs to be stopped pre-activation.</li>
                    </ul>
                </li>
                <li>
                    <Landmark className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>Funding Mechanism:</strong> Accepts the <code>acceptedCurrency</code> (e.g., USDC) from lenders during the <code>Funding</code> phase. It ensures that funding does not exceed the <code>loanAmountPrincipal</code>.
                </li>
                <li>
                    <TrendingUp className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>Repayment Handling:</strong> Manages repayments from the borrower. It supports both periodic installments (<code>repayInstallment</code>) and full early repayment of the outstanding loan balance (<code>repayFullLoan</code>). The contract tracks principal and interest paid.
                </li>
                <li>
                    <HandCoins className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>Yield Claiming:</strong> Once the loan status is <code>Repaid</code>, lenders can call <code>claimYield</code>. This function allows them to burn their pool tokens in exchange for their proportional share of the repaid principal and accrued interest.
                </li>
                <li>
                    <CheckCircle2 className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>Installment Logic:</strong> For loans structured with installments, it calculates and tracks due dates, principal per period, and interest per period. It also handles potential rounding differences for the final installment to ensure full repayment.
                </li>
                <li>
                    <Users className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>Access Control & Pausability:</strong> Inherits from OpenZeppelin contracts for role-based access (<code>MINTER_ROLE</code>, <code>PAUSER_ROLE</code>, <code>DEFAULT_ADMIN_ROLE</code>) and allows pausing of critical functions by authorized accounts in emergencies.
                </li>
            </ul>

            <h4 className="text-xl font-orbitron text-neonGreen mb-4 mt-8">Initialization & Activation:</h4>
            <p className="text-white/80 mb-3 leading-relaxed">
                When a <code>CredoraLoanPool</code> is cloned by the factory, its <code>initialize</code> function is called. This sets up all the specific parameters of the loan: the borrower&apos;s address, loan amount, interest rate, duration, accepted currency, unique token name and symbol for the pool shares, the pool admin (often the factory itself or a governance contract), and the loan&apos;s purpose. Once initialized, the pool enters the <code>Funding</code> state. If and when the <code>totalFundsRaised</code> reaches the <code>loanAmountPrincipal</code>, the <code>_activateLoan</code> internal function is triggered, transitioning the status to <code>Active</code>, recording the <code>loanStartTime</code>, and setting up the <code>maturityTime</code> and the <code>nextInstallmentDueDate</code>.
            </p>

            <div className="mt-8 p-4 border border-neonRed/30 rounded-lg bg-black/20 glow-on-hover-subtle">
                <p className="text-sm text-neonRed/80">
                    <strong className="font-orbitron text-neonRed">Key Interaction Points:</strong> Lenders interact via <code>fund</code> and <code>claimYield</code>. Borrowers primarily use <code>repayInstallment</code> or <code>repayFullLoan</code>. Admins manage the lifecycle with functions like <code>markAsDefaulted</code> or <code>cancelLoan</code>.
                </p>
            </div>

        </div>
    );
};

export default CredoraLoanPoolExplained; 