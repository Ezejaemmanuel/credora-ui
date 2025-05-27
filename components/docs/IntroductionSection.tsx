"use client";

import React from 'react';
// import { motion } from 'framer-motion';

const IntroductionSection: React.FC = () => {
    return (
        <section
            className="mb-16"
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron mb-8 text-neonGreen glow-text-neonGreen">
                🌐 Welcome to Credora
            </h2>
            <blockquote className="prose-blockquote">
                Credora is a decentralized lending protocol that lets users borrow crypto
                <strong>without needing collateral</strong>. It uses an AI-based credit
                scoring system and tokenized loan participation to give people and businesses
                access to capital based on their <strong>data and trustworthiness</strong>,
                not just their existing crypto wealth.
            </blockquote>
            <p className="mt-6 text-lg">
                In a financial landscape rapidly evolving with blockchain technology, Credora
                stands at the forefront, offering a novel approach to lending and borrowing.
                By leveraging the power of Artificial Intelligence and the transparency of
                decentralized systems, we aim to democratize access to capital, making it
                more inclusive and efficient.
            </p>
            <p className="mt-4 text-lg">
                This documentation will guide you through every aspect of Credora, from its
                core concepts and features to the technical intricacies of its smart contracts
                and the AI agent that powers its intelligence. Whether you are a potential borrower,
                a lender looking for yield, or a developer interested in our technology,
                you&apos;ll find valuable insights here.
            </p>
        </section>
    );
};

export default IntroductionSection; 