"use client";

import { CustomConnectButton } from "@/components/ui/CustomConnectButton";
import { assetChainTestnet } from "viem/chains";

// This component will now return the JSX for the content of a step,
// not the full CredenzaContent wrapper.

const ConnectWalletStepContent = () => {
    return (
        <>
            <div className="p-6 space-y-2">
                <h2 className="font-orbitron text-2xl text-neonGreen glow-text-neonGreen">Step 1: Connect Your Wallet</h2>
                <p className="text-white/70">
                    To begin your journey with Credora, please connect your secure wallet.
                </p>
            </div>
            <div className="px-6 py-8 flex flex-col items-center space-y-6">
                <p className="text-center text-white/90">
                    Ensure you are on the Asset Chain Testnet (ID: {assetChainTestnet.id}).
                </p>
                <CustomConnectButton />
            </div>
        </>
    );
};

export default ConnectWalletStepContent; 