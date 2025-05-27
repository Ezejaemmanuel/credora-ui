"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import CredoraLoanPoolExplained from './CredoraLoanPoolExplained';
import CredoraPoolFactoryExplained from './CredoraPoolFactoryExplained';
import InterfacesExplained from './InterfacesExplained';
import MockUSDCExplained from './MockUSDCExplained';
import RolesExplained from './RolesExplained';

const SmartContractsExplainedSection: React.FC = () => {
    return (
        <section
            className="mb-16"
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5, delay: 0.5 }}
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-12 text-neonGreen glow-text-neonGreen text-center">
                🧩 Smart Contracts: The Engine of Credora
            </h2>
            <p className="text-xl text-white/80 mb-10 text-center max-w-3xl mx-auto">
                Credora&apos;s core logic is orchestrated by a suite of sophisticated Solidity smart contracts.
                These contracts work in tandem to manage everything from risk assessment and loan creation
                to funding, repayment, and yield distribution. Below, we delve into the specifics of each key contract.
            </p>

            <div className="space-y-12">
                <CredoraPoolFactoryExplained />
                <CredoraLoanPoolExplained />
                <RolesExplained />
                <MockUSDCExplained />
                <InterfacesExplained />
            </div>
        </section>
    );
};

export default SmartContractsExplainedSection; 