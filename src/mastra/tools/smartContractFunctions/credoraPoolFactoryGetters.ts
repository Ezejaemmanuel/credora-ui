import { credoraPoolFactoryConfig } from "@/generated";
import { publicClient } from "@/lib/viemConfig";
import {
    BorrowerRiskProfile,
    RawBorrowerRiskProfile,
    UserComprehensiveDetails,
    RawUserComprehensiveDetails,
    FullLoanPoolDetails,
    RawFullLoanPoolDetails,
    FactorySnapshot,
    RawFactorySnapshot,
    ContractErrorResponse,
    LoanStatus,
    mapLoanStatus
} from "@/types/contractTypes";
import {
    formatCurrency,
    formatInterestRate,
    formatTimestamp,
    formatRelativeTime,
    formatDuration,
    formatDurationCompact,
    formatNumber
} from "@/lib/formatters";

const FACTORY_ADDRESS = credoraPoolFactoryConfig.address[42421]; // Assuming 42421 is the correct chainId
const FACTORY_ABI = credoraPoolFactoryConfig.abi;

export const getLoanPoolImplementation = async (): Promise<`0x${string}` | ContractErrorResponse> => {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "loanPoolImplementation",
        });
        return data as `0x${string}`;
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling loanPoolImplementation on CredoraPoolFactory:`, error);
        return { error: error.message || `An unexpected error occurred while calling loanPoolImplementation.` };
    }
};

export const getAcceptedCurrency = async (): Promise<`0x${string}` | ContractErrorResponse> => {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "acceptedCurrency",
        });
        return data as `0x${string}`;
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling acceptedCurrency on CredoraPoolFactory:`, error);
        return { error: error.message || `An unexpected error occurred while calling acceptedCurrency.` };
    }
};

export const getRiskProfile = async (borrowerAddress: `0x${string}`): Promise<BorrowerRiskProfile | ContractErrorResponse> => {
    if (!borrowerAddress || !borrowerAddress.startsWith('0x')) {
        return { error: "Invalid borrower address provided." };
    }
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "riskProfiles",
            args: [borrowerAddress],
        });
        // Manually map the tuple to the BorrowerRiskProfile interface
        const result = data as readonly [bigint, bigint, bigint, boolean];
        const rawProfile: RawBorrowerRiskProfile = {
            maxLoanAmount: result[0],
            interestRateBPS: result[1],
            assessmentTimestamp: result[2],
            exists: result[3],
        };

        // Format values for UI display
        return {
            maxLoanAmount: formatCurrency(rawProfile.maxLoanAmount),
            interestRateBPS: formatInterestRate(rawProfile.interestRateBPS),
            assessmentTimestamp: formatTimestamp(rawProfile.assessmentTimestamp),
            exists: rawProfile.exists,
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling riskProfiles on CredoraPoolFactory for ${borrowerAddress}:`, error);
        return { error: error.message || `An unexpected error occurred while calling riskProfiles.` };
    }
};

export const getMaxInterestRateBps = async (): Promise<string | ContractErrorResponse> => {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "MAX_INTEREST_RATE_BPS",
        });
        return formatInterestRate(data as bigint);
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling MAX_INTEREST_RATE_BPS on CredoraPoolFactory:`, error);
        return { error: error.message || `An unexpected error occurred while calling MAX_INTEREST_RATE_BPS.` };
    }
};

export const getPoolsByBorrower = async (borrowerAddress: `0x${string}`): Promise<`0x${string}`[] | ContractErrorResponse> => {
    if (!borrowerAddress || !borrowerAddress.startsWith('0x')) {
        return { error: "Invalid borrower address provided." };
    }
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getPoolsByBorrower",
            args: [borrowerAddress],
        });
        return data as `0x${string}`[];
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getPoolsByBorrower on CredoraPoolFactory for ${borrowerAddress}:`, error);
        return { error: error.message || `An unexpected error occurred while calling getPoolsByBorrower.` };
    }
};

export const getAllPools = async (): Promise<`0x${string}`[] | ContractErrorResponse> => {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getAllPools",
        });
        return data as `0x${string}`[];
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getAllPools on CredoraPoolFactory:`, error);
        return { error: error.message || `An unexpected error occurred while calling getAllPools.` };
    }
};

export const getTotalPools = async (): Promise<string | ContractErrorResponse> => {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "totalPools",
        });
        return formatNumber(data as bigint);
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling totalPools on CredoraPoolFactory:`, error);
        return { error: error.message || `An unexpected error occurred while calling totalPools.` };
    }
};

export const getBorrowerDetails = async (borrowerAddress: `0x${string}`): Promise<{ riskProfile: BorrowerRiskProfile; pools: `0x${string}`[] } | ContractErrorResponse> => {
    if (!borrowerAddress || !borrowerAddress.startsWith('0x')) {
        return { error: "Invalid borrower address provided." };
    }
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getBorrowerDetails",
            args: [borrowerAddress],
        });

        // The contract returns a tuple [RawBorrowerRiskProfile, address[]]
        const result = data as [RawBorrowerRiskProfile, `0x${string}`[]];
        const rawProfile = result[0];

        // Format the risk profile
        const formattedProfile: BorrowerRiskProfile = {
            maxLoanAmount: formatCurrency(rawProfile.maxLoanAmount),
            interestRateBPS: formatInterestRate(rawProfile.interestRateBPS),
            assessmentTimestamp: formatTimestamp(rawProfile.assessmentTimestamp),
            exists: rawProfile.exists,
        };

        return {
            riskProfile: formattedProfile,
            pools: result[1]
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getBorrowerDetails on CredoraPoolFactory for ${borrowerAddress}:`, error);
        return { error: error.message || `An unexpected error occurred while calling getBorrowerDetails.` };
    }
};

export const getBorrowerRiskProfileExists = async (borrowerAddress: `0x${string}`): Promise<boolean | ContractErrorResponse> => {
    if (!borrowerAddress || !borrowerAddress.startsWith('0x')) {
        return { error: "Invalid borrower address provided." };
    }
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getBorrowerRiskProfileExists",
            args: [borrowerAddress],
        });
        return data as boolean;
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getBorrowerRiskProfileExists on CredoraPoolFactory for ${borrowerAddress}:`, error);
        return { error: error.message || `An unexpected error occurred while calling getBorrowerRiskProfileExists.` };
    }
};

export const getUserComprehensiveDetails = async (userAddress: `0x${string}`): Promise<UserComprehensiveDetails | ContractErrorResponse> => {
    if (!userAddress || !userAddress.startsWith('0x')) {
        return { error: "Invalid user address provided." };
    }
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getUserComprehensiveDetails",
            args: [userAddress],
        });

        // Format the raw data from the contract
        const rawData = data as RawUserComprehensiveDetails;

        // Format the risk profile
        const formattedRiskProfile: BorrowerRiskProfile = {
            maxLoanAmount: formatCurrency(rawData.riskProfile.maxLoanAmount),
            interestRateBPS: formatInterestRate(rawData.riskProfile.interestRateBPS),
            assessmentTimestamp: formatTimestamp(rawData.riskProfile.assessmentTimestamp),
            exists: rawData.riskProfile.exists,
        };

        // Format each borrowed pool
        const formattedBorrowedPools = rawData.borrowedPools.map((rawPool: RawFullLoanPoolDetails): FullLoanPoolDetails => ({
            poolAddress: rawPool.poolAddress,
            borrower: rawPool.borrower,
            loanAmountPrincipal: formatCurrency(rawPool.loanAmountPrincipal),
            interestRateBPS: formatInterestRate(rawPool.interestRateBPS),
            durationSeconds: formatDurationCompact(rawPool.durationSeconds),
            numberOfInstallments: formatNumber(rawPool.numberOfInstallments),
            acceptedCurrency: rawPool.acceptedCurrency,
            loanPurpose: rawPool.loanPurpose,
            poolTokenName: rawPool.poolTokenName,
            poolTokenSymbol: rawPool.poolTokenSymbol,
            tokenDecimals: rawPool.tokenDecimals,
            poolAdmin: rawPool.poolAdmin,
            currentStatus: rawPool.currentStatus,
            statusLabel: mapLoanStatus(rawPool.currentStatus),
            totalFundsRaised: formatCurrency(rawPool.totalFundsRaised),
            loanStartTime: formatTimestamp(rawPool.loanStartTime),
            maturityTime: formatTimestamp(rawPool.maturityTime),
            totalPrincipalRepaid: formatCurrency(rawPool.totalPrincipalRepaid),
            totalInterestRepaid: formatCurrency(rawPool.totalInterestRepaid),
            currentInstallmentPaidCount: formatNumber(rawPool.currentInstallmentPaidCount),
            installmentIntervalSeconds: formatDurationCompact(rawPool.installmentIntervalSeconds),
            installmentPrincipalPerPeriod: formatCurrency(rawPool.installmentPrincipalPerPeriod),
            installmentInterestPerPeriod: formatCurrency(rawPool.installmentInterestPerPeriod),
            nextInstallmentDueDate: formatTimestamp(rawPool.nextInstallmentDueDate),
            isPaused: rawPool.isPaused,
        }));

        // Format each funded pool contribution
        const formattedFundedPools = rawData.fundedPools.map(rawContrib => ({
            poolAddress: rawContrib.poolAddress,
            shares: formatCurrency(rawContrib.shares),
            principalAlreadyClaimedByLender: formatCurrency(rawContrib.principalAlreadyClaimedByLender),
            claimablePrincipalNow: formatCurrency(rawContrib.claimablePrincipalNow),
            claimableInterestNow: formatCurrency(rawContrib.claimableInterestNow),
        }));

        return {
            riskProfile: formattedRiskProfile,
            borrowedPools: formattedBorrowedPools,
            fundedPools: formattedFundedPools,
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getUserComprehensiveDetails on CredoraPoolFactory for ${userAddress}:`, error);
        return { error: error.message || `An unexpected error occurred while calling getUserComprehensiveDetails.` };
    }
};

export const getAllPoolsGeneralDetails = async (): Promise<FullLoanPoolDetails[] | ContractErrorResponse> => {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getAllPoolsGeneralDetails",
        });

        // Format the raw pool data
        const rawPools = data as RawFullLoanPoolDetails[];
        // console.log("Raw pool data from contract:", rawPools);

        const formattedPools = rawPools.map((rawPool): FullLoanPoolDetails => ({
            poolAddress: rawPool.poolAddress,
            borrower: rawPool.borrower,
            loanAmountPrincipal: formatCurrency(rawPool.loanAmountPrincipal),
            interestRateBPS: formatInterestRate(rawPool.interestRateBPS),
            durationSeconds: formatDurationCompact(rawPool.durationSeconds),
            numberOfInstallments: formatNumber(rawPool.numberOfInstallments),
            acceptedCurrency: rawPool.acceptedCurrency,
            loanPurpose: rawPool.loanPurpose,
            poolTokenName: rawPool.poolTokenName,
            poolTokenSymbol: rawPool.poolTokenSymbol,
            tokenDecimals: rawPool.tokenDecimals,
            poolAdmin: rawPool.poolAdmin,
            currentStatus: rawPool.currentStatus,
            statusLabel: mapLoanStatus(rawPool.currentStatus),
            totalFundsRaised: formatCurrency(rawPool.totalFundsRaised),
            loanStartTime: formatTimestamp(rawPool.loanStartTime),
            maturityTime: formatTimestamp(rawPool.maturityTime),
            totalPrincipalRepaid: formatCurrency(rawPool.totalPrincipalRepaid),
            totalInterestRepaid: formatCurrency(rawPool.totalInterestRepaid),
            currentInstallmentPaidCount: formatNumber(rawPool.currentInstallmentPaidCount),
            installmentIntervalSeconds: formatDurationCompact(rawPool.installmentIntervalSeconds),
            installmentPrincipalPerPeriod: formatCurrency(rawPool.installmentPrincipalPerPeriod),
            installmentInterestPerPeriod: formatCurrency(rawPool.installmentInterestPerPeriod),
            nextInstallmentDueDate: formatRelativeTime(rawPool.nextInstallmentDueDate),
            isPaused: rawPool.isPaused,
        }));

        // console.log("Formatted pool data for UI:", formattedPools);
        return formattedPools;
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getAllPoolsGeneralDetails on CredoraPoolFactory:`, error);
        return { error: error.message || `An unexpected error occurred while calling getAllPoolsGeneralDetails.` };
    }
};

export const getFactoryFinancialSnapshot = async (): Promise<FactorySnapshot | ContractErrorResponse> => {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getFactoryFinancialSnapshot",
        });

        // Format the raw data
        const rawData = data as RawFactorySnapshot;

        return {
            totalPoolsCreated: formatNumber(rawData.totalPoolsCreated),
            countFundingPools: formatNumber(rawData.countFundingPools),
            countActivePools: formatNumber(rawData.countActivePools),
            countRepaidPools: formatNumber(rawData.countRepaidPools),
            countDefaultedPools: formatNumber(rawData.countDefaultedPools),
            countCancelledPools: formatNumber(rawData.countCancelledPools),
            countPendingInitializationPools: formatNumber(rawData.countPendingInitializationPools),
            totalValueInFunding: formatCurrency(rawData.totalValueInFunding),
            totalPrincipalActiveLoans: formatCurrency(rawData.totalPrincipalActiveLoans),
            totalOverallPrincipalRepaid: formatCurrency(rawData.totalOverallPrincipalRepaid),
            totalOverallInterestRepaid: formatCurrency(rawData.totalOverallInterestRepaid),
        };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Error calling getFactoryFinancialSnapshot on CredoraPoolFactory:`, error);
        return { error: error.message || `An unexpected error occurred while calling getFactoryFinancialSnapshot.` };
    }
}; 