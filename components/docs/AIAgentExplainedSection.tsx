"use client";

import React from 'react';
// import { motion } from 'framer-motion';
import { BrainCircuit, Database, SearchCode, ShieldAlert, ListTodo, MessageSquareHeart, UserCheck, BotMessageSquare } from 'lucide-react';

const AIAgentExplainedSection: React.FC = () => {
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
    //             delay: 0.2
    //         }
    //     }
    // };

    return (
        <section
            className="mb-16"
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5, delay: 0.6 }}
        >
            <div
                className="p-6 md:p-8 rounded-xl border border-neonRed/50 bg-gray-900/70 shadow-2xl glow-container-neonRed-md hover:shadow-neonRed/70 transition-shadow duration-300"
            // initial="offscreen"
            // whileInView="onscreen"
            // viewport={{ once: true, amount: 0.1 }}
            // variants={cardVariants}
            >
                <div className="flex items-center mb-6">
                    <BrainCircuit className="w-10 h-10 sm:w-12 sm:h-12 text-neonRed mr-4" />
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron text-neonRed glow-text-neonRed">
                        🤖 The Unified Credora AI Agent
                    </h2>
                </div>

                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                    The <code>unifiedCredoraAgent.ts</code> represents the sophisticated AI brain powering user interactions and autonomous decision-making within the Credora ecosystem. Built using the Mastra framework, this agent is designed to be a highly autonomous financial assistant, acting as a conservative and skeptical credit officer. Its primary directive is to safeguard the protocol by making data-driven, risk-averse decisions.
                </p>

                <div className="my-8 p-4 border border-dashed border-neonGreen/50 rounded-lg bg-black/30">
                    <p className="text-neonGreen font-semibold text-md">
                        <strong className='font-orbitron'>Core Operating Principle:</strong> To act as an ultra-conservative credit officer, prioritizing protocol integrity and risk management above all else. It starts with a presumption of loan denial and requires overwhelming evidence of creditworthiness.
                    </p>
                </div>

                <h3 className="text-2xl font-orbitron text-neonGreen mb-6 mt-8">Key Characteristics & Capabilities:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="bg-black/30 p-4 rounded-lg border border-neonGreen/30 glow-on-hover-subtle">
                        <UserCheck className="w-7 h-7 text-neonGreen mb-2" />
                        <h4 className="text-xl font-orbitron text-neonRed mb-2">Autonomous Decision Maker</h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                            The agent independently establishes borrower risk profiles based on objective assessment, not user requests. This ensures impartiality and protects the protocol.
                        </p>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg border border-neonGreen/30 glow-on-hover-subtle">
                        <MessageSquareHeart className="w-7 h-7 text-neonGreen mb-2" />
                        <h4 className="text-xl font-orbitron text-neonRed mb-2">Structured Interaction Protocol</h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Follows a strict initial interaction flow: greets with skepticism, demands wallet address, fetches user context (<code>getUserContextTool</code>), and critically checks for an existing risk profile before proceeding.
                        </p>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg border border-neonGreen/30 glow-on-hover-subtle">
                        <Database className="w-7 h-7 text-neonGreen mb-2" />
                        <h4 className="text-xl font-orbitron text-neonRed mb-2">Context Management & Memory</h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Utilizes Mastra&apos;s memory capabilities (Upstash Store & Vector) to maintain conversation history, user context, and semantic recall. Refreshes context after significant actions.
                        </p>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg border border-neonGreen/30 glow-on-hover-subtle">
                        <ListTodo className="w-7 h-7 text-neonGreen mb-2" />
                        <h4 className="text-xl font-orbitron text-neonRed mb-2">Extensive Toolset</h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Equipped with a comprehensive suite of tools to interact with the Credora smart contracts (Factory & Pool getters/setters) and perform external research (<code>tavilySearchTool</code>).
                        </p>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg border border-neonGreen/30 glow-on-hover-subtle">
                        <ShieldAlert className="w-7 h-7 text-neonGreen mb-2" />
                        <h4 className="text-xl font-orbitron text-neonRed mb-2">Enhanced Risk Profile Assessment</h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Employs a rigorous, multi-step process for risk assessment, including mandatory documentation gathering, aggressive due diligence (multiple web searches), ruthless risk evaluation with a negativity bias, and defensive decision-making.
                        </p>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg border border-neonGreen/30 glow-on-hover-subtle">
                        <SearchCode className="w-7 h-7 text-neonGreen mb-2" />
                        <h4 className="text-xl font-orbitron text-neonRed mb-2">Information Asymmetry Protocol</h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Actively works to mitigate information asymmetry by performing exhaustive due diligence, cross-referencing claims, and searching for negative information.
                        </p>
                    </div>
                </div>

                <h3 className="text-2xl font-orbitron text-neonGreen mb-6 mt-10">Agent&apos;s Persona & Communication:</h3>
                <div className="bg-black/50 p-6 rounded-lg border border-neonGreen/40 shadow-inner glow-container-neonGreen-inner">
                    <BotMessageSquare className="w-8 h-8 text-neonGreen mb-3" />
                    <p className="text-white/80 mb-3 leading-relaxed">
                        The agent is instructed to maintain a formal, professional, and brutally direct tone. It avoids apologies for its conservative standards and frames rejections as necessary measures to protect the protocol. Communication is precise, quantitative, and uses technical financial terminology suitable for sophisticated users. The overall style aims for a futuristic UI feel that signals institutional rigor.
                    </p>
                    <p className="text-white/80 font-semibold leading-relaxed">
                        Its responses are not just informative but are designed to manage expectations and reinforce the protocol&apos;s commitment to stringent risk management.
                    </p>
                </div>

                <div className="mt-10 p-4 border border-neonRed/30 rounded-lg bg-black/20 glow-on-hover-subtle">
                    <p className="text-sm text-neonRed/80">
                        <strong className="font-orbitron text-neonRed">Underlying Technology:</strong> The agent leverages Google&apos;s Gemini Pro model via AI SDK and Mastra&apos;s core agent functionalities, memory management with Upstash, and fastembed for embeddings. This provides a robust foundation for its complex reasoning and interaction capabilities.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default AIAgentExplainedSection; 