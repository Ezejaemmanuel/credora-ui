"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            title: "Borrower Profile Assessment (AI-Driven)",
            details: [
                "A potential borrower provides necessary data (e.g., wallet activity, financial statements, invoice screenshots).",
                "An AI engine analyzes this data to determine the borrower's risk profile.",
                "The AI outputs a <strong>risk score</strong>, a <strong>suggested interest rate</strong>, and the <strong>maximum loan amount</strong> the borrower is eligible for."
            ]
        },
        {
            title: "Risk Profile Recorded On-Chain",
            details: [
                "An authorized account (with <code>AI_ROLE</code>) submits this risk profile (max loan amount, interest rate) to the <code>CredoraPoolFactory</code> smart contract. This securely stores the borrower's assessment on the blockchain."
            ]
        },
        {
            title: "Loan Request & Pool Creation",
            details: [
                "The borrower (or a platform admin on their behalf) requests a loan, specifying the amount (within their assessed limit), desired duration, and purpose.",
                "An authorized account (with <code>POOL_CREATOR_ROLE</code>) calls the <code>CredoraPoolFactory</code> to create a new, unique <code>CredoraLoanPool</code> smart contract for this specific loan.",
                "This new loan pool contract also acts as an <strong>ERC-20 token</strong> (e.g., <code>crLoan-XYZ</code>). These tokens will represent lenders' shares in this particular loan."
            ]
        },
        {
            title: "Lender Participation (Funding the Loan)",
            details: [
                "Lenders can browse available loan pools listed by the <code>CredoraPoolFactory</code>.",
                "They review the borrower's risk score, loan terms (amount, interest, duration), and purpose.",
                "If they choose to fund a loan, they send the <code>acceptedCurrency</code> (e.g., USDC) to the <code>CredoraLoanPool</code> contract.",
                "In return, they receive an equivalent amount of that pool's specific ERC-20 tokens, representing their stake in the loan."
            ]
        },
        {
            title: "Loan Activation",
            details: [
                "Once the total <code>loanAmountPrincipal</code> is raised from lenders, the <code>CredoraLoanPool</code> automatically transitions to an <code>Active</code> status.",
                "The pooled funds (e.g., USDC) are then available to be transferred to the borrower. <em>Note: The current implementation keeps funds in the pool to manage repayments directly.</em>"
            ]
        },
        {
            title: "Loan Repayment",
            details: [
                "The borrower repays the loan according to the agreed schedule (e.g., monthly installments or a lump sum).",
                "Repayments (principal + interest) are made in the <code>acceptedCurrency</code> directly to the <code>CredoraLoanPool</code> contract.",
                "The contract tracks installments paid, total principal repaid, and total interest repaid.",
                "Borrowers can make regular installment payments or repay the entire outstanding loan early."
            ]
        },
        {
            title: "Yield Distribution & Claiming",
            details: [
                "Once the loan is fully <code>Repaid</code> by the borrower, lenders who hold the pool's ERC-20 tokens can claim their share of the collected principal and interest.",
                "They do this by interacting with the <code>CredoraLoanPool</code> contract, which burns their pool tokens and transfers their proportional share of the repaid funds."
            ]
        },
        {
            title: "Handling Defaults or Cancellations",
            details: [
                "If a borrower fails to repay, an admin can mark the loan as <code>Defaulted</code>.",
                "If a loan doesn't get fully funded within a certain timeframe or needs to be stopped, an admin can <code>Cancel</code> it (if still in the <code>Funding</code> stage). Lenders can then withdraw their contributed funds."
            ]
        }
    ];

    // const listItemVariants = {
    //     hidden: { opacity: 0, x: -20 },
    //     visible: (i: number) => ({
    //         opacity: 1,
    //         x: 0,
    //         transition: {
    //             delay: i * 0.1,
    //             duration: 0.4,
    //         },
    //     }),
    // };

    return (
        <section
            className="mb-16"
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5, delay: 0.3 }}
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-12 text-neonGreen glow-text-neonGreen text-center">
                ✨ How Credora Works: A Step-by-Step Guide
            </h2>
            <div className="space-y-8">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="bg-gray-900/60 p-6 rounded-lg border border-neonRed/30 shadow-xl glow-container-neonRed hover:shadow-neonRed/50 transition-shadow duration-300"
                    // variants={listItemVariants}
                    // initial="hidden"
                    // whileInView="visible"
                    // viewport={{ once: true }}
                    // custom={index}
                    >
                        <h3 className="text-2xl font-orbitron mb-4 text-neonRed flex items-center">
                            <ChevronRight className="w-6 h-6 mr-2 text-neonRed" />
                            {`${index + 1}. ${step.title}`}
                        </h3>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-white/80">
                            {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} dangerouslySetInnerHTML={{ __html: detail }} />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorksSection; 