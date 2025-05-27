"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus, Brain, UserCog, Gavel } from 'lucide-react';

const RolesExplained: React.FC = () => {
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
    //             delay: 0.1
    //         }
    //     }
    // };

    const roles = [
        {
            icon: <ShieldCheck className="w-7 h-7 text-neonGreen" />,
            name: "ADMIN_ROLE",
            description: "Possesses top-level control over the system. Can grant and revoke other roles, manage critical system parameters, and act as a final arbiter. Typically assigned to the deployer or a secure multi-signature wallet."
        },
        {
            icon: <Brain className="w-7 h-7 text-neonGreen" />,
            name: "AI_ROLE",
            description: "Authorized to submit borrower risk profiles (maximum loan amount, interest rate) to the <code>CredoraPoolFactory</code>. This role bridges the off-chain AI assessment with on-chain storage."
        },
        {
            icon: <UserPlus className="w-7 h-7 text-neonGreen" />,
            name: "POOL_CREATOR_ROLE",
            description: "Permitted to create new <code>CredoraLoanPool</code> instances through the <code>CredoraPoolFactory</code>. This role is essential for initiating new loan opportunities on the platform."
        },
        {
            icon: <Gavel className="w-7 h-7 text-neonGreen" />,
            name: "GOVERNANCE_ROLE",
            description: "Intended for future decentralized governance actions. This could include managing loan defaults, updating protocol parameters, or other community-driven decisions."
        },
        {
            icon: <UserCog className="w-7 h-7 text-neonGreen" />,
            name: "Pool-Specific Roles (within CredoraLoanPool)",
            description: "Each <code>CredoraLoanPool</code> also has its own <code>DEFAULT_ADMIN_ROLE</code> (usually the factory or a governance address), <code>MINTER_ROLE</code>, and <code>PAUSER_ROLE</code> to manage its specific operations like pausing the pool or minting shares (though minting is typically handled internally upon funding)."
        }
    ];

    return (
        <div
            className="p-6 md:p-8 rounded-xl border border-neonGreen/50 bg-gray-900/70 shadow-2xl glow-container-neonGreen-md hover:shadow-neonGreen/70 transition-shadow duration-300"
        // initial="offscreen"
        // whileInView="onscreen"
        // viewport={{ once: true, amount: 0.2 }}
        // variants={cardVariants}
        >
            <div className="flex items-center mb-6">
                <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-neonGreen mr-4" />
                <h3 className="text-2xl sm:text-3xl font-orbitron text-neonGreen glow-text-neonGreen">
                    3. Roles.sol & Access Control
                </h3>
            </div>

            <p className="text-lg text-white/90 mb-4 leading-relaxed">
                The <code>Roles.sol</code> contract, leveraging OpenZeppelin&apos;s robust <code>AccessControlEnumerable</code> contract, is fundamental to Credora&apos;s security and operational integrity. It defines and manages the various permissions within the system, ensuring that only authorized addresses can perform sensitive actions like setting risk profiles, creating loan pools, or pausing contracts.
            </p>

            <div className="my-6 p-4 border border-dashed border-neonRed/50 rounded-lg bg-black/30">
                <p className="text-neonRed font-semibold text-md">
                    <strong className='font-orbitron'>Core Purpose:</strong> To enforce a granular, role-based permissioning system across the Credora protocol, safeguarding critical functions.
                </p>
            </div>

            <h4 className="text-xl font-orbitron text-neonRed mb-6 mt-6">Key Roles Defined:</h4>
            <div className="space-y-6">
                {roles.map((role, index) => (
                    <div
                        key={index}
                        className="p-4 border border-neonRed/30 rounded-lg bg-black/40 shadow-lg glow-on-hover-subtle hover:shadow-neonRed/50 transition-shadow duration-300"
                    // initial={{ opacity: 0, x: -20 }}
                    // whileInView={{ opacity: 1, x: 0 }}
                    // viewport={{ once: true, amount: 0.5 }}
                    // transition={{ delay: index * 0.15, duration: 0.5 }}
                    >
                        <div className="flex items-start">
                            <span className="mr-3 mt-1 p-1.5 bg-neonRed/20 rounded-md">{role.icon}</span>
                            <div>
                                <h5 className="text-lg font-orbitron text-neonRed mb-1" dangerouslySetInnerHTML={{ __html: role.name }} />
                                <p className="text-sm text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: role.description }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="text-xl font-orbitron text-neonRed mb-4 mt-8">Functionality:</h4>
            <p className="text-white/80 leading-relaxed">
                <code>Roles.sol</code> (and by extension, contracts inheriting from it like <code>CredoraPoolFactory</code> and <code>CredoraLoanPool</code>) provides functions to grant, revoke, renounce, and check roles for any given account. It also includes modifiers (e.g., <code>onlyAdmin</code>, <code>onlyAI</code>, <code>onlyPoolCreator</code>) that are used to protect specific functions in other contracts, ensuring that only callers with the appropriate permissions can execute them. This hierarchical and enumerable access control is crucial for maintaining a secure and well-governed DeFi protocol.
            </p>

        </div>
    );
};

export default RolesExplained; 