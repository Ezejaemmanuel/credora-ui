import { publicClient } from "@/lib/viemConfig";
import { credoraPoolFactoryConfig } from "@/generated";
import {
    LoanStatus,
    type Address,
    type UserComprehensiveDetails as FormattedUserComprehensiveDetails,
    type BorrowerRiskProfile as FormattedBorrowerRiskProfile,
    type LoanPoolFullDetails as FormattedLoanPoolFullDetails,
    type LenderPoolContributionDetails as FormattedLenderPoolContributionDetails,
    type FactorySnapshot as FormattedFactorySnapshot
} from "@/types/credora";

import { formatUnits } from "viem";
import {
    RawBorrowerRiskProfile,
    RawUserComprehensiveDetails,
    RawFactorySnapshot,
    RawFullLoanPoolDetails,
    RawLenderPoolContributionDetails
} from "@/types/contractTypes";

const FACTORY_ADDRESS = credoraPoolFactoryConfig.address[42421];
const FACTORY_ABI = credoraPoolFactoryConfig.abi;
const USDC_DECIMALS = 6;

function formatBorrowerRiskProfile(profile: RawBorrowerRiskProfile): FormattedBorrowerRiskProfile {
    return {
        ...profile,
        maxLoanAmount: formatUnits(profile.maxLoanAmount, USDC_DECIMALS),
        interestRateBPS: profile.interestRateBPS,
    };
}

function formatLoanPoolFullDetails(pool: RawFullLoanPoolDetails): FormattedLoanPoolFullDetails {
    return {
        ...pool,
        loanAmountPrincipal: formatUnits(pool.loanAmountPrincipal, USDC_DECIMALS),
        totalFundsRaised: formatUnits(pool.totalFundsRaised, USDC_DECIMALS),
        totalPrincipalRepaid: formatUnits(pool.totalPrincipalRepaid, USDC_DECIMALS),
        totalInterestRepaid: formatUnits(pool.totalInterestRepaid, USDC_DECIMALS),
        installmentPrincipalPerPeriod: formatUnits(pool.installmentPrincipalPerPeriod, USDC_DECIMALS),
        installmentInterestPerPeriod: formatUnits(pool.installmentInterestPerPeriod, USDC_DECIMALS),
    };
}

function formatLenderPoolContributionDetails(contribution: RawLenderPoolContributionDetails & { poolAddress: Address }): FormattedLenderPoolContributionDetails {
    return {
        ...contribution,
        poolAddress: contribution.poolAddress,
        shares: formatUnits(contribution.shares, USDC_DECIMALS),
        principalAlreadyClaimedByLender: formatUnits(contribution.principalAlreadyClaimedByLender, USDC_DECIMALS),
        claimablePrincipalNow: formatUnits(contribution.claimablePrincipalNow, USDC_DECIMALS),
        claimableInterestNow: formatUnits(contribution.claimableInterestNow, USDC_DECIMALS),
    };
}

function formatUserComprehensiveDetails(details: RawUserComprehensiveDetails): FormattedUserComprehensiveDetails {
    return {
        riskProfile: formatBorrowerRiskProfile(details.riskProfile),
        borrowedPools: details.borrowedPools.map(p => formatLoanPoolFullDetails(p as unknown as RawFullLoanPoolDetails)),
        fundedPools: details.fundedPools
            .filter((contrib): contrib is RawLenderPoolContributionDetails & { poolAddress: Address } => typeof contrib.poolAddress === 'string' && contrib.poolAddress.startsWith('0x'))
            .map(formatLenderPoolContributionDetails),
    };
}

function formatFactorySnapshot(snapshot: RawFactorySnapshot): FormattedFactorySnapshot {
    return {
        ...snapshot,
        totalValueInFunding: formatUnits(snapshot.totalValueInFunding, USDC_DECIMALS),
        totalPrincipalActiveLoans: formatUnits(snapshot.totalPrincipalActiveLoans, USDC_DECIMALS),
        totalOverallPrincipalRepaid: formatUnits(snapshot.totalOverallPrincipalRepaid, USDC_DECIMALS),
        totalOverallInterestRepaid: formatUnits(snapshot.totalOverallInterestRepaid, USDC_DECIMALS),
    };
}

async function fetchCredoraDataForAddress(userAddress: Address): Promise<{
    userComprehensiveDetails?: FormattedUserComprehensiveDetails;
    factoryFinancialSnapshot?: FormattedFactorySnapshot;
}> {
    try {
        const userDetailsPromise = publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getUserComprehensiveDetails",
            args: [userAddress],
        }) as Promise<RawUserComprehensiveDetails>;

        const snapshotPromise = publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getFactoryFinancialSnapshot",
        }) as Promise<RawFactorySnapshot>;

        const [userDetailsRaw, snapshotRaw] = await Promise.all([userDetailsPromise, snapshotPromise]);

        const formattedUserDetails = userDetailsRaw ? formatUserComprehensiveDetails(userDetailsRaw) : undefined;

        return {
            userComprehensiveDetails: formattedUserDetails,
            factoryFinancialSnapshot: snapshotRaw ? formatFactorySnapshot(snapshotRaw) : undefined,
        };
    } catch (error) {
        console.error(`Error fetching Credora data for address ${userAddress}:`, error);
        return { userComprehensiveDetails: undefined, factoryFinancialSnapshot: undefined };
    }
}

export async function generateUserContextForAgent(userAddress: Address | null | undefined): Promise<string> {
    if (!userAddress) {
        return `
User wallet address: Not provided or not connected
Risk profile: Unknown
Loans: Unknown
Status: Please provide your wallet address to get personalized information.
`;
    }

    const credoraData = await fetchCredoraDataForAddress(userAddress);

    if (!credoraData.userComprehensiveDetails || !credoraData.factoryFinancialSnapshot) {
        return `
User wallet address: ${userAddress}
Risk profile: Could not retrieve data.
Loans: Could not retrieve data.
Protocol Stats: Could not retrieve data.
Status: There was an issue fetching your profile or protocol statistics. Ensure your wallet is connected to the correct network.
`;
    }

    const { userComprehensiveDetails, factoryFinancialSnapshot } = credoraData;

    const riskProfile = userComprehensiveDetails.riskProfile;
    const hasRiskProfile = riskProfile?.exists || false;

    const borrowedPools = userComprehensiveDetails.borrowedPools || [];
    const activeBorrowedPools = borrowedPools.filter(pool => pool.currentStatus === LoanStatus.Active);
    const fundingBorrowedPools = borrowedPools.filter(pool => pool.currentStatus === LoanStatus.Funding);

    const fundedPools = userComprehensiveDetails.fundedPools || [];
    const snapshot = factoryFinancialSnapshot;

    const maxLoanAmountStr = hasRiskProfile ? riskProfile.maxLoanAmount : '0';
    const interestRateBpsStr = hasRiskProfile ? String(riskProfile.interestRateBPS || '0') : '0';

    const borrowedPoolsDetails = borrowedPools.map(pool => (
        `  - Pool Address: ${pool.poolAddress}\n` +
        `    Purpose: ${pool.loanPurpose}\n` +
        `    Principal: ${pool.loanAmountPrincipal} USDC\n` +
        `    Interest Rate: ${String(pool.interestRateBPS)} BPS\n` +
        `    Status: ${LoanStatus[pool.currentStatus] || 'Unknown'}\n` +
        `    Funds Raised: ${pool.totalFundsRaised} USDC / ${pool.loanAmountPrincipal} USDC\n` +
        `    Repaid: ${pool.totalPrincipalRepaid} (P), ${pool.totalInterestRepaid} (I) USDC`
    )).join('\n\n');

    const fundedPoolsDetails = fundedPools.map(contrib => (
        `  - Pool Address: ${contrib.poolAddress}\n` +
        `    Shares: ${contrib.shares}\n` +
        `    Claimable Principal: ${contrib.claimablePrincipalNow} USDC\n` +
        `    Claimable Interest: ${contrib.claimableInterestNow} USDC`
    )).join('\n\n');

    return `
USER PROFILE INFORMATION:
Wallet address: ${userAddress}

RISK PROFILE:
Has risk profile: ${hasRiskProfile ? 'Yes' : 'No'}
Maximum loan amount: ${maxLoanAmountStr} USDC
Interest rate: ${interestRateBpsStr} BPS

BORROWER ACTIVITY:
Total borrowed pools: ${borrowedPools.length}
${borrowedPools.length > 0 ? 'Details:\n' + borrowedPoolsDetails : 'No pools borrowed.'}

LENDER ACTIVITY:
Total funded pools: ${fundedPools.length}
${fundedPools.length > 0 ? 'Details:\n' + fundedPoolsDetails : 'No pools funded.'}

PROTOCOL STATISTICS (as of last fetch):
Total value locked: ${snapshot?.totalPrincipalActiveLoans || 'N/A'} USDC
Active pools: ${snapshot?.countActivePools !== undefined ? String(snapshot.countActivePools) : 'N/A'}
Funding pools: ${snapshot?.countFundingPools !== undefined ? String(snapshot.countFundingPools) : 'N/A'}
Status: Context successfully loaded for address ${userAddress}.
`;
} 