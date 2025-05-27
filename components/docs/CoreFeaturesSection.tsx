"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { Zap, BarChart2, Layers, Settings, Shield, PlayCircle, Lock, Eye } from 'lucide-react';

const CoreFeaturesSection: React.FC = () => {
    const features = [
        {
            icon: <Zap className="w-8 h-8 text-neonGreen" />,
            title: "Undercollateralized Lending",
            description: "Borrowers can access loans without locking up significant crypto assets as collateral."
        },
        {
            icon: <BarChart2 className="w-8 h-8 text-neonGreen" />,
            title: "AI-Powered Risk Assessment",
            description: "An AI engine evaluates borrower risk, suggesting terms and loan amounts."
        },
        {
            icon: <Layers className="w-8 h-8 text-neonGreen" />,
            title: "Tokenized Loan Shares",
            description: "Each loan pool issues its own ERC-20 tokens to lenders, representing their share of the loan. These tokens can potentially be traded on secondary markets (future feature)."
        },
        {
            icon: <Settings className="w-8 h-8 text-neonGreen" />,
            title: "Dedicated Loan Pools",
            description: "Each loan is managed by its own smart contract instance, ensuring isolation and clarity."
        },
        {
            icon: <PlayCircle className="w-8 h-8 text-neonGreen" />,
            title: "Flexible Repayments",
            description: "Supports both periodic installments and full early loan repayments."
        },
        {
            icon: <Eye className="w-8 h-8 text-neonGreen" />,
            title: "On-Chain Transparency",
            description: "Loan terms, funding status, and repayment progress are recorded on the blockchain."
        },
        {
            icon: <Shield className="w-8 h-8 text-neonGreen" />,
            title: "Role-Based Access Control",
            description: "Specific actions like setting risk profiles or creating pools are restricted to authorized roles."
        },
        {
            icon: <Lock className="w-8 h-8 text-neonGreen" />,
            title: "Pausable Contracts",
            description: "Loan pool operations can be paused by administrators in emergencies."
        }
    ];

    // const featureVariants = {
    //     hidden: { opacity: 0, scale: 0.9 },
    //     visible: (i: number) => ({
    //         opacity: 1,
    //         scale: 1,
    //         transition: {
    //             delay: i * 0.1,
    //             duration: 0.4,
    //             type: "spring",
    //             stiffness: 100,
    //         },
    //     }),
    // };

    return (
        <section
            className="mb-16"
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5, delay: 0.4 }}
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-12 text-neonGreen glow-text-neonGreen text-center">
                🚀 Core Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-gray-900/70 p-6 rounded-lg border border-neonGreen/40 shadow-lg hover:shadow-neonGreen/50 transition-shadow duration-300 glow-container-neonGreen-subtle flex flex-col items-center text-center"
                    // variants={featureVariants}
                    // initial="hidden"
                    // whileInView="visible"
                    // viewport={{ once: true }}
                    // custom={index}
                    >
                        <div className="mb-4 p-3 bg-neonGreen/10 rounded-full inline-block">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-orbitron mb-3 text-neonRed">{feature.title}</h3>
                        <p className="text-white/80 text-sm flex-grow">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CoreFeaturesSection; 