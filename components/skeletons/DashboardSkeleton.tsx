'use client';

import { motion } from 'framer-motion';

const SkeletonItem = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
    return (
        <motion.div
            className={`relative overflow-hidden bg-black/40 border-2 border-neonGreen/30 rounded-xl shadow-[0_0_15px_2px_rgba(0,255,0,0.2),_inset_0_0_8px_rgba(0,255,0,0.1)] ${className}`}
            animate={{
                borderColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(0, 255, 0, 0.5)',
                    'rgba(0, 255, 0, 0.2)',
                ],
                boxShadow: [
                    '0 0 15px 2px rgba(0,255,0,0.1), inset 0 0 6px rgba(0,255,0,0.1)',
                    '0 0 25px 5px rgba(0,255,0,0.25), inset 0 0 10px rgba(0,255,0,0.2)',
                    '0 0 15px 2px rgba(0,255,0,0.1), inset 0 0 6px rgba(0,255,0,0.1)',
                ]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {/* Subtle animated gradient for shimmer/scanline effect */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: 'linear-gradient(110deg, transparent 20%, rgba(0,255,0,0.05) 45%, rgba(0,255,0,0.15) 50%, rgba(0,255,0,0.05) 55%, transparent 80%)',
                    backgroundSize: '300% 100%',
                }}
                animate={{ backgroundPositionX: ['150%', '-150%'] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            {children}
        </motion.div>
    );
};

const DashboardSkeleton = () => {
    // const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false; // Basic check for mobile - REMOVED

    return (
        <div className="min-h-screen bg-black text-white box-border">
            {/* Pseudo Header Skeleton */}
            <div className="fixed top-0 left-0 right-0 h-[60px] sm:h-[68px] bg-black border-b border-neonGreen/30 z-[51] px-4 sm:px-6">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    <SkeletonItem className="h-8 w-24 rounded-md !border-none !shadow-none bg-neonGreen/20" /> {/* Logo area */}
                    <div className="hidden md:flex space-x-4">
                        <SkeletonItem className="h-6 w-20 rounded-md !border-none !shadow-none bg-white/10" />
                        <SkeletonItem className="h-6 w-20 rounded-md !border-none !shadow-none bg-white/10" />
                        <SkeletonItem className="h-6 w-20 rounded-md !border-none !shadow-none bg-white/10" />
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <SkeletonItem className="hidden sm:block h-8 w-28 rounded-md !border-none !shadow-none bg-neonGreen/10" /> {/* Balance */}
                        <SkeletonItem className="h-8 w-32 rounded-md !border-none !shadow-none bg-neonGreen/20" /> {/* Connect Button */}
                        <SkeletonItem className="h-8 w-8 rounded-full !border-none !shadow-none bg-white/10" /> {/* Bell Icon */}
                        <SkeletonItem className="h-8 w-8 rounded-md md:hidden !border-none !shadow-none bg-white/10" /> {/* Mobile Menu Icon */}
                    </div>
                </div>
            </div>

            {/* Main Content Area with Padding for Fixed Header */}
            <div className="p-4 sm:p-6 pt-[76px] sm:pt-[84px]"> {/* Adjusted padding-top: header height + desired gap */}
                <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                    {/* Financial Stats Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <SkeletonItem className="h-32 sm:h-36 p-4">
                            <SkeletonItem className="h-6 w-3/4 mb-3 !border-none !shadow-none bg-neonGreen/20" />
                            <SkeletonItem className="h-10 w-1/2 !border-none !shadow-none bg-neonGreen/30" />
                        </SkeletonItem>
                        <SkeletonItem className="h-32 sm:h-36 p-4">
                            <SkeletonItem className="h-6 w-3/4 mb-3 !border-none !shadow-none bg-neonRed/20" />
                            <SkeletonItem className="h-10 w-1/2 !border-none !shadow-none bg-neonRed/30" />
                        </SkeletonItem>
                        <SkeletonItem className="h-32 sm:h-36 p-4 sm:col-span-2 lg:col-span-1">
                            <SkeletonItem className="h-6 w-3/4 mb-3 !border-none !shadow-none bg-neonGreen/20" />
                            <SkeletonItem className="h-10 w-1/2 !border-none !shadow-none bg-neonGreen/30" />
                        </SkeletonItem>
                    </div>

                    {/* Main Content Grid Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Left/Main Column */}
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <SkeletonItem className="h-72 sm:h-80" /> {/* AI Credit Score */}
                                <SkeletonItem className="h-72 sm:h-80" /> {/* My Active Engagements */}
                            </div>
                            <SkeletonItem className="h-56 sm:h-64" /> {/* Loan Pools Display */}
                            <SkeletonItem className="h-72 sm:h-80" /> {/* Portfolio Performance Chart */}
                        </div>

                        {/* Right Sidebar (AI Chat) - visible on larger screens */}
                        <div className="hidden lg:block lg:col-span-1">
                            {/* Adjusted sticky top to account for new padding: header height + gap for p-4/p-6 */}
                            <SkeletonItem className="h-[calc(100vh-140px)] sticky top-[calc(68px+1.5rem)] lg:top-[calc(68px+1.5rem)]" />
                        </div>
                    </div>
                    {/* AI Chat for mobile/tablet - shown at bottom */}
                    <div className="lg:hidden">
                        <SkeletonItem className="h-64 w-full mt-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton; 