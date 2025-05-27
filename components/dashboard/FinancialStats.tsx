import { GlowingCard } from "@/components/ui/GlowingCard";
import CountUp from "@/components/CountUp";
import type { FactorySnapshot } from "@/types/credora";
import { formatUnits } from "viem";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

interface FinancialStatsProps {
    snapshot?: FactorySnapshot;
}

export const FinancialStats: React.FC<FinancialStatsProps> = ({ snapshot }) => {
    if (!snapshot) {
        return (
            <GlowingCard className="p-8 text-center w-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-4 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-orbitron text-white mb-3">
                    Financial Snapshot Unavailable
                </h3>
                <p className="text-lg font-spaceGrotesk text-neutral-300">
                    There is no financial snapshot yet...
                </p>
                <p className="text-sm font-shareTechMono text-neutral-400 mt-2">
                    The data may be initializing or is not currently reported by the protocol.
                </p>
            </GlowingCard>
        );
    }

    const getCountUpEndValue = (value: string | bigint | undefined | null): number => {
        if (value === undefined || value === null) return 0;
        if (typeof value === 'string') {
            // Assuming the string is a valid representation of a number, potentially from formatUnits
            return parseFloat(value) || 0; // Fallback to 0 if parsing fails
        }
        // If it's a bigint, convert to number. formatUnits(value, 0) essentially did value.toString()
        return Number(formatUnits(value, 0));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <GlowingCard variant="green" className="p-4">
                <h3 className="text-neonGreen text-sm mb-1">Total Pools Created</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.totalPoolsCreated)}
                        duration={2}
                        formatter={formatCompactNumber} />
                </div>
            </GlowingCard>

            <GlowingCard variant="green" className="p-4">
                <h3 className="text-neonGreen text-sm mb-1">Pools in Funding</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.countFundingPools)}
                        duration={2}
                        formatter={formatCompactNumber} />
                </div>
            </GlowingCard>

            <GlowingCard variant="green" className="p-4">
                <h3 className="text-neonGreen text-sm mb-1">Active Pools</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.countActivePools)}
                        duration={2}
                        formatter={formatCompactNumber} />
                </div>
            </GlowingCard>

            <GlowingCard className="p-4">
                <h3 className="text-neutral-400 text-sm mb-1">Repaid Pools</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.countRepaidPools)}
                        duration={2}
                        formatter={formatCompactNumber} />
                </div>
            </GlowingCard>

            <GlowingCard variant="red" className="p-4">
                <h3 className="text-neonRed text-sm mb-1">Defaulted Pools</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.countDefaultedPools)}
                        duration={2}
                        formatter={formatCompactNumber} />
                </div>
            </GlowingCard>

            <GlowingCard className="p-4">
                <h3 className="text-neutral-400 text-sm mb-1">Cancelled Pools</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.countCancelledPools)}
                        duration={2}
                        formatter={formatCompactNumber} />
                </div>
            </GlowingCard>

            <GlowingCard className="p-4">
                <h3 className="text-neutral-400 text-sm mb-1">Pending Init Pools</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.countPendingInitializationPools)}
                        duration={2}
                        formatter={formatCompactNumber} />
                </div>
            </GlowingCard>

            <GlowingCard variant="green" className="p-4">
                <h3 className="text-neonGreen text-sm mb-1">Total Value In Funding</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.totalValueInFunding)}
                        duration={2.5}
                        formatter={formatCurrency} />
                </div>
            </GlowingCard>

            <GlowingCard variant="green" className="p-4">
                <h3 className="text-neonGreen text-sm mb-1">Total Principal (Active Loans)</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.totalPrincipalActiveLoans)}
                        duration={2.5}
                        formatter={formatCurrency} />
                </div>
            </GlowingCard>

            <GlowingCard variant="green" className="p-4">
                <h3 className="text-neonGreen text-sm mb-1">Total Principal Repaid</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.totalOverallPrincipalRepaid)}
                        duration={2.5}
                        formatter={formatCurrency} />
                </div>
            </GlowingCard>

            <GlowingCard variant="green" className="p-4">
                <h3 className="text-neonGreen text-sm mb-1">Total Interest Repaid</h3>
                <div className="text-2xl font-orbitron">
                    <CountUp
                        end={getCountUpEndValue(snapshot.totalOverallInterestRepaid)}
                        duration={2.5}
                        formatter={formatCurrency} />
                </div>
            </GlowingCard>
        </div>
    );
};

export default FinancialStats; 