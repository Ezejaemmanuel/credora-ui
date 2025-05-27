"use client";

import { NextPage } from "next";
import { motion } from "framer-motion";
import React from "react";

import IntroductionSection from "@/components/docs/IntroductionSection";
import WhoIsCredoraForSection from "@/components/docs/WhoIsCredoraForSection";
import HowItWorksSection from "@/components/docs/HowItWorksSection";
import CoreFeaturesSection from "@/components/docs/CoreFeaturesSection";
import SmartContractsExplainedSection from "@/components/docs/SmartContractsExplainedSection";
import AIAgentExplainedSection from "@/components/docs/AIAgentExplainedSection";
import KeyTermsSection from "@/components/docs/KeyTermsSection";
import FutureFeaturesSection from "@/components/docs/FutureFeaturesSection";
import UseCaseSection from "@/components/docs/UseCaseSection";
import VisionSection from "@/components/docs/VisionSection";

const DocsPage: NextPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black text-white max-w-5xl mx-auto font-spaceGrotesk"
        >
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <IntroductionSection />
                <hr className="border-neonGreen/30 my-12 sm:my-16" />
                <WhoIsCredoraForSection />
                <hr className="border-neonRed/30 my-12 sm:my-16" />
                <HowItWorksSection />
                <hr className="border-neonGreen/30 my-12 sm:my-16" />
                <CoreFeaturesSection />
                <hr className="border-neonRed/30 my-12 sm:my-16" />

                {/* Technical Deep Dive Section */}
                <div className="my-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-orbitron mb-12 text-neonGreen glow-text-neonGreen text-center border-b-2 border-neonGreen/50 pb-4">
                        Technical Deep Dive
                    </h1>
                    <p className="text-xl text-white/80 mb-12 text-center max-w-3xl mx-auto">
                        Explore the technical architecture of Credora, from our smart contracts to the AI agent that orchestrates the protocol.
                    </p>
                    <SmartContractsExplainedSection />
                    <hr className="border-neonGreen/30 my-12 sm:my-16" />
                    <AIAgentExplainedSection />
                </div>

                <hr className="border-neonRed/30 my-12 sm:my-16" />
                <KeyTermsSection />
                <hr className="border-neonGreen/30 my-12 sm:my-16" />
                <FutureFeaturesSection />
                <hr className="border-neonRed/30 my-12 sm:my-16" />
                <UseCaseSection />
                <hr className="border-neonGreen/30 my-12 sm:my-16" />
                <VisionSection />

            </div>
        </motion.div>
    );
};

export default DocsPage;