import { CyberButton } from "@/components/ui/CyberButton";
import { motion } from "framer-motion";
import type { LoanPoolFullDetails } from "@/types/credora";
import { LoanStatus } from "@/types/credora"; // Import LoanStatus enum
import { format } from 'date-fns'; // Import date-fns

// Helper to format currency (can be moved to lib/utils.ts)
const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return "N/A";
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numValue);
};

// Helper to format BigInt timestamp to readable date
const formatTimestamp = (timestamp?: bigint): string => {
  if (!timestamp || timestamp === 0n) return "N/A";
  try {
    return format(new Date(Number(timestamp) * 1000), 'MMM d, yyyy'); // Shortened format for card
  } catch (e) {
    return "Invalid Date";
  }
};

// Helper to format duration from seconds (can be moved to lib/utils.ts)
const formatDuration = (seconds?: bigint): string => {
  if (typeof seconds !== 'bigint' || seconds <= 0n) return "N/A"; // Use 0n
  const totalSeconds = Number(seconds);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const months = Math.floor(days / 30); // Approximate months
  if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  return "< 1 day";
};

// Helper to render loan status string (can be moved to lib/utils.ts)
const renderLoanStatus = (statusNum?: number): string => {
  if (typeof statusNum !== 'number') return "Unknown";
  return LoanStatus[statusNum] || "Unknown";
};

interface LoanCardProps {
  loan: LoanPoolFullDetails; // Update prop type
  onViewDetails: () => void;
}

const LoanCard = ({ loan, onViewDetails }: LoanCardProps) => {
  const raisedAmount = parseFloat(loan.totalFundsRaised);
  const targetAmount = parseFloat(loan.loanAmountPrincipal);
  const progressPercentage = targetAmount > 0 ? (raisedAmount / targetAmount) * 100 : 0;

  const displayStatus = renderLoanStatus(loan.currentStatus);
  const interestRatePercent = (Number(loan.interestRateBPS) / 100).toFixed(2);
  const formattedMaturityTime = formatTimestamp(loan.maturityTime);

  return (
    <motion.div
      className="bg-black border border-neonGreen/40 rounded-lg p-4 flex flex-col justify-between h-full shadow-lg hover:shadow-neonGreen/30 transition-shadow duration-300"
      whileHover={{ y: -5, boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)' }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-orbitron text-lg text-neonGreen glow-neonGreen-text truncate pr-2">{loan.loanPurpose || "Untitled Loan"}</h3>
          <span
            className={`text-xs font-orbitron px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap ${displayStatus === 'Funding' ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" :
              displayStatus === 'Active' ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                displayStatus === 'Repaid' ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
                  displayStatus === 'Defaulted' || displayStatus === 'Cancelled' ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                    "bg-neutral-500/20 text-neutral-400 border border-neutral-500/30"
              }`}
          >
            {displayStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 font-spaceGrotesk">
          <div>
            <div className="text-white/70">Interest Rate</div>
            <div className="text-neonGreen font-medium text-md">{interestRatePercent}%</div>
          </div>
          <div>
            <div className="text-white/70">Duration</div>
            <div className="text-white/90 text-md">{formatDuration(loan.durationSeconds)}</div>
          </div>
          <div>
            <div className="text-white/70">Target</div>
            <div className="text-white/90 text-md">{formatCurrency(loan.loanAmountPrincipal)}</div>
          </div>
          <div>
            <div className="text-white/70">Token</div>
            <div className="text-white/90 text-md font-orbitron">{loan.poolTokenSymbol || "N/A"}</div>
          </div>
          <div>
            <div className="text-white/70">Installments</div>
            <div className="text-white/90 text-md">{loan.numberOfInstallments.toString()}</div>
          </div>
          <div>
            <div className="text-white/70">Matures</div>
            <div className="text-white/90 text-md">{formattedMaturityTime}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/70 mb-1 font-shareTechMono">
            <span>Funding Progress: {progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-neutral-700/50 rounded-full h-2.5 border border-neutral-600">
            <motion.div
              className="bg-gradient-to-r from-neonGreen/70 to-neonGreen h-full rounded-full shadow-md shadow-neonGreen/50"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="text-right text-xs mt-1 text-white/60 font-shareTechMono">
            {formatCurrency(loan.totalFundsRaised)} / {formatCurrency(loan.loanAmountPrincipal)}
          </div>
        </div>
      </div>

      <CyberButton
        variant="green"
        className="w-full mt-auto text-sm py-2.5"
        onClick={onViewDetails}
        glowEffect={true}
      >
        View Details & Fund
      </CyberButton>
      <style jsx global>{`
        .glow-neonGreen-text {
          text-shadow: 0 0 3px #00FF00, 0 0 6px #00FF00;
        }
      `}</style>
    </motion.div>
  );
};

export default LoanCard;
