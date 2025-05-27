"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { Puzzle, Network, FileCode2 } from 'lucide-react';

const InterfacesExplained: React.FC = () => {
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
    //             delay: 0.4
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
                <Puzzle className="w-10 h-10 sm:w-12 sm:h-12 text-neonGreen mr-4" />
                <h3 className="text-2xl sm:text-3xl font-orbitron text-neonGreen glow-text-neonGreen">
                    5. Interfaces (e.g., ICredoraLoanPool.sol)
                </h3>
            </div>

            <p className="text-lg text-white/90 mb-4 leading-relaxed">
                Solidity interfaces, like <code>ICredoraLoanPool.sol</code>, are a critical part of smart contract development, acting as blueprints or contracts that define *how* different smart contracts can interact with each other. They specify the functions a contract makes available externally, including their names, parameters, and return types, but without providing the actual implementation (the code inside the functions).
            </p>

            <div className="my-6 p-4 border border-dashed border-neonRed/50 rounded-lg bg-black/30">
                <p className="text-neonRed font-semibold text-md">
                    <strong className='font-orbitron'>Core Purpose:</strong> To define a standard way for contracts to communicate, ensuring interoperability and decoupling implementations from their definitions.
                </p>
            </div>

            <h4 className="text-xl font-orbitron text-neonRed mb-4 mt-6">Key Aspects & Importance:</h4>
            <ul className="space-y-3 list-inside list-image-[url(/assets/bullet-neon-green.svg)] text-white/80">
                <li>
                    <FileCode2 className="inline-block w-5 h-5 mr-2 text-neonGreen" />
                    <strong>Function Signatures Only:</strong> Interfaces contain only the signatures of functions (<code>function name(parameters) external [view/pure] [returns (returnTypes)]</code>) and definitions of any public structs or enums that these functions use. There is no executable code within an interface.
                </li>
                <li>
                    <Network className="inline-block w-5 h-5 mr-2 text-neonGreen" />
                    <strong>Enabling Inter-Contract Communication:</strong> The <code>CredoraPoolFactory</code>, for example, needs to call functions on the <code>CredoraLoanPool</code> instances it creates (e.g., <code>initialize</code>, <code>getLoanPoolInfo</code>). By importing and using <code>ICredoraLoanPool</code>, the factory knows exactly how to make these calls, even though the pool instances are separate contracts.
                </li>
                <li>
                    <Puzzle className="inline-block w-5 h-5 mr-2 text-neonGreen" />
                    <strong>Decoupling and Modularity:</strong> Interfaces allow for a separation of concerns. The factory contract doesn&apos;t need to know the full internal workings of a loan pool, only the functions it can call. This makes the system more modular and easier to maintain or upgrade components independently.
                </li>
                <li>
                    <strong>Type Safety:</strong> Solidity uses interfaces to ensure type safety when one contract calls another. The compiler can check that the calling contract is using the correct function names, parameter types, and handling return values appropriately.
                </li>
                <li>
                    <strong>Defining Data Structures:</strong> Interfaces like <code>ICredoraLoanPool.sol</code> also define important data structures (structs like <code>FullLoanPoolInfo</code> and <code>LenderPoolInfo</code>) that are passed between contracts. This ensures that complex data is exchanged in a consistent and predictable format.
                </li>
            </ul>

            <h4 className="text-xl font-orbitron text-neonRed mb-4 mt-8">Example in Credora:</h4>
            <p className="text-white/80 mb-3 leading-relaxed">
                In the Credora system, <code>ICredoraLoanPool.sol</code> is crucial for the <code>CredoraPoolFactory</code>. When the factory creates a new loan pool clone, it receives an address. To interact with this new pool (e.g., to call its <code>initialize</code> function), the factory casts this address to the type <code>ICredoraLoanPool</code>. This tells the Solidity compiler, &quot;Treat the contract at this address as if it implements all the functions defined in <code>ICredoraLoanPool</code>.&quot; This allows the factory to safely and correctly call methods like <code>getLoanPoolInfo()</code> or <code>getLenderPoolInformation()</code> on any loan pool it manages.
            </p>

        </div>
    );
};

export default InterfacesExplained; 