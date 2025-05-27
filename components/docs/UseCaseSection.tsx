"use client";

import React from 'react';
import { Briefcase, Sun, Users, CheckSquare, BarChart, ShieldQuestion, Milestone, ShieldCheck } from 'lucide-react';

const UseCaseSection: React.FC = () => {
 
    return (
        <section
            className="my-16 py-12 bg-gradient-to-b from-gray-900/70 to-black/90"
        
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-12 text-neonGreen glow-text-neonGreen text-center">
                    <Milestone className="inline-block w-10 h-10 mr-3" /> Use Case Example: Empowering Growth
                </h2>

                <div
                    className="p-6 md:p-10 rounded-xl border border-neonRed/60 bg-black/50 shadow-2xl glow-container-neonRed-lg perspective-800"
                  
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
                        <Briefcase className="w-16 h-16 text-neonRed mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-orbitron text-neonRed mb-3">
                                Microbusiness Solar Expansion in Nairobi
                            </h3>
                            <p className="text-lg text-white/85 leading-relaxed">
                                Imagine a promising microbusiness in Nairobi that specializes in distributing and installing solar kits for local homes and small enterprises. They have a proven track record of sales and a positive impact on their community but lack the upfront capital to purchase a larger inventory of solar kits to meet growing demand.
                            </p>
                        </div>
                    </div>

                    <div className="my-8 p-4 border border-dashed border-neonGreen/40 rounded-lg bg-gray-900/30">
                        <p className="text-neonGreen font-semibold text-md text-center">
                            <strong className='font-orbitron'>The Challenge:</strong> Accessing $5,000 USDC for inventory without traditional collateral.
                        </p>
                    </div>

                    <h4 className="text-xl font-orbitron text-neonGreen mb-6 mt-8">Credora&apos;s Solution in Action:</h4>
                    <div className="space-y-6">
                        <div className="flex items-start p-4 bg-gray-800/40 rounded-lg border border-neonGreen/20 glow-on-hover-subtle">
                            <Sun className="w-7 h-7 text-neonGreen mr-4 mt-1 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-neonRed text-lg mb-1">1. AI-Powered Risk Assessment:</h5>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    The business submits basic financial information (e.g., past revenue statements, mobile money transaction history, supplier invoices) through a secure interface to Credora. Our AI engine analyzes this data, along with any available on-chain footprint, to generate a creditworthiness score, suggest an interest rate, and determine a maximum eligible loan amount.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start p-4 bg-gray-800/40 rounded-lg border border-neonGreen/20 glow-on-hover-subtle">
                            <Users className="w-7 h-7 text-neonGreen mr-4 mt-1 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-neonRed text-lg mb-1">2. Loan Pool Creation & Global Lender Participation:</h5>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    Based on the AI assessment, a dedicated <code>CredoraLoanPool</code> is created for the business&apos;s $5,000 USDC loan request (e.g., for a 6-month term). Lenders from anywhere in the world can browse this (and other) loan opportunities on the Credora platform. They review the transparent risk profile, loan purpose (solar kit inventory), and terms, then decide to contribute USDC to the pool, receiving tokenized shares of this specific loan in return.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start p-4 bg-gray-800/40 rounded-lg border border-neonGreen/20 glow-on-hover-subtle">
                            <CheckSquare className="w-7 h-7 text-neonGreen mr-4 mt-1 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-neonRed text-lg mb-1">3. Funding, Repayment, and Yield:</h5>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    Once fully funded, the loan becomes active. The Nairobi business receives the USDC, purchases the solar kits, expands its operations, and makes repayments (principal + interest) back to the loan pool over the 6-month period. As repayments come in, lenders holding the pool&apos;s tokens can claim their proportional share of the principal and earned interest.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h4 className="text-xl font-orbitron text-neonGreen mb-6 mt-10">Risk Mitigation without Traditional Collateral:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/60 p-4 rounded-lg border-2 border-neonRed/30 shadow-md">
                            <BarChart className="w-6 h-6 text-neonRed mb-2" />
                            <p className="text-white/80 text-sm leading-relaxed">Smart AI evaluation of the business&apos;s potential, past performance, and trustworthiness.</p>
                        </div>
                        <div className="bg-gray-800/60 p-4 rounded-lg border-2 border-neonRed/30 shadow-md">
                            <ShieldQuestion className="w-6 h-6 text-neonRed mb-2" />
                            <p className="text-white/80 text-sm leading-relaxed">Transparent on-chain tracking of all loan terms, funding progress, and repayment history.</p>
                        </div>
                        <div className="bg-gray-800/60 p-4 rounded-lg border-2 border-neonRed/30 shadow-md">
                            <Users className="w-6 h-6 text-neonRed mb-2" />
                            <p className="text-white/80 text-sm leading-relaxed">Risk is shared among multiple global lenders who receive tokenized shares (potential for future secondary markets).</p>
                        </div>
                        <div className="bg-gray-800/60 p-4 rounded-lg border-2 border-neonRed/30 shadow-md">
                            {/* Future icon: <Gavel className="w-6 h-6 text-neonRed mb-2" /> */}
                            <ShieldCheck className="w-6 h-6 text-neonRed mb-2" />
                            <p className="text-white/80 text-sm leading-relaxed">Potential for future community governance mechanisms to handle exceptions or defaults fairly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UseCaseSection; 