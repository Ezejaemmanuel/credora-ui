"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Network } from "lucide-react";
import { SUPPORTED_CHAIN } from "@/constant"; // Import the supported chain details

interface SwitchNetworkStepContentProps {
    openChainModal: (() => void) | undefined;
}

const SwitchNetworkStepContent: React.FC<SwitchNetworkStepContentProps> = ({ openChainModal }) => {
    return (
        <>
            <div className="p-6 space-y-2">
                <h2 className="font-orbitron text-2xl text-neonRed glow-text-neonRed flex items-center">
                    <AlertTriangle className="mr-3 h-7 w-7" />
                    Network Mismatch
                </h2>
                <p className="text-white/80 pt-2">
                    Your wallet is connected to an unsupported network.
                </p>
            </div>
            <div className="px-6 py-6 flex flex-col items-center space-y-5">
                <p className="text-center text-white/90">
                    Please switch to the <strong className="text-neonGreen">{SUPPORTED_CHAIN.name}</strong> (ID: {SUPPORTED_CHAIN.id}) to continue.
                </p>
                {openChainModal ? (
                    <Button
                        onClick={openChainModal}
                        className="bg-neonGreen hover:bg-neonGreen/80 text-black font-orbitron glow-button flex items-center space-x-2"
                    >
                        <Network className="h-5 w-5" />
                        <span>Switch Network</span>
                    </Button>
                ) : (
                    <p className="text-center text-neonRed/80 text-sm">
                        Could not initialize network switching. Please try connecting your wallet again or switch networks manually in your wallet.
                    </p>
                )}
            </div>
            <div className="p-4 border-t border-neonGreen/20 pt-4">
                <p className="text-xs text-white/60 text-center">
                    Credora operates on the {SUPPORTED_CHAIN.name} for optimal performance and security during this phase.
                </p>
            </div>
        </>
    );
};

export default SwitchNetworkStepContent; 