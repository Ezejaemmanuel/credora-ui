"use client";

import { motion } from "framer-motion";
import { DatabaseZap, ServerOff } from "lucide-react";

const NoDataDisplay = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                className="relative p-8 bg-black border-2 border-neonGreen rounded-xl shadow-2xl shadow-neonGreen/30 max-w-md w-full transform-gpu"
            >
                <div className="absolute -top-5 -left-5 w-16 h-16 bg-neonGreen rounded-full flex items-center justify-center animate-pulse">
                    <DatabaseZap className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-4xl font-orbitron text-neonGreen mb-6 flex items-center justify-center">
                    <ServerOff className="w-10 h-10 mr-3" />
                    Data Stream Offline
                </h2>
                <p className="text-lg text-neutral-300 mb-6 font-spaceGrotesk">
                    The Credora Real-Time Data Feed is currently silent. No new factory data is available at this moment.
                </p>
                <p className="text-md text-neutral-400 font-spaceGrotesk">
                    This may be a temporary state while the network recalibrates. The system remains operational, awaiting incoming data transmissions.
                </p>
                <div className="mt-8 border-t border-neonGreen/30 pt-6">
                    <p className="text-sm text-neonGreen/80 font-shareTechMono">
                        SYSTEM STATUS: <span className="text-neonGreen">AWAITING DATA</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default NoDataDisplay; 