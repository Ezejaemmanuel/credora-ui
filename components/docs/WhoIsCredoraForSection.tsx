"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { Users, Briefcase, Brain, ShieldCheck } from 'lucide-react';

const WhoIsCredoraForSection: React.FC = () => {
    // const cardVariants = {
    //     hidden: { opacity: 0, y: 20 },
    //     visible: (i: number) => ({
    //         opacity: 1,
    //         y: 0,
    //         transition: {
    //             delay: i * 0.2,
    //             duration: 0.5,
    //         },
    //     }),
    // };

    const items = [
        {
            icon: <Users className="w-10 h-10 mb-4 text-neonGreen" />,
            title: "Borrowers",
            description: "Individuals or businesses seeking access to capital (loans in cryptocurrency like USDC) without needing to provide traditional crypto collateral. They leverage their financial data and on-chain history to get a risk assessment.",
        },
        {
            icon: <Briefcase className="w-10 h-10 mb-4 text-neonGreen" />,
            title: "Lenders",
            description: "Individuals or entities looking to earn yield on their cryptocurrency by funding loans. They can browse different loan opportunities, assess the AI-generated risk scores, and decide where to allocate their capital.",
        },
        {
            icon: <Brain className="w-10 h-10 mb-4 text-neonGreen" />,
            title: "AI Providers/Oracles (Future)",
            description: "Entities responsible for running the AI models that assess borrower risk profiles. In the current version, this is a role managed by the platform administrators.",
        },
        {
            icon: <ShieldCheck className="w-10 h-10 mb-4 text-neonGreen" />,
            title: "Pool Creators/Platform Admins",
            description: "Entities with permissions to set up new loan pools based on AI risk assessments and manage the overall platform.",
        },
    ];

    return (
        <section
            className="mb-16"
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-12 text-neonGreen glow-text-neonGreen text-center">
                🎯 Who is Credora For?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-900/50 p-6 rounded-lg border border-neonGreen/30 shadow-lg glow-container-neonGreen hover:shadow-neonGreen/50 transition-shadow duration-300"
                    // variants={cardVariants}
                    // initial="hidden"
                    // whileInView="visible"
                    // viewport={{ once: true }}
                    // custom={index}
                    >
                        <div className="flex justify-center">{item.icon}</div>
                        <h3 className="text-2xl font-orbitron mb-3 text-neonRed text-center">{item.title}</h3>
                        <p className="text-white/80 text-center">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhoIsCredoraForSection; 