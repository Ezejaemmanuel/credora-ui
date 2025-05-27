"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { Coins, TestTube2, PackagePlus } from 'lucide-react';

const MockUSDCExplained: React.FC = () => {
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
    //             delay: 0.3
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
                <Coins className="w-10 h-10 sm:w-12 sm:h-12 text-neonRed mr-4" />
                <h3 className="text-2xl sm:text-3xl font-orbitron text-neonRed glow-text-neonRed">
                    4. MockUSDC.sol
                </h3>
            </div>

            <p className="text-lg text-white/90 mb-4 leading-relaxed">
                The <code>MockUSDC.sol</code> contract plays a crucial, albeit simple, role in the development and testing phases of the Credora protocol. It serves as a stand-in for the actual USDC (USD Coin) stablecoin.
            </p>

            <div className="my-6 p-4 border border-dashed border-neonGreen/50 rounded-lg bg-black/30">
                <p className="text-neonGreen font-semibold text-md">
                    <strong className='font-orbitron'>Core Purpose:</strong> To provide a test version of USDC, enabling developers and users to experiment with Credora&apos;s features without using real funds.
                </p>
            </div>

            <h4 className="text-xl font-orbitron text-neonGreen mb-4 mt-6">Key Features:</h4>
            <ul className="space-y-3 list-inside list-image-[url(/assets/bullet-neon-red.svg)] text-white/80">
                <li>
                    <TestTube2 className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>ERC-20 Standard with 6 Decimals:</strong> It fully implements the ERC-20 token standard and crucially, mirrors USDC&apos;s 6 decimal places. This ensures that calculations and interactions within the test environment accurately reflect how they would work with real USDC.
                </li>
                <li>
                    <PackagePlus className="inline-block w-5 h-5 mr-2 text-neonRed" />
                    <strong>Public <code>mintTestTokens</code> Function:</strong> This is the most distinctive feature for a mock token. It includes a publicly accessible function that allows *anyone* to mint a specified amount of MockUSDC to their wallet. This is vital for testers to easily acquire funds to participate in funding loan pools or simulating borrower repayments.
                </li>
            </ul>

            <h4 className="text-xl font-orbitron text-neonGreen mb-4 mt-8">Importance in Development:</h4>
            <p className="text-white/80 mb-3 leading-relaxed">
                Without <code>MockUSDC.sol</code>, testing the full flow of Credora would require using actual USDC, which is impractical and risky during development. This mock contract allows for:
            </p>
            <ul className="space-y-2 list-disc list-inside ml-4 text-white/80">
                <li>Thorough testing of all loan lifecycle stages.</li>
                <li>Simulation of various lending and borrowing scenarios.</li>
                <li>Easy onboarding for developers and testers to interact with the protocol on test networks.</li>
            </ul>

            <div className="mt-8 p-4 border border-neonRed/30 rounded-lg bg-black/20 glow-on-hover-subtle">
                <p className="text-sm text-neonRed/80">
                    <strong className="font-orbitron text-neonRed">Critical Distinction:</strong> The <code>mintTestTokens</code> function would <strong className="text-neonRed">NEVER</strong> exist in a contract interacting with real USDC in a live production environment. Its presence is solely for facilitating testing.
                </p>
            </div>

        </div>
    );
};

export default MockUSDCExplained; 