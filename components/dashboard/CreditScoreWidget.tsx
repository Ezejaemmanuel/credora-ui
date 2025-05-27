import { CyberButton } from "@/components/ui/CyberButton";
import { GlowingCard } from "@/components/ui/GlowingCard";
import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";
import { format } from 'date-fns'; // For formatting the timestamp

interface CreditScoreWidgetProps {
  // score prop is removed as we are focusing on interestRate (recommendedRate)
  maxLoanEligibility?: number; // Parsed from string to number before passing
  recommendedRate?: number; // This is interestRateBPS / 100
  hasRiskProfile: boolean; // Indicates if the user has a risk profile from factoryData
  onAssessProfile?: () => void; // Callback for "Request AI Assessment" button
  assessmentTimestamp?: bigint; // New prop for the timestamp
}

interface RiskCategory {
  status: string;
  textColorClass: string;
  details: string;
}

const getRiskCategory = (rate?: number): RiskCategory => {
  if (typeof rate !== 'number') {
    return { status: "Profile Active", textColorClass: "text-neonGreen", details: "Eligibility & Rate Below" };
  }
  if (rate <= 5) return { status: "Optimal Trust", textColorClass: "text-neonGreen glow-neonGreen-text", details: "Excellent financing terms expected." };
  if (rate <= 10) return { status: "Favorable", textColorClass: "text-neonGreen", details: "Good financing terms likely." };
  if (rate <= 20) return { status: "Standard Risk", textColorClass: "text-white/90", details: "Fair financing terms, standard review." };
  if (rate <= 50) return { status: "Elevated Risk", textColorClass: "text-neonRed", details: "Financing may have stricter conditions." };
  if (rate < 100) return { status: "High Risk", textColorClass: "text-neonRed glow-neonRed-text", details: "Significant financing challenges expected." };
  return { status: "CRITICAL RISK", textColorClass: "text-neonRed glow-neonRed-text font-bold", details: "System alert: May not be eligible for financing." };
};

// Helper to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const CreditScoreWidget = ({
  maxLoanEligibility,
  recommendedRate,
  hasRiskProfile,
  onAssessProfile,
  assessmentTimestamp,
}: CreditScoreWidgetProps) => {
  // console.log('this is the actual score of the user', score) // score is removed
  if (!hasRiskProfile) {
    return (
      <GlowingCard variant="green" className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <h3 className="text-xl font-orbitron mb-4 text-white/80">AI Credit Score</h3>
        <p className="text-white/70 mb-6 font-spaceGrotesk">
          Your credit profile hasn&apos;t been assessed yet. <br />Our AI can evaluate your on-chain and off-chain data.
        </p>
        <CyberButton
          variant="green"
          onClick={onAssessProfile || (() => console.log("Requesting AI assessment..."))}
          className="w-full"
        >
          Request AI Assessment
        </CyberButton>
      </GlowingCard>
    );
  }

  const riskCategory = getRiskCategory(recommendedRate);
  const formattedTimestamp = assessmentTimestamp
    ? format(new Date(Number(assessmentTimestamp) * 1000), 'MMM d, yyyy, HH:mm')
    : null;

  return (
    <GlowingCard
      variant={riskCategory.textColorClass.includes("neonRed") ? "red" : "green"}
      className="p-6 flex flex-col justify-between h-full min-h-[300px]"
    >
      <div>
        <h3 className="text-xl font-orbitron mb-4 text-center">AI Credit Assessment</h3>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-4"
        >
          {typeof recommendedRate === 'number' ? (
            <>
              <div className={`text-4xl font-orbitron mb-1 ${riskCategory.textColorClass}`}>
                <CountUp end={recommendedRate} duration={1.5} decimals={2} suffix="%" />
              </div>
              <div className={`text-lg font-spaceGrotesk mb-1 ${riskCategory.textColorClass}`}>
                {riskCategory.status}
              </div>
              <p className="text-xs text-white/70 font-shareTechMono px-2">{riskCategory.details}</p>
            </>
          ) : (
            <div className="text-center py-4">
              <span className={`text-2xl font-orbitron ${riskCategory.textColorClass}`}>{riskCategory.status}</span>
              <p className="text-sm text-white/70 block mt-1 font-spaceGrotesk">{riskCategory.details}</p>
            </div>
          )}
        </motion.div>

        {formattedTimestamp && (
          <div className="text-center text-xs text-white/60 font-shareTechMono mb-4">
            Last Assessed: {formattedTimestamp}
          </div>
        )}

        {(typeof maxLoanEligibility === 'number') && (
          <div className="border-t border-white/10 pt-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="text-white/70 text-sm font-spaceGrotesk">Max Loan Eligibility</div>
              <div className="text-lg font-orbitron text-neonGreen">
                <CountUp
                  end={maxLoanEligibility}
                  duration={1.5}
                  formatter={formatCurrency}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 mt-auto">
        <CyberButton variant="green" className="w-full">
          Refresh AI Profile
        </CyberButton>
        <CyberButton
          variant={riskCategory.textColorClass.includes("neonRed") ? "red" : "green"}
          className="w-full"
        >
          View Detailed Assessment
        </CyberButton>
      </div>
      <style jsx global>{`
        .glow-neonGreen-text {
          text-shadow: 0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 15px #00FF00;
        }
        .glow-neonRed-text {
          text-shadow: 0 0 5px #FF3131, 0 0 10px #FF3131, 0 0 15px #FF3131;
        }
      `}</style>
    </GlowingCard>
  );
};

export default CreditScoreWidget;
