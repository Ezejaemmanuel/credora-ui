"use client";

import { useAccount, useChainId } from "wagmi";
import { useState, useEffect, ReactNode } from "react";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { SUPPORTED_CHAIN_ID } from "@/constant";

import ConnectWalletStepContent from "./ConnectWalletStep";
import OnboardingProcessDetailsContent from "./OnboardingProcessDetails";
import SwitchNetworkStepContent from "./SwitchNetworkStep";

interface OnboardingFlowProps {
    children: ReactNode;
}

// Enum to manage which component/phase of onboarding is active
enum OnboardingDisplayPhase {
    SHOW_CONNECT_WALLET,
    SHOW_SWITCH_NETWORK,
    SHOW_PROCESS_DETAILS,
    ALL_COMPLETED,
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ children }) => {
    const [displayPhase, setDisplayPhase] = useState<OnboardingDisplayPhase>(OnboardingDisplayPhase.SHOW_CONNECT_WALLET);
    const [showOnboardingUI, setShowOnboardingUI] = useState(true);

    const { address: userAddress, isConnected, isConnecting } = useAccount();
    const chainId = useChainId();
    const { openChainModal } = useChainModal();

    useEffect(() => {
        if (isConnecting) {
            setDisplayPhase(OnboardingDisplayPhase.SHOW_CONNECT_WALLET);
            setShowOnboardingUI(true);
            return;
        }

        if (!isConnected || !userAddress) {
            setDisplayPhase(OnboardingDisplayPhase.SHOW_CONNECT_WALLET);
            setShowOnboardingUI(true);
        } else {
            const isValidAddressFormat = typeof userAddress === 'string' && userAddress.startsWith('0x') && userAddress.length === 42;
            if (!isValidAddressFormat) {
                setDisplayPhase(OnboardingDisplayPhase.SHOW_CONNECT_WALLET);
                setShowOnboardingUI(true);
            } else if (chainId !== SUPPORTED_CHAIN_ID) {
                setDisplayPhase(OnboardingDisplayPhase.SHOW_SWITCH_NETWORK);
                setShowOnboardingUI(true);
            } else {
                if (displayPhase === OnboardingDisplayPhase.SHOW_CONNECT_WALLET || displayPhase === OnboardingDisplayPhase.SHOW_SWITCH_NETWORK) {
                    setDisplayPhase(OnboardingDisplayPhase.SHOW_PROCESS_DETAILS);
                }
                // If already in process details or completed, setShowOnboardingUI will be handled by onComplete
            }
        }
    }, [isConnected, userAddress, chainId, displayPhase, isConnecting]);

    const handleOnboardingComplete = () => {
        setDisplayPhase(OnboardingDisplayPhase.ALL_COMPLETED);
        setShowOnboardingUI(false); // Hide the onboarding UI when completed
    };

    // If onboarding is fully completed and UI is meant to be hidden, render children directly
    if (displayPhase === OnboardingDisplayPhase.ALL_COMPLETED && !showOnboardingUI) {
        return <>{children}</>;
    }

    // Function to render the active onboarding step
    const renderActiveOnboardingStep = () => {
        switch (displayPhase) {
            case OnboardingDisplayPhase.SHOW_CONNECT_WALLET:
                return <ConnectWalletStepContent key="connectWalletContent" />;
            case OnboardingDisplayPhase.SHOW_SWITCH_NETWORK:
                return <SwitchNetworkStepContent key="switchNetworkContent" openChainModal={openChainModal} />;
            case OnboardingDisplayPhase.SHOW_PROCESS_DETAILS:
                if (typeof userAddress === 'string' && userAddress.startsWith('0x') && userAddress.length === 42 && chainId === SUPPORTED_CHAIN_ID) {
                    return (
                        <OnboardingProcessDetailsContent
                            key="processDetailsContent"
                            userAddress={userAddress}
                            onComplete={handleOnboardingComplete}
                        />
                    );
                }
                return <ConnectWalletStepContent key="connectWalletFallbackForProcessDetails" />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Conditionally render the onboarding UI as a non-modal component */}
            {showOnboardingUI && displayPhase !== OnboardingDisplayPhase.ALL_COMPLETED && (
                <div
                    key={displayPhase.toString()} // Key for React reconciliation
                    // Apply styles previously on CredenzaContent for similar appearance
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-2 border-neonGreen/70 shadow-[0_0_35px_7px_rgba(0,255,0,0.25)] text-white font-spaceGrotesk w-[90vw] max-w-lg rounded-xl p-0 z-50"
                >
                    {renderActiveOnboardingStep()}
                </div>
            )}

            {/* Render children in the background, visually obscured if onboarding UI is active */}
            <div className={showOnboardingUI && displayPhase !== OnboardingDisplayPhase.ALL_COMPLETED ? "opacity-10 blur-md transition-opacity duration-300" : "transition-opacity duration-300"}>
                {children}
            </div>
        </>
    );
};

export default OnboardingFlow;
