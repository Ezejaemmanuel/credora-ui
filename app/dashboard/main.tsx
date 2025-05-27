"use client";
import { useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CreditScoreWidget from "@/components/dashboard/CreditScoreWidget";
import AIChatAssistant from "@/components/dashboard/AIChatAssistant";
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
} from "@/components/credenza";
import { ScrollArea } from "@/components/ui/scroll-area";
import FinancialStats from "@/components/dashboard/FinancialStats";
import ActiveEngagements from "@/components/dashboard/ActiveEngagements";
import LoanPoolsDisplay from "@/components/dashboard/LoanPoolsDisplay";
import PortfolioPerformanceChart from "@/components/dashboard/PortfolioPerformanceChart";
import LoanDetailsDialogContent from "@/components/dashboard/LoanDetailsDialogContent";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { useCredoraFactoryData } from "@/hooks/useCredoraFactoryData";
import type { LoanPoolFullDetails } from "@/types/credora";
import ErrorDisplay from "@/components/dashboard/ErrorDisplay";
import NoDataDisplay from "@/components/dashboard/NoDataDisplay";
import { Button } from "@/components/ui/button";
import { MintUSDCSection } from "@/components/dashboard/MintUSDCSection";


interface SelectedLoanData {
    id: number;
    purpose: string;
    targetAmount: number;
    raisedAmount: number;
    interestRate: number;
    duration: string;
    status: string;
}

export const Dashboard = () => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<LoanPoolFullDetails | null>(null);
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const { data: factoryData, isLoading, isError, error } = useCredoraFactoryData();
    console.log("this is the facotry data", { factoryData });

    const handleRetry = () => {
        console.log("Retrying data fetch...");
        window.location.reload();
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (isError) {
        return <ErrorDisplay error={error} onRetry={handleRetry} />;
    }

    if (!factoryData) {
        return <NoDataDisplay />;
    }

    const handleViewLoan = (loan: LoanPoolFullDetails) => {
        setSelectedLoan(loan);
        setIsDetailsOpen(true);
    };

    // Prepare data for CreditScoreWidget from factoryData
    const riskProfile = factoryData.userComprehensiveDetails?.riskProfile;
    const hasRiskProfile = !!(riskProfile && riskProfile.exists);

    let widgetMaxLoanEligibility: number | undefined = undefined;
    let widgetRecommendedRate: number | undefined = undefined;
    let widgetAssessmentTimestamp: bigint | undefined = undefined;

    if (hasRiskProfile && riskProfile) {
        if (riskProfile.maxLoanAmount) {
            widgetMaxLoanEligibility = parseFloat(riskProfile.maxLoanAmount);
        }
        if (riskProfile.interestRateBPS) {
            widgetRecommendedRate = Number(riskProfile.interestRateBPS) / 100;
        }
        if (riskProfile.assessmentTimestamp) {
            widgetAssessmentTimestamp = riskProfile.assessmentTimestamp;
        }
    }

    // Placeholder for AI assessment request
    const handleRequestAIAssessment = () => {
        console.log("User requests AI credit assessment. Triggering chat or modal...");
    };

    // Extract borrowed and funded pools for ActiveEngagements
    const userBorrowedPools = factoryData.userComprehensiveDetails?.borrowedPools || [];
    const userFundedPools = factoryData.userComprehensiveDetails?.fundedPools || [];

    // Data for LoanPoolsDisplay from factory
    const allLoanPools = factoryData.allPoolsGeneralDetails || [];

    // Data for PortfolioPerformanceChart (using empty array as placeholder)
    const portfolioChartData: { month: string; return: number }[] = [];

    return (
        <div className=" bg-black text-white">

            <div className="flex w-full">
                <ScrollArea className="flex-1 h-[calc(100vh-72px)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20">
                        <div className="space-y-8">
                            <div className="flex justify-end mb-6">
                                <Button
                                    onClick={() => setIsMintModalOpen(true)}
                                    className="bg-neonGreen text-black hover:bg-green-400 active:bg-green-500 transition-all duration-300 ease-in-out py-2 px-6 text-base font-semibold glow-neonGreen-box"
                                >
                                    Mint Test USDC
                                </Button>
                            </div>

                            {factoryData?.factoryFinancialSnapshot && (
                                <FinancialStats snapshot={factoryData.factoryFinancialSnapshot} />
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CreditScoreWidget
                                    hasRiskProfile={hasRiskProfile}
                                    maxLoanEligibility={widgetMaxLoanEligibility}
                                    recommendedRate={widgetRecommendedRate}
                                    assessmentTimestamp={widgetAssessmentTimestamp}
                                    onAssessProfile={handleRequestAIAssessment}
                                />
                                <ActiveEngagements
                                    borrowedPools={userBorrowedPools}
                                    fundedPools={userFundedPools}
                                    allPools={allLoanPools}
                                />
                            </div>

                            <LoanPoolsDisplay loanPools={allLoanPools} onViewLoan={handleViewLoan} />

                            <PortfolioPerformanceChart data={portfolioChartData} />
                        </div>
                    </div>
                </ScrollArea>

                <div className="hidden lg:block w-96 xl:w-[30rem] flex-shrink-0 h-[calc(100vh-72px)]">
                    <AIChatAssistant />
                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-black border-t border-neutral-800">
                <AIChatAssistant />
            </div>

            <Credenza open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <CredenzaContent className="bg-black border-neonGreen border-2 text-white max-w-2xl transform-gpu">
                    <CredenzaHeader>
                        <CredenzaTitle className="text-2xl font-orbitron text-neonGreen glow-neonGreen-text">
                            {selectedLoan?.loanPurpose || "Loan Details"}
                        </CredenzaTitle>
                    </CredenzaHeader>
                    <CredenzaBody className="max-h-[calc(80vh-120px)] overflow-y-auto custom-scrollbar-transparent space-y-1 text-sm p-1 pr-2 md:pr-3">
                        <LoanDetailsDialogContent loan={selectedLoan} />
                    </CredenzaBody>
                </CredenzaContent>
            </Credenza>

            <Credenza open={isMintModalOpen} onOpenChange={setIsMintModalOpen}>
                <CredenzaContent className="bg-black border-neonGreen border-2 text-white max-w-lg transform-gpu">
                    <CredenzaHeader>
                        <CredenzaTitle className="text-2xl font-orbitron text-neonGreen glow-neonGreen-text">
                            Mint MockUSDC
                        </CredenzaTitle>
                    </CredenzaHeader>
                    <CredenzaBody className="max-h-[calc(80vh-120px)] overflow-y-auto custom-scrollbar-transparent p-1 pr-2 md:pr-3">
                        <MintUSDCSection />
                    </CredenzaBody>
                </CredenzaContent>
            </Credenza>

            <style jsx global>{`
                .glow-neonGreen-text {
                    text-shadow: 0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 15px #00FF00;
                }
                .custom-scrollbar-transparent::-webkit-scrollbar {
                  width: 6px;
                  height: 6px;
                }
                .custom-scrollbar-transparent::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar-transparent::-webkit-scrollbar-thumb {
                  background: rgba(0, 255, 0, 0.3);
                  border-radius: 3px;
                }
                .custom-scrollbar-transparent::-webkit-scrollbar-thumb:hover {
                  background: rgba(0, 255, 0, 0.5);
                }
            `}</style>
        </div>
    );
};

