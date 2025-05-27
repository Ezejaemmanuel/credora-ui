'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Menu, X } from "lucide-react";
import Link from "next/link";
import { CustomConnectButton } from "@/components/ui/CustomConnectButton";
import { useReadMockUsdcBalanceOf } from "@/generated";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { formatCompactNumber } from "@/lib/utils";

const DashboardHeader = () => {
  const [notifications] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address: userAddress, isConnected } = useAccount();
  const { data: balance, isLoading: isLoadingBalance } = useReadMockUsdcBalanceOf({
    args: [userAddress as `0x${string}`]
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinkClasses = "hover:text-neonGreen transition-colors py-2 md:py-0 text-sm sm:text-base";

  return (
    <motion.div
      className="bg-black border-b border-neonGreen/30 py-3 sm:py-4 px-4 sm:px-6 relative z-[200]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-neonGreen font-orbitron text-xl sm:text-2xl">Credora</h1>
        </Link>

        <nav className="hidden md:flex space-x-4 lg:space-x-6 font-orbitron text-white/70 items-center">
          <Link href="/dashboard" className={navLinkClasses}>Dashboard</Link>
          <Link href="/dashboard/markets" className={navLinkClasses}>Markets</Link>
          <Link href="/dashboard/portfolio" className={navLinkClasses}>Portfolio</Link>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden sm:flex items-center bg-black border border-neonGreen/20 rounded-md px-2 py-1 sm:px-3 sm:py-1.5">
            <div className="h-2 w-2 rounded-full bg-neonGreen mr-1.5 sm:mr-2 animate-pulse" />
            <span className="font-orbitron text-neonGreen text-xs sm:text-sm whitespace-nowrap">
              {formatCompactNumber(Number(formatUnits(balance ?? BigInt(0), 6)))} USDC
            </span>
          </div>

          <div className="flex-shrink-0">
            <CustomConnectButton />
          </div>

          <div className="relative">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white/80 hover:text-white cursor-pointer" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-neonRed flex items-center justify-center text-[8px] sm:text-[10px] leading-none font-sans">
                {notifications}
              </span>
            )}
          </div>

          <div className="md:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="text-white/80 hover:text-neonGreen transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-neonGreen/50"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.nav
          className="md:hidden mt-3 pt-3 border-t border-neonGreen/20 bg-black/95 absolute left-0 right-0 top-full shadow-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="flex flex-col space-y-2 px-4 pb-3 font-orbitron text-white/80">
            <div className="sm:hidden flex items-center justify-center bg-black/50 border border-neonGreen/20 rounded-md px-3 py-2 mb-2">
              <div className="h-2.5 w-2.5 rounded-full bg-neonGreen mr-2 animate-pulse" />
              <span className="font-orbitron text-neonGreen text-sm">
                {formatCompactNumber(Number(formatUnits(balance ?? BigInt(0), 6)))} USDC
              </span>
            </div>
            <Link href="/dashboard" className={`${navLinkClasses} block text-center`} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="/dashboard/markets" className={`${navLinkClasses} block text-center`} onClick={() => setIsMobileMenuOpen(false)}>Markets</Link>
            <Link href="/dashboard/portfolio" className={`${navLinkClasses} block text-center`} onClick={() => setIsMobileMenuOpen(false)}>Portfolio</Link>
          </div>
        </motion.nav>
      )}
    </motion.div>
  );
};

export default DashboardHeader;
