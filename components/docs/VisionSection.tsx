"use client";

import React from 'react';
import { Rocket, Users, Globe, Brain, TrendingUp } from 'lucide-react';

const VisionSection: React.FC = () => {
    const visionPoints = [
        {
            icon: <TrendingUp className="w-10 h-10 text-neonGreen" />,
            title: "Trust-Based, Not Collateral-Based",
            description: "Focusing on the borrower's potential, reliability, and data-driven insights rather than solely on their existing crypto wealth."
        },
        {
            icon: <Globe className="w-10 h-10 text-neonGreen" />,
            title: "Global and Inclusive Access",
            description: "Aiming to provide access to capital for individuals and businesses regardless of geographic location or traditional financial standing."
        },
        {
            icon: <Brain className="w-10 h-10 text-neonGreen" />,
            title: "AI-Enhanced & DeFi-Native",
            description: "Leveraging cutting-edge Artificial Intelligence for smarter risk assessment and building on the transparent, efficient rails of Decentralized Finance."
        }
    ];



    return (
        <section
            className="my-16 py-16 bg-black"
           
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-12 text-neonRed glow-text-neonRed text-center">
                    <Rocket className="inline-block w-10 h-10 mr-3" /> Our Vision for the Future of Credit
                </h2>

                <p className="text-xl text-white/85 mb-16 text-center max-w-4xl mx-auto leading-relaxed">
                    Credora is more than just a lending protocol; it&apos;s a movement towards a new paradigm of credit infrastructure. We believe in a future where financial access is determined by verifiable trustworthiness and potential, not by outdated or exclusionary systems.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {visionPoints.map((point, index) => (
                        <div
                            key={index}
                            className="bg-gray-900/70 p-8 rounded-xl border-2 border-neonGreen/50 shadow-xl hover:shadow-neonGreen/40 transition-all duration-300 transform hover:-translate-y-2 glow-container-neonGreen flex flex-col items-center text-center"
                         
                        >
                            <div className="p-4 bg-neonGreen/10 rounded-full mb-6 inline-block">
                                {point.icon}
                            </div>
                            <h3 className="text-2xl font-orbitron mb-4 text-neonGreen">{point.title}</h3>
                            <p className="text-white/80 leading-relaxed flex-grow">{point.description}</p>
                        </div>
                    ))}
                </div>

                <blockquote
                    className="mt-20 p-8 border-l-4 border-neonRed bg-gray-900/50 rounded-r-lg shadow-2xl glow-container-neonRed-subtle max-w-3xl mx-auto"
                    
                >
                    <p className="text-2xl italic text-white/90 font-spaceGrotesk leading-relaxed">
                        &quot;If you&apos;re trustworthy and verifiable, you should have access to capital — no matter who you are or where you&apos;re from.&quot;
                    </p>
                    <footer className="mt-4 text-right text-neonRed font-orbitron">
                        - The Credora Team
                    </footer>
                </blockquote>

            </div>
        </section>
    );
};

export default VisionSection; 