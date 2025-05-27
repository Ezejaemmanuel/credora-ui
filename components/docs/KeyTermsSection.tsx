"use client";

import React from 'react';
import { BookOpen, Code, Percent, Globe, Link2, DownloadCloud, DollarSign } from 'lucide-react';

const KeyTermsSection: React.FC = () => {
    const terms = [
        {
            icon: <Code className="w-6 h-6 text-neonGreen" />,
            term: "Smart Contract",
            definition: "A program that runs on the blockchain. They automatically execute the terms of an agreement, like the loan terms in Credora."
        },
        {
            icon: <Link2 className="w-6 h-6 text-neonGreen" />,
            term: "ERC-20 Token",
            definition: "A standard for creating tokens on the Ethereum blockchain (and compatible chains). USDC is an ERC-20 token, and so are the shares lenders receive in each CredoraLoanPool."
        },
        {
            icon: <Percent className="w-6 h-6 text-neonGreen" />,
            term: "Basis Points (BPS)",
            definition: "A unit of measure used in finance to describe a percentage. 100 BPS = 1%. So, an interest rate of 500 BPS is 5%."
        },
        {
            icon: <Globe className="w-6 h-6 text-neonGreen" />,
            term: "Decentralized Finance (DeFi)",
            definition: "Financial applications built on blockchain technology, aiming to be open, transparent, and accessible without traditional intermediaries."
        },
        {
            icon: <DownloadCloud className="w-6 h-6 text-neonGreen" />,
            term: "Collateral",
            definition: "An asset pledged by a borrower to a lender to secure a loan. If the borrower defaults, the lender can seize the collateral. Credora focuses on <em>undercollateralized</em> loans, meaning less or no direct collateral is required."
        },
        {
            icon: <DollarSign className="w-6 h-6 text-neonGreen" />,
            term: "Yield",
            definition: "The return earned on an investment, like the interest lenders receive for funding loans."
        },
        {
            icon: <Coins className="w-6 h-6 text-neonGreen" />,
            term: "USDC (USD Coin)",
            definition: "A type of cryptocurrency known as a stablecoin. It's designed to maintain a stable value, typically pegged 1:1 to the US dollar."
        }
    ].map(term => ({ ...term, id: Math.random().toString(36).substring(7) })); // Add unique id for key prop

 
    return (
        <section
            className="my-16"
          
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-12 text-neonGreen glow-text-neonGreen text-center">
                <BookOpen className="inline-block w-10 h-10 mr-3" /> Key Terms Explained
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {terms.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-900/50 p-6 rounded-lg border border-neonRed/30 shadow-lg hover:shadow-neonRed/20 transition-shadow duration-300 glow-container-neonRed-subtle"
                    >
                        <div className="flex items-center mb-3">
                            {item.icon}
                            <h3 className="text-xl font-orbitron ml-3 text-neonRed">{item.term}</h3>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.definition }} />
                    </div>
                ))}
            </div>
        </section>
    );
};

// Dummy Coins icon for the last item if not imported elsewhere, or ensure lucide-react is fully imported.
const Coins: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        <path d="M7 6h1v4" />
        <path d="m16.71 13.88.7.71-2.82 2.82-.71-.71" />
    </svg>
);

export default KeyTermsSection; 