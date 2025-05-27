"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { TerminalSquare, Settings2, Users2, ListChecks, UserCog, BarChartHorizontal } from 'lucide-react';

const CredoraPoolFactoryExplained: React.FC = () => {
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
    //             duration: 0.8
    //         }
    //     }
    // };

    return (
        <div
            className="p-6 md:p-8 rounded-xl border border-neonGreen/50 bg-gray-900/70 shadow-2xl glow-container-neonGreen-md hover:shadow-neonGreen/70 transition-shadow duration-300"
        // initial="offscreen"
        // whileInView="onscreen"
        // viewport={{ once: true, amount: 0.2 }}
        // variants={cardVariants}
        >
            <div className="flex items-center mb-6">
                <TerminalSquare className="w-10 h-10 sm:w-12 sm:h-12 text-neonGreen mr-4" />
                <h3 className="text-2xl sm:text-3xl font-orbitron text-neonGreen glow-text-neonGreen">
                    1. CredoraPoolFactory.sol
                </h3>
            </div>

            <p className="text-lg text-white/90 mb-4 leading-relaxed">
                The <code>CredoraPoolFactory.sol</code> contract serves as the central nervous system for creating and managing individual loan pools within the Credora protocol. It doesn&apos;t directly handle loan mechanics but is responsible for the lifecycle of loan pool instances and for storing AI-assessed borrower risk profiles.
            </p>

            <div className="my-6 p-4 border border-dashed border-neonRed/50 rounded-lg bg-black/30">
                <p className="text-neonRed font-semibold text-md">
                    <strong className='font-orbitron'>Core Purpose:</strong> Master factory for deploying and tracking loan pools, and a registry for borrower creditworthiness.
                </p>
            </div>

            <h4 className="text-xl font-orbitron text-neonRed mb-4 mt-6">Key Responsibilities & Features:</h4>
            <ul className="space-y-3 list-inside list-image-[url(/assets/bullet-neon-green.svg)] text-white/80">
                <li>
                    <Settings2 className="inline-block w-5 h-5 mr-2 text-neonGreen" />
                    <strong>Storing Risk Profiles:</strong> Authorized AI entities (<code>AI_ROLE</code>) submit borrower risk assessments, including maximum loan amounts and suggested interest rates. These profiles are stored on-chain, forming a transparent basis for loan eligibility.
                </li>
                <li>
                    <Users2 className="inline-block w-5 h-5 mr-2 text-neonGreen" />
                    <strong>Creating Loan Pools (Cloning):</strong> Accounts with <code>POOL_CREATOR_ROLE</code> can initiate the creation of new <code>CredoraLoanPool</code> contracts. These are deployed as minimal proxies (clones) of a master implementation, ensuring gas efficiency and upgradability. Each new pool is tailored to a specific borrower based on their approved risk profile and the requested loan terms.
                </li>
                <li>
                    <ListChecks className="inline-block w-5 h-5 mr-2 text-neonGreen" />
                    <strong>Tracking Loan Pools:</strong> The factory maintains a comprehensive registry of all loan pools ever created, allowing for easy discovery and auditing. It maps pools to their respective borrowers.
                </li>
                <li>
                    <UserCog className="inline-block w-5 h-5 mr-2 text-neonGreen" />
                    <strong>User-Centric Data Retrieval:</strong> Offers functions like <code>getUserComprehensiveDetails</code> to fetch a holistic view of a user&apos;s interactions with the protocol, including their risk profile, loans they&apos;ve borrowed, and loans they&apos;ve funded. This is crucial for frontend applications and user dashboards.
                </li>
                <li>
                    <BarChartHorizontal className="inline-block w-5 h-5 mr-2 text-neonGreen" />
                    <strong>Platform Financial Overview:</strong> The <code>getFactoryFinancialSnapshot</code> function provides aggregated data about the platform&apos;s health, such as the total number of active loans, funds currently in funding pools, and total capital repaid, offering a macro view of protocol activity.
                </li>
            </ul>

            <h4 className="text-xl font-orbitron text-neonRed mb-4 mt-8">Operational Flow:</h4>
            <p className="text-white/80 mb-3 leading-relaxed">
                Typically, the process starts with an AI oracle evaluating a potential borrower off-chain. This assessment is then submitted to the <code>CredoraPoolFactory</code> via <code>setRiskProfile</code>. Once a risk profile is established, a pool creator (which could be an admin or even the borrower, if permissions allow) can call <code>createLoanPool</code>. This function instantiates a new <code>CredoraLoanPool</code> clone, initializes it with the borrower&apos;s data, loan terms, and the factory&apos;s pre-defined <code>acceptedCurrency</code> (e.g., USDC), and records the new pool&apos;s address.
            </p>
            <p className="text-white/80 leading-relaxed">
                This factory pattern is central to Credora&apos;s architecture, enabling scalability and maintaining a clear separation of concerns between the creation of loan opportunities and their individual management.
            </p>

            <div className="mt-8 p-4 border border-neonGreen/30 rounded-lg bg-black/20 glow-on-hover-subtle">
                <p className="text-sm text-neonGreen/80">
                    <strong className="font-orbitron text-neonGreen">Developer Note:</strong> The factory uses OpenZeppelin&apos;s Clones library for efficient deployment of loan pools. The <code>loanPoolImplementation</code> address, set at deployment, points to the logic contract that all pool instances will delegate to.
                </p>
            </div>

        </div>
    );
};

export default CredoraPoolFactoryExplained; 