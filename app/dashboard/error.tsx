'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <motion.div
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black p-6 font-orbitron text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-neonRed bg-neonRed/10 shadow-neon-red-strong"
                variants={itemVariants}
            >
                <AlertTriangle className="h-10 w-10 text-neonRed" />
            </motion.div>

            <motion.h1
                className="mb-3 text-center text-3xl font-semibold text-neonRed md:text-4xl glow-text-neonRed"
                variants={itemVariants}
            >
                SYSTEM ERROR
            </motion.h1>

            <motion.p
                className="mb-2 max-w-lg text-center text-white/80 md:text-lg"
                variants={itemVariants}
            >
                A critical malfunction has occurred within the system.
            </motion.p>

            {error?.message && (
                <motion.p
                    className="mb-6 max-w-lg text-center text-sm text-neonRed/70 font-spaceGrotesk"
                    variants={itemVariants}
                >
                    ERROR CODE: {error.message}
                    {error.digest && ` (Digest: ${error.digest})`}
                </motion.p>
            )}

            <motion.div variants={itemVariants}>
                <Button
                    onClick={() => reset()}
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neonRed px-6 font-orbitron text-lg text-black shadow-md transition-all duration-300 hover:bg-neonRed/80 hover:shadow-neon-red focus:outline-none focus:ring-2 focus:ring-neonRed focus:ring-offset-2 focus:ring-offset-black"
                >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_50%_50%,#FF3131_0%,#000000_50%,#FF3131_100%)]" />
                    <span className="inline-flex items-center">
                        <RotateCcw className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-[360deg]" />
                        REINITIALIZE SYSTEM
                    </span>
                </Button>
            </motion.div>

            <motion.p
                className="mt-8 max-w-md text-center text-xs text-white/60 font-spaceGrotesk"
                variants={itemVariants}
            >
                If the problem persists, please contact technical support or consult the system diagnostics.
            </motion.p>

            {/* Optional: Background glitch/static effect */}
            <div className="absolute inset-0 z-[-1] overflow-hidden opacity-20">
                <motion.div
                    className="absolute inset-0 animate-[glitch_0.5s_steps(1)_infinite] bg-black"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cfilter id=\'n\' x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.02\' numOctaves=\'1\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.2\'/%3E%3C/svg%3E")',
                    }}
                />
            </div>
            <style jsx global>{`
        @keyframes glitch {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-2px, 2px); }
          20% { transform: translate(2px, -2px); }
          30% { transform: translate(-2px, -2px); }
          40% { transform: translate(2px, 2px); }
          50% { transform: translate(0,0); }
          60% { transform: translate(3px, -1px); }
          70% { transform: translate(-1px, 3px); }
          80% { transform: translate(-3px, 1px); }
          90% { transform: translate(1px, -3px); }
          100% { transform: translate(0,0); }
        }
        .glow-text-neonRed { text-shadow: 0 0 8px theme('colors.neonRed'); }
        .shadow-neon-red { box-shadow: 0 0 15px 2px rgba(255,49,49,0.7); }
        .shadow-neon-red-strong { box-shadow: 0 0 25px 5px rgba(255,49,49,0.4); }
      `}</style>
        </motion.div>
    );
} 