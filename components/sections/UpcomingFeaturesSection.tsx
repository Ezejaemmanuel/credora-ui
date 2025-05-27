import { motion } from "framer-motion";
import { SectionTitle } from "../ui/SectionTitle";

const features = [
  {
    title: "Reputation NFTs for good borrowers",
    description: "Earn exclusive NFTs that unlock higher borrowing limits.",
    variant: "green"
  },
  {
    title: "DAO governance and risk markets",
    description: "Community-driven risk parameters and protocol governance.",
    variant: "red"
  },
  {
    title: "Automatic liquidation protections",
    description: "Smart mechanisms to prevent unfair liquidations during market volatility.",
    variant: "green"
  },
  {
    title: "Custom risk curves for lenders",
    description: "Set your own risk tolerance and expected yield parameters.",
    variant: "red"
  },
  {
    title: "Chain abstraction (ZK messaging / LayerZero)",
    description: "Seamless multi-chain operations with unified credit scoring.",
    variant: "green"
  },
  {
    title: "Social recovery and account abstraction",
    description: "Enhanced security and user experience for managing loans.",
    variant: "red"
  }
];

const UpcomingFeaturesSection = () => {
  const timelineData = [
    {
      quarter: "Q2 2025",
      title: "Reputation NFTs & DAO",
      details: "Earn exclusive NFTs, participate in DAO governance.",
      color: "neonGreen",
    },
    {
      quarter: "Q3 2025",
      title: "Risk & Liquidation Tools",
      details: "Custom risk curves for lenders, automatic liquidation protections.",
      color: "neonGreen",
    },
    {
      quarter: "Q4 2025",
      title: "Multi-Chain Operations",
      details: "Seamless multi-chain access with unified credit scoring.",
      color: "neonGreen",
    },
    {
      quarter: "Q1 2026",
      title: "Account Abstraction",
      details: "Enhanced security with social recovery and account abstraction.",
      color: "neonRed",
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="Upcoming Features"
          center
          variant="green"
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black border border-neonGreen/20 p-6 rounded-md hover:border-neonGreen/50 transition-all duration-300"
            >
              <h3 className={`text-xl font-orbitron mb-3 ${feature.variant === "green" ? "text-neonGreen" : "text-neonRed"
                }`}>
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 bg-black border border-neonGreen/30 p-6 rounded-md text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-orbitron text-neonGreen mb-4">Roadmap Timeline</h3>

          <div className="relative py-12">
            {/* Animated Horizontal Timeline line - for md screens and up */}
            <motion.div
              className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-neonGreen/30 origin-left transform -translate-y-1/2"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
            />
            {/* Animated Vertical Timeline line - for screens smaller than md */}
            <motion.div
              className="block md:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-neonGreen/30 origin-top transform -translate-x-1/2"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.2 }} // amount: 0.2 to trigger when 20% of element is in view
              transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
              style={{ zIndex: 5 }} // Ensure it's behind dots but visible
            />

            {/* Milestones flex container */}
            {/* On small screens: flex-col, items-center. On md+: flex-row, justify-between */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-center md:items-start pt-4 space-y-12 md:space-y-0">
              {timelineData.map((milestone, index) => (
                <motion.div
                  key={milestone.quarter}
                  // On small screens: w-full or w-3/4. On md+: w-1/4 or adapt based on items count
                  className="flex flex-col items-center w-full md:w-1/4 px-2 text-center relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                  style={{ zIndex: 10 }} // Ensure dots are above the timeline bar
                >
                  <motion.div
                    className={`w-7 h-7 md:w-6 md:h-6 rounded-full bg-black border-2 mb-3 transition-all duration-300
                                ${milestone.color === "neonGreen"
                        ? "border-neonGreen shadow-[0_0_8px_0_rgba(0,255,0,0.6)] hover:shadow-[0_0_15px_2px_rgba(0,255,0,0.9)]"
                        : "border-neonRed shadow-[0_0_8px_0_rgba(255,49,49,0.6)] hover:shadow-[0_0_15px_2px_rgba(255,49,49,0.9)]"
                      }`}
                    whileHover={{ scale: 1.15 }}
                  />
                  <div className={`font-orbitron text-base mb-1 ${milestone.color === "neonGreen" ? "text-neonGreen" : "text-neonRed"}`}>
                    {milestone.quarter}
                  </div>
                  <h4 className="text-sm font-semibold text-white/90 mb-1">{milestone.title}</h4>
                  <p className="text-xs text-white/70">{milestone.details}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -z-10 bottom-20 right-20 w-96 h-96 blur-[120px] rounded-full bg-neonGreen/5" />
    </section>
  );
};

export default UpcomingFeaturesSection;
