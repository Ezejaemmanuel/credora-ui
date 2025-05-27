
"use client";
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { TenstackProviders } from "./tenstack-provider";
import { config } from "@/lib/config";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
type Props = {
    children: React.ReactNode;
    cookie: string | null;
};

export default function Providers({ children, cookie }: Props) {
    const initialState = cookieToInitialState(config, cookie);

    return (
        <WagmiProvider config={config} initialState={initialState} >
            <TenstackProviders>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <RainbowKitProvider


                        theme={darkTheme({
                            accentColor: "#0E76FD",


                            accentColorForeground: "white",
                            borderRadius: "large",
                            fontStack: "system",
                            overlayBlur: "small",
                        })}
                    >
                        {children}
                    </RainbowKitProvider>
                </TooltipProvider>
            </TenstackProviders>
        </WagmiProvider>
    );
}