"use client";

import { motion } from "framer-motion";
import { AlertTriangle, XCircle } from "lucide-react";

interface ErrorDisplayProps {
    error: Error | null;
    onRetry?: () => void; // Optional retry callback
}

const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative p-8 bg-black border-2 border-neonRed rounded-xl shadow-2xl shadow-neonRed/30 max-w-lg w-full transform-gpu"
            >
                <div className="absolute -top-5 -left-5 w-16 h-16 bg-neonRed rounded-full flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-8 h-8 text-black" />
                </div>
                <div className="absolute top-4 right-4">
                    {/* Optional: Close button if this were a modal, for fullscreen error maybe not */}
                </div>
                <h2 className="text-4xl font-orbitron text-neonRed mb-6 flex items-center justify-center">
                    <XCircle className="w-10 h-10 mr-3" />
                    System Alert
                </h2>
                <p className="text-lg text-neutral-300 mb-6 font-spaceGrotesk">
                    A critical system error has occurred. Our AI diagnostics indicate an anomaly in the data stream or a core module failure.
                </p>
                {error?.message && (
                    <div className="mb-6">
                        <p className="text-sm text-neonRed/80 font-shareTechMono mb-2 text-left">Error Details:</p>
                        <pre className="bg-neutral-800/70 p-4 rounded-md text-neonRed text-xs sm:text-sm overflow-x-auto font-shareTechMono custom-scrollbar">
                            {error.message}
                        </pre>
                    </div>
                )}
                <p className="text-md text-neutral-400 mb-8 font-spaceGrotesk">
                    Please attempt to refresh the connection. If the issue persists, our technical team has been notified.
                </p>
                {onRetry && (
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 25px #FF3131" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRetry}
                        className="px-8 py-3 bg-neonRed text-black font-orbitron rounded-lg text-lg hover:bg-red-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-neonRed/50"
                    >
                        Retry Connection
                    </motion.button>
                )}
            </motion.div>
            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a2a2a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff3131;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e00000;
        }
      `}</style>
        </div>
    );
};

export default ErrorDisplay; 