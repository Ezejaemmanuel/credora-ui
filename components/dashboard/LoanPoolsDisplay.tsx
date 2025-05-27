import { SectionTitle } from "@/components/ui/SectionTitle";
import LoanCard from "@/components/dashboard/LoanCard";
import type { LoanPoolFullDetails } from "@/types/credora";

interface LoanPoolsDisplayProps {
    loanPools: LoanPoolFullDetails[];
    onViewLoan: (loan: LoanPoolFullDetails) => void;
}

export const LoanPoolsDisplay: React.FC<LoanPoolsDisplayProps> = ({ loanPools, onViewLoan }) => {
    return (
        <div>
            <SectionTitle
                title="Discover Loan Pools"
                subtitle="Find opportunities to fund or borrow"
                variant="green"
                className="mb-6"
            />

            {loanPools && loanPools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loanPools.map(pool => (
                        <LoanCard
                            key={pool.poolAddress}
                            loan={pool}
                            onViewDetails={() => onViewLoan(pool)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-xl font-orbitron text-white/70 mb-2">No Loan Pools Available</p>
                    <p className="text-md font-spaceGrotesk text-white/50">Check back later or consider creating a new loan proposal.</p>
                </div>
            )}
        </div>
    );
};

export default LoanPoolsDisplay; 