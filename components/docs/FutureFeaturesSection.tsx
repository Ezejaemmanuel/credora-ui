"use client";

import React from 'react';
import { IdCard, Network, BarChartBig, CornerDownLeft, Clock, Tag, Lightbulb } from 'lucide-react';

const FutureFeaturesSection: React.FC = () => {
    const features = [
        {
            icon: <IdCard className="w-8 h-8 text-neonGreen" />,
            title: "Decentralized Identity (DID) + KYC",
            description: "Borrowers will be able to link their wallet to a decentralized identity (DID) for verified identity (individual or business) using zero-knowledge proofs to protect privacy, increasing trust and reducing fraud. Integration with providers like Polygon ID, Fractal, or Lit Protocol. Full KYC/KYB flow will be added for regulatory-compliant markets."
        },
        {
            icon: <Network className="w-8 h-8 text-neonGreen" />,
            title: "On-Chain Reputation Profiles",
            description: "Borrowers can build on-chain credit profiles over time, including reputation NFTs (e.g., \"On-Time Repayer\"), loan history, repayment streaks, and integration with other protocols (Gitcoin, Lens, etc.). This helps establish trust without collateral."
        },
        {
            icon: <BarChartBig className="w-8 h-8 text-neonGreen" />,
            title: "Protocol Fees & Treasury",
            description: "Implementation of a protocol fee (a small percentage of interest paid by borrowers) within <code>CredoraLoanPool.sol</code>. Establishment of a treasury contract and governance process for managing collected fees for development, audits, or incentives."
        },
        {
            icon: <CornerDownLeft className="w-8 h-8 text-neonGreen" />,
            title: "Fund Management on Cancellation/Default",
            description: "Enhanced fund return processes on cancellation (<code>withdrawCancelledFunds</code>), potentially with automated triggers. Clearer mechanisms for managing defaulted loans, such as secondary markets for defaulted debt or partial claims if funds are recoverable."
        },
        {
            icon: <Clock className="w-8 h-8 text-neonGreen" />,
            title: "Grace Periods & Late Fees",
            description: "For installment-based loans in <code>CredoraLoanPool.sol</code>, adding logic for grace periods for repayments and a system for applying late fees, providing flexibility for borrowers and compensation for lenders."
        },
        {
            icon: <Tag className="w-8 h-8 text-neonGreen" />,
            title: "Enhanced Loan Purpose Tracking",
            description: "While a <code>purpose</code> field is stored, further integration or categorization of this data could provide better analytics and filtering options for lenders."
        }
    ];



    return (
        <section
            className="my-16"
       
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-12 text-neonGreen glow-text-neonGreen text-center">
                <Lightbulb className="inline-block w-10 h-10 mr-3" /> Additional Features (Post-Hackathon)
            </h2>
            <p className="text-lg text-white/80 mb-10 text-center max-w-3xl mx-auto">
                Credora is an evolving platform. The following are advanced features planned to further enhance risk management, compliance, and overall credibility. These are envisioned for implementation after the core MVP is robust and operational.
            </p>
            <div className="space-y-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-gray-900/60 p-6 rounded-lg border border-neonRed/40 shadow-xl hover:shadow-neonRed/25 transition-shadow duration-300 glow-container-neonRed"
                    >
                        <div className="flex items-start">
                            <span className="p-2 bg-neonRed/10 rounded-full mr-4 mt-1">{feature.icon}</span>
                            <div>
                                <h3 className="text-2xl font-orbitron mb-3 text-neonRed">{feature.title}</h3>
                                <p className="text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: feature.description }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FutureFeaturesSection; 