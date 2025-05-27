"use client";

import {
    useReadMockUsdcBalanceOf,
    useReadMockUsdcMaxMintPerCallScaled,
    useWriteMockUsdcMintTestTokens,
} from "@/generated";
import { useBalance, usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { formatUnits } from "viem";
import { toast } from "sonner";
import { assetChainTestnet } from "viem/chains";

interface OnboardingProcessDetailsContentProps {
    userAddress: string;
    onComplete: () => void;
}

enum InternalStep {
    CHECK_RWA,
    CHECK_USDC,
}

const OnboardingProcessDetailsContent: React.FC<OnboardingProcessDetailsContentProps> = ({ userAddress, onComplete }) => {
    const [currentInternalStep, setCurrentInternalStep] = useState<InternalStep>(InternalStep.CHECK_RWA);
    const publicClient = usePublicClient();
    const { data: MAX_USDC_MINT_AMOUNT_DATA, isLoading: isLoadingMaxUsdcMintAmount } = useReadMockUsdcMaxMintPerCallScaled();
    const { data: rwaBalanceData, isLoading: isLoadingRwaBalance } = useBalance({
        address: userAddress as `0x${string}`,
        query: {
            enabled: !!userAddress && currentInternalStep === InternalStep.CHECK_RWA,
            refetchInterval: 5000,
        }
    });
    const hasRwaTokens = rwaBalanceData && rwaBalanceData.value > BigInt(0);

    const { data: usdcBalanceData, isLoading: isLoadingUsdcBalance, refetch: refetchUsdcBalance } = useReadMockUsdcBalanceOf({
        args: [userAddress as `0x${string}`],
        query: {
            enabled: !!userAddress && currentInternalStep === InternalStep.CHECK_USDC,
            refetchInterval: 5000,
        }
    });
    const usdcBalance = usdcBalanceData ?? BigInt(0);
    const hasUsdc = usdcBalance > BigInt(0);

    const { writeContractAsync: mintUsdc, isPending: isMintingUsdc, error: mintError } = useWriteMockUsdcMintTestTokens();

    useEffect(() => {
        if (currentInternalStep === InternalStep.CHECK_RWA && hasRwaTokens) {
            setCurrentInternalStep(InternalStep.CHECK_USDC);
        } else if (currentInternalStep === InternalStep.CHECK_USDC && hasUsdc) {
            onComplete();
        }
    }, [hasRwaTokens, hasUsdc, currentInternalStep, onComplete]);

    const handleMintUsdc = async () => {
        if (!publicClient) {
            toast.error("Public client not available. Please try again.");
            return;
        }
        if (!MAX_USDC_MINT_AMOUNT_DATA) {
            toast.error("Max mint amount not available. Please try again.");
            return;
        }
        try {
            const tx = await toast.promise(mintUsdc({
                args: [userAddress as `0x${string}`, MAX_USDC_MINT_AMOUNT_DATA],
            }, {
                onSuccess: () => {
                    refetchUsdcBalance();
                }
            }), {
                loading: "Minting Test USDC...",
                success: "USDC Minting Initiated!",
                error: (err) => `Failed to mint USDC: ${(err as any)?.shortMessage || err.message}`
            });

            toast.promise(publicClient.waitForTransactionReceipt({ hash: tx as `0x${string}` }), {
                loading: "Waiting for transaction confirmation...",
                success: "Transaction confirmed! USDC minted.",
                error: "Transaction failed during confirmation."
            });
        } catch (e: any) {
            console.error("Minting error:", e);
        }
    };

    const renderCurrentStepView = () => {
        switch (currentInternalStep) {
            case InternalStep.CHECK_RWA:
                return (
                    <>
                        <div className="p-6 space-y-2">
                            <h2 className="font-orbitron text-2xl text-neonGreen glow-text-neonGreen">Step 2: Verify RWA Tokens</h2>
                            <p className="text-white/70">
                                We are checking your RWA (native token) balance on AssetChain Testnet.
                            </p>
                        </div>
                        <div className="px-6 py-8 flex flex-col items-center space-y-6">
                            {isLoadingRwaBalance && (
                                <div className="flex items-center space-x-2 text-neonGreen">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span>Checking RWA (native token) balance...</span>
                                </div>
                            )}
                            {!isLoadingRwaBalance && !hasRwaTokens && (
                                <>
                                    <p className="text-center text-neonRed">
                                        No RWA (native) tokens found in your wallet on Asset Chain Testnet (ID: {assetChainTestnet.id}).
                                    </p>
                                    <p className="text-white/80 text-center">
                                        Please acquire some from the faucet to proceed.
                                    </p>
                                    <a
                                        href="https://faucet.assetchain.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-black bg-neonGreen hover:bg-neonGreen/80 font-orbitron glow-button"
                                    >
                                        Go to RWA Faucet <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                    <p className="text-xs text-white/60 text-center mt-2">
                                        (We&apos;ll re-check your balance automatically.)
                                    </p>
                                </>
                            )}
                            {!isLoadingRwaBalance && hasRwaTokens && (
                                <div className="flex flex-col items-center space-y-3 text-neonGreen">
                                    <CheckCircle className="h-12 w-12" />
                                    <p className="text-lg font-semibold">RWA (Native) Tokens Detected!</p>
                                    <p className="text-sm text-white/80">Proceeding to check USDC...</p>
                                </div>
                            )}
                        </div>
                    </>
                );

            case InternalStep.CHECK_USDC:
                return (
                    <>
                        <div className="p-6 space-y-2">
                            <h2 className="font-orbitron text-2xl text-neonGreen glow-text-neonGreen">Step 3: Obtain Test USDC</h2>
                            <p className="text-white/70">
                                For testing, you can mint MockUSDC tokens if you don&apos;t have any.
                            </p>
                        </div>
                        <div className="px-6 py-8 flex flex-col items-center space-y-6">
                            {(isLoadingUsdcBalance && !isMintingUsdc && !isLoadingMaxUsdcMintAmount) && (
                                <div className="flex items-center space-x-2 text-neonGreen">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span>Checking MockUSDC balance...</span>
                                </div>
                            )}
                            {isMintingUsdc && !isLoadingMaxUsdcMintAmount && MAX_USDC_MINT_AMOUNT_DATA && (
                                <div className="flex items-center space-x-2 text-neonGreen">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span>Minting {formatUnits(MAX_USDC_MINT_AMOUNT_DATA, 6)} MockUSDC...</span>
                                </div>
                            )}
                            {!isLoadingUsdcBalance && !isMintingUsdc && !hasUsdc && !isLoadingMaxUsdcMintAmount && MAX_USDC_MINT_AMOUNT_DATA && (
                                <>
                                    <p className="text-center text-neonRed">
                                        You have 0 MockUSDC in your wallet.
                                    </p>
                                    <Button
                                        onClick={handleMintUsdc}
                                        disabled={isMintingUsdc || !userAddress}
                                        className="bg-neonGreen hover:bg-neonGreen/80 text-black font-orbitron glow-button disabled:opacity-50"
                                    >
                                        {isMintingUsdc ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                        )}
                                        Mint {formatUnits(MAX_USDC_MINT_AMOUNT_DATA, 6)} Test USDC
                                    </Button>
                                </>
                            )}
                            {!isLoadingUsdcBalance && !isMintingUsdc && hasUsdc && (
                                <div className="flex flex-col items-center space-y-3 text-neonGreen">
                                    <CheckCircle className="h-12 w-12" />
                                    <p className="text-lg font-semibold">MockUSDC Ready!</p>
                                    <p className="text-sm text-white/80">Balance: {formatUnits(usdcBalance, 6)} USDC</p>
                                    <p className="text-sm text-white/80">Finalizing onboarding...</p>
                                </div>
                            )}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {renderCurrentStepView()}
            {mintError && (
                <div className="p-4 mt-2 border-t border-neonRed/30 pt-3">
                    <div className="flex items-center space-x-2 text-neonRed text-sm p-3 bg-neonRed/10 rounded-md">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <p>{(mintError as any).shortMessage || mintError.message}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default OnboardingProcessDetailsContent; 