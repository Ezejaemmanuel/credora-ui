// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Roles} from "./Roles.sol";
import {ICredoraLoanPool, FullLoanPoolInfo, LenderPoolInfo} from "./interfaces/ICredoraLoanPool.sol";

/**
 * @title CredoraPoolFactory
 * @author Credora Team
 * @notice This contract is responsible for creating and managing CredoraLoanPools.
 * It allows an AI role to set risk profiles for borrowers and a pool creator role
 * (or the borrower under certain conditions) to instantiate new loan pools.
 */
contract CredoraPoolFactory is Roles {
    /**
     * @notice The master implementation of the CredoraLoanPool contract.
     * New loan pools are deployed as minimal proxies (clones) of this implementation.
     */
    address public immutable loanPoolImplementation;

    /**
     * @notice The ERC20 token address that is accepted for lending and borrowing (e.g., USDC).
     */
    IERC20 public immutable acceptedCurrency;

    /**
     * @notice Structure to store the risk profile of a borrower as assessed by the AI.
     * @param maxLoanAmount The maximum amount the borrower is eligible to borrow.
     * @param interestRateBPS The suggested interest rate in basis points (1% = 100 BPS).
     * @param assessmentTimestamp The timestamp when this assessment was made.
     * @param exists True if a profile has been set for this borrower, false otherwise.
     */
    struct BorrowerRiskProfile {
        uint256 maxLoanAmount;
        uint256 interestRateBPS;
        uint64 assessmentTimestamp;
        bool exists;
    }
    //setting the max interest rate to 1000%

    uint256 public constant MAX_INTEREST_RATE_BPS = 100000;

    /**
     * @notice Mapping from a borrower's address to their AI-assessed risk profile.
     */
    mapping(address => BorrowerRiskProfile) public riskProfiles;

    /**
     * @notice Mapping from a borrower's address to an array of their loan pool addresses.
     */
    mapping(address => address[]) public borrowerLoanPools;

    /**
     * @notice An array of all loan pools created by this factory.
     */
    address[] public allLoanPools;

    /**
     * @notice Emitted when a new risk profile is set or updated for a borrower by the AI.
     * @param borrower The address of the borrower.
     * @param maxLoanAmount The maximum loan amount set.
     * @param interestRateBPS The interest rate in BPS set.
     */
    event RiskProfileSet(address indexed borrower, uint256 maxLoanAmount, uint256 interestRateBPS);

    /**
     * @notice Emitted when a new loan pool is created.
     * @param poolAddress The address of the newly created loan pool.
     * @param borrower The address of the borrower for whom the pool was created.
     * @param creator The address that initiated the pool creation.
     * @param loanAmount The principal amount of the loan.
     * @param interestRateBPS The interest rate for the loan in BPS.
     * @param durationSeconds The duration of the loan in seconds.
     * @param numberOfInstallments The number of installments for the loan.
     * @param acceptedCurrency The currency of the loan.
     * @param purpose The stated purpose of the loan.
     */
    event LoanPoolCreated(
        address indexed poolAddress,
        address indexed borrower,
        address indexed creator,
        uint256 loanAmount,
        uint256 interestRateBPS,
        uint256 durationSeconds,
        uint256 numberOfInstallments,
        address acceptedCurrency,
        string purpose
    );

    // --- Structs for Comprehensive User Details Getter ---

    /**
     * @notice Details of a loan pool where the user is the borrower.
     * Mirrors CredoraLoanPool.FullLoanPoolInfo structure for ABI compatibility.
     */
    struct BorrowerPoolFullDetails {
        address poolAddress;
        address borrower; // Should be the queried user
        uint256 loanAmountPrincipal;
        uint256 interestRateBPS;
        uint256 durationSeconds;
        uint256 numberOfInstallments;
        address acceptedCurrency;
        string loanPurpose;
        string poolTokenName;
        string poolTokenSymbol;
        uint8 tokenDecimals;
        address poolAdmin;
        uint8 currentStatus; // Corresponds to CredoraLoanPool.LoanStatus enum (0-5)
        uint256 totalFundsRaised;
        uint256 loanStartTime;
        uint256 maturityTime;
        uint256 totalPrincipalRepaid;
        uint256 totalInterestRepaid;
        uint256 currentInstallmentPaidCount;
        uint256 installmentIntervalSeconds;
        uint256 installmentPrincipalPerPeriod;
        uint256 installmentInterestPerPeriod;
        uint256 nextInstallmentDueDate;
        bool isPaused;
    }

    /**
     * @notice Internal temporary struct to decode return from ICredoraLoanPool.getLenderPoolInformation.
     * Mirrors CredoraLoanPool.LenderPoolInfo structure for ABI compatibility.
     */
    struct Local_Credora_LenderPoolInfo {
        uint256 shares;
        uint256 principalAlreadyClaimedByLender;
        uint256 claimablePrincipalNow;
        uint256 claimableInterestNow;
    }

    /**
     * @notice Details of a loan pool where the user is a lender/funder.
     */
    struct LenderPoolContributionDetails {
        address poolAddress;
        uint256 shares;
        uint256 principalAlreadyClaimedByLender;
        uint256 claimablePrincipalNow;
        uint256 claimableInterestNow;
    }

    /**
     * @notice Comprehensive details about a user, including their risk profile,
     * pools they borrowed from, and pools they funded.
     */
    struct UserComprehensiveDetails {
        BorrowerRiskProfile riskProfile;
        BorrowerPoolFullDetails[] borrowedPools;
        LenderPoolContributionDetails[] fundedPools;
    }

    // --- Custom Errors ---
    error Factory__ZeroAddress();
    error Factory__LoanPoolImplementationNotSet();
    error Factory__RiskProfileNotSet(address borrower);
    error Factory__InvalidLoanAmount(uint256 requested, uint256 maxAllowed);
    error Factory__ZeroDuration();
    error Factory__InitializationFailed();
    error Factory__InvalidInterestRate(uint256 interestRateBPS);
    error Factory__InvalidNumberOfInstallments();

    /**
     * @notice Constructor to set up the CredoraPoolFactory.
     * @param _loanPoolImpl The address of the master CredoraLoanPool implementation.
     * @param _acceptedCurrencyAddr The address of the ERC20 token to be used for loans (e.g., USDC).
     */
    constructor(address _loanPoolImpl, address _acceptedCurrencyAddr) {
        if (_loanPoolImpl == address(0)) {
            revert Factory__LoanPoolImplementationNotSet();
        }
        if (_acceptedCurrencyAddr == address(0)) {
            revert Factory__ZeroAddress();
        }
        loanPoolImplementation = _loanPoolImpl;
        acceptedCurrency = IERC20(_acceptedCurrencyAddr);
        // ADMIN_ROLE is granted to msg.sender by Roles constructor
    }

    /**
     * @notice Sets or updates the risk profile for a borrower.
     * @dev Can only be called by an account with the AI_ROLE.
     * The AI provides the maximum loan amount and a suggested interest rate.
     * @param borrower The address of the borrower.
     * @param maxLoanAmount The maximum loan amount the borrower is eligible for.
     * @param interestRateBPS The suggested interest rate in basis points.
     */
    function setRiskProfile(address borrower, uint256 maxLoanAmount, uint256 interestRateBPS) external onlyAI {
        if (borrower == address(0)) {
            revert Factory__ZeroAddress();
        }
        // Add any other validation for amounts if necessary, e.g., interestRateBPS < 100000 (1000%)
        if (interestRateBPS > MAX_INTEREST_RATE_BPS) {
            revert Factory__InvalidInterestRate(interestRateBPS);
        }

        riskProfiles[borrower] = BorrowerRiskProfile({
            maxLoanAmount: maxLoanAmount,
            interestRateBPS: interestRateBPS,
            assessmentTimestamp: uint64(block.timestamp),
            exists: true
        });

        emit RiskProfileSet(borrower, maxLoanAmount, interestRateBPS);
    }

    /**
     * @notice Creates a new loan pool for a borrower.
     * @dev Can only be called by an account with POOL_CREATOR_ROLE.
     * This could be the borrower themselves if they are granted this role after AI assessment,
     * or a dedicated admin/contract.
     * The loan parameters must align with the borrower's set risk profile.
     * @param borrower The address of the borrower for whom the loan pool is being created.
     * @param loanAmount The requested principal amount for the loan.
     * @param durationSeconds The requested duration of the loan in seconds.
     * @param numberOfInstallments The number of installments for the loan.
     * @param poolTokenName The name for the ERC20 token representing shares in this new pool (e.g., "Credora Loan Token XYZ").
     * @param poolTokenSymbol The symbol for the ERC20 token (e.g., "crXYZ").
     * @param purpose The stated purpose of the loan.
     * @return poolAddress The address of the newly created loan pool.
     */
    function createLoanPool(
        address borrower,
        uint256 loanAmount,
        uint256 durationSeconds,
        uint256 numberOfInstallments,
        string calldata poolTokenName,
        string calldata poolTokenSymbol,
        string calldata purpose
    ) external onlyPoolCreator returns (address poolAddress) {
        if (borrower == address(0)) {
            revert Factory__ZeroAddress();
        }
        BorrowerRiskProfile storage profile = riskProfiles[borrower];
        if (!profile.exists) {
            revert Factory__RiskProfileNotSet(borrower);
        }
        if (loanAmount == 0 || loanAmount > profile.maxLoanAmount) {
            revert Factory__InvalidLoanAmount(loanAmount, profile.maxLoanAmount);
        }
        if (durationSeconds == 0) {
            revert Factory__ZeroDuration();
        }
        if (numberOfInstallments == 0 || durationSeconds < numberOfInstallments) {
            revert Factory__InvalidNumberOfInstallments();
        }

        poolAddress = Clones.clone(loanPoolImplementation);
        if (poolAddress == address(0)) {
            revert Factory__InitializationFailed(); // Should not happen with OZ Clones if impl is valid
        }

        // Initialize the cloned pool
        // The admin of the pool is set to this factory for now, can be changed later or made configurable.
        // Alternatively, could be GOVERNANCE_ROLE holder or a dedicated pool admin role.
        ICredoraLoanPool(poolAddress).initialize(
            borrower,
            loanAmount,
            profile.interestRateBPS,
            durationSeconds,
            numberOfInstallments,
            address(acceptedCurrency),
            poolTokenName,
            poolTokenSymbol,
            address(this), // Or another admin address like a governance contract or msg.sender if appropriate
            purpose
        );

        borrowerLoanPools[borrower].push(poolAddress);
        allLoanPools.push(poolAddress);

        emit LoanPoolCreated(
            poolAddress,
            borrower,
            msg.sender, // creator
            loanAmount,
            profile.interestRateBPS,
            durationSeconds,
            numberOfInstallments,
            address(acceptedCurrency),
            purpose
        );

        return poolAddress;
    }

    /**
     * @notice Retrieves all loan pools created for a specific borrower.
     * @param borrower The address of the borrower.
     * @return An array of loan pool addresses.
     */
    function getPoolsByBorrower(address borrower) external view returns (address[] memory) {
        return borrowerLoanPools[borrower];
    }

    /**
     * @notice Retrieves all loan pools created by this factory.
     * @return An array of all loan pool addresses.
     */
    function getAllPools() external view returns (address[] memory) {
        return allLoanPools;
    }

    /**
     * @notice Returns the number of loan pools created by this factory.
     * @return The total count of loan pools.
     */
    function totalPools() external view returns (uint256) {
        return allLoanPools.length;
    }

    /**
     * @notice Retrieves the risk profile and all loan pools created for a specific borrower.
     * @param _borrower The address of the borrower.
     * @return riskProfile The borrower's risk profile.
     * @return pools An array of loan pool addresses created for the borrower.
     */
    function getBorrowerDetails(address _borrower)
        external
        view
        returns (BorrowerRiskProfile memory riskProfile, address[] memory pools)
    {
        return (riskProfiles[_borrower], borrowerLoanPools[_borrower]);
    }

    /**
     * @notice Checks if a risk profile has been set for a specific borrower.
     * @param _borrower The address of the borrower.
     * @return True if a risk profile exists, false otherwise.
     */
    function getBorrowerRiskProfileExists(address _borrower) external view returns (bool) {
        return riskProfiles[_borrower].exists;
    }

    /**
     * @notice Retrieves comprehensive details about a user, including their risk profile,
     * all pools they have borrowed from, and all pools they have funded.
     * @dev This function makes external calls to each relevant loan pool.
     * It is intended for off-chain consumption due to potentially high (though unbilled to caller) computational load.
     * The `CredoraLoanPool.LoanStatus` enum is represented as uint8:
     * 0:PendingInitialization, 1:Funding, 2:Active, 3:Repaid, 4:Defaulted, 5:Cancelled.
     * @param _user The address of the user to fetch details for.
     * @return details A UserComprehensiveDetails struct containing all aggregated information.
     */
    function getUserComprehensiveDetails(address _user)
        external
        view
        returns (UserComprehensiveDetails memory details)
    {
        // 1. Get Risk Profile
        details.riskProfile = riskProfiles[_user];

        // 2. Get Pools Borrowed by User
        address[] memory borrowerPoolAddresses = borrowerLoanPools[_user];
        details.borrowedPools = new BorrowerPoolFullDetails[](borrowerPoolAddresses.length);

        for (uint256 i = 0; i < borrowerPoolAddresses.length; i++) {
            ICredoraLoanPool pool = ICredoraLoanPool(borrowerPoolAddresses[i]);
            // Call getLoanPoolInfo() and assign to the ABI-compatible struct
            // Ensure BorrowerPoolFullDetails is ABI compatible with the return of getLoanPoolInfo()
            // (which is CredoraLoanPool.FullLoanPoolInfo)
            FullLoanPoolInfo memory sourcePoolInfo = pool.getLoanPoolInfo();
            details.borrowedPools[i] = BorrowerPoolFullDetails({
                poolAddress: sourcePoolInfo.poolAddress,
                borrower: sourcePoolInfo.borrower,
                loanAmountPrincipal: sourcePoolInfo.loanAmountPrincipal,
                interestRateBPS: sourcePoolInfo.interestRateBPS,
                durationSeconds: sourcePoolInfo.durationSeconds,
                numberOfInstallments: sourcePoolInfo.numberOfInstallments,
                acceptedCurrency: sourcePoolInfo.acceptedCurrency,
                loanPurpose: sourcePoolInfo.loanPurpose,
                poolTokenName: sourcePoolInfo.poolTokenName,
                poolTokenSymbol: sourcePoolInfo.poolTokenSymbol,
                tokenDecimals: sourcePoolInfo.tokenDecimals,
                poolAdmin: sourcePoolInfo.poolAdmin,
                currentStatus: sourcePoolInfo.currentStatus, // uint8 in both
                totalFundsRaised: sourcePoolInfo.totalFundsRaised,
                loanStartTime: sourcePoolInfo.loanStartTime,
                maturityTime: sourcePoolInfo.maturityTime,
                totalPrincipalRepaid: sourcePoolInfo.totalPrincipalRepaid,
                totalInterestRepaid: sourcePoolInfo.totalInterestRepaid,
                currentInstallmentPaidCount: sourcePoolInfo.currentInstallmentPaidCount,
                installmentIntervalSeconds: sourcePoolInfo.installmentIntervalSeconds,
                installmentPrincipalPerPeriod: sourcePoolInfo.installmentPrincipalPerPeriod,
                installmentInterestPerPeriod: sourcePoolInfo.installmentInterestPerPeriod,
                nextInstallmentDueDate: sourcePoolInfo.nextInstallmentDueDate,
                isPaused: sourcePoolInfo.isPaused
            });
        }

        // 3. Get Pools Funded by User
        // First, count how many pools the user has funded to size the array correctly.
        uint256 fundedCount = 0;
        for (uint256 i = 0; i < allLoanPools.length; i++) {
            ICredoraLoanPool pool = ICredoraLoanPool(allLoanPools[i]);
            // Call getLenderPoolInformation and check shares.
            // Use Local_Credora_LenderPoolInfo for ABI compatibility.
            LenderPoolInfo memory sourceLenderInfo = pool.getLenderPoolInformation(_user);
            Local_Credora_LenderPoolInfo memory lenderInfo;
            lenderInfo.shares = sourceLenderInfo.shares;
            lenderInfo.principalAlreadyClaimedByLender = sourceLenderInfo.principalAlreadyClaimedByLender;
            lenderInfo.claimablePrincipalNow = sourceLenderInfo.claimablePrincipalNow;
            lenderInfo.claimableInterestNow = sourceLenderInfo.claimableInterestNow;

            if (lenderInfo.shares > 0) {
                fundedCount++;
            }
        }

        details.fundedPools = new LenderPoolContributionDetails[](fundedCount);
        uint256 currentFundedIdx = 0;
        if (fundedCount > 0) {
            // Only iterate again if there are pools to populate
            for (uint256 i = 0; i < allLoanPools.length; i++) {
                if (currentFundedIdx == fundedCount) {
                    break; // Optimization: stop if we've found all funded pools
                }
                address currentPoolAddress = allLoanPools[i];
                ICredoraLoanPool pool = ICredoraLoanPool(currentPoolAddress);
                LenderPoolInfo memory sourceLenderInfoLoop = pool.getLenderPoolInformation(_user);
                Local_Credora_LenderPoolInfo memory lenderInfoLoop;
                lenderInfoLoop.shares = sourceLenderInfoLoop.shares;
                lenderInfoLoop.principalAlreadyClaimedByLender = sourceLenderInfoLoop.principalAlreadyClaimedByLender;
                lenderInfoLoop.claimablePrincipalNow = sourceLenderInfoLoop.claimablePrincipalNow;
                lenderInfoLoop.claimableInterestNow = sourceLenderInfoLoop.claimableInterestNow;

                if (lenderInfoLoop.shares > 0) {
                    details.fundedPools[currentFundedIdx] = LenderPoolContributionDetails({
                        poolAddress: currentPoolAddress,
                        shares: lenderInfoLoop.shares,
                        principalAlreadyClaimedByLender: lenderInfoLoop.principalAlreadyClaimedByLender,
                        claimablePrincipalNow: lenderInfoLoop.claimablePrincipalNow,
                        claimableInterestNow: lenderInfoLoop.claimableInterestNow
                    });
                    currentFundedIdx++;
                }
            }
        }
        return details;
    }

    /**
     * @notice Retrieves general details for all loan pools created by this factory.
     * @dev This function makes external calls to each loan pool to fetch its information.
     * It is intended for off-chain consumption.
     * The `CredoraLoanPool.LoanStatus` enum is represented as uint8:
     * 0:PendingInitialization, 1:Funding, 2:Active, 3:Repaid, 4:Defaulted, 5:Cancelled.
     * @return allPoolsDetails An array of structs, each containing details for a loan pool.
     */
    function getAllPoolsGeneralDetails() external view returns (BorrowerPoolFullDetails[] memory allPoolsDetails) {
        uint256 totalPoolsCount = allLoanPools.length;
        allPoolsDetails = new BorrowerPoolFullDetails[](totalPoolsCount);

        for (uint256 i = 0; i < totalPoolsCount; i++) {
            ICredoraLoanPool pool = ICredoraLoanPool(allLoanPools[i]);
            FullLoanPoolInfo memory sourcePoolInfo = pool.getLoanPoolInfo();

            allPoolsDetails[i] = BorrowerPoolFullDetails({
                poolAddress: sourcePoolInfo.poolAddress,
                borrower: sourcePoolInfo.borrower,
                loanAmountPrincipal: sourcePoolInfo.loanAmountPrincipal,
                interestRateBPS: sourcePoolInfo.interestRateBPS,
                durationSeconds: sourcePoolInfo.durationSeconds,
                numberOfInstallments: sourcePoolInfo.numberOfInstallments,
                acceptedCurrency: sourcePoolInfo.acceptedCurrency,
                loanPurpose: sourcePoolInfo.loanPurpose,
                poolTokenName: sourcePoolInfo.poolTokenName,
                poolTokenSymbol: sourcePoolInfo.poolTokenSymbol,
                tokenDecimals: sourcePoolInfo.tokenDecimals,
                poolAdmin: sourcePoolInfo.poolAdmin,
                currentStatus: sourcePoolInfo.currentStatus, // uint8
                totalFundsRaised: sourcePoolInfo.totalFundsRaised,
                loanStartTime: sourcePoolInfo.loanStartTime,
                maturityTime: sourcePoolInfo.maturityTime,
                totalPrincipalRepaid: sourcePoolInfo.totalPrincipalRepaid,
                totalInterestRepaid: sourcePoolInfo.totalInterestRepaid,
                currentInstallmentPaidCount: sourcePoolInfo.currentInstallmentPaidCount,
                installmentIntervalSeconds: sourcePoolInfo.installmentIntervalSeconds,
                installmentPrincipalPerPeriod: sourcePoolInfo.installmentPrincipalPerPeriod,
                installmentInterestPerPeriod: sourcePoolInfo.installmentInterestPerPeriod,
                nextInstallmentDueDate: sourcePoolInfo.nextInstallmentDueDate,
                isPaused: sourcePoolInfo.isPaused
            });
        }
        return allPoolsDetails;
    }

    // --- Struct for Factory Financial Snapshot ---
    /**
     * @notice Aggregated financial and operational snapshot of the entire lending platform.
     * LoanStatus enum mapping: 0:PendingInit, 1:Funding, 2:Active, 3:Repaid, 4:Defaulted, 5:Cancelled
     */
    struct FactorySnapshot {
        uint256 totalPoolsCreated;
        uint256 countFundingPools;
        uint256 countActivePools;
        uint256 countRepaidPools;
        uint256 countDefaultedPools;
        uint256 countCancelledPools;
        uint256 countPendingInitializationPools; // Added for completeness
        uint256 totalValueInFunding; // Sum of 'totalFundsRaised' for pools in 'Funding' status
        uint256 totalPrincipalActiveLoans; // Sum of 'loanAmountPrincipal' for pools in 'Active' status
        uint256 totalOverallPrincipalRepaid; // Sum of 'totalPrincipalRepaid' across all pools
        uint256 totalOverallInterestRepaid; // Sum of 'totalInterestRepaid' across all pools
    }

    /**
     * @notice Retrieves a high-level financial and operational snapshot of the entire factory.
     * @dev Iterates through all pools, making external calls. Intended for off-chain use.
     * @return snapshot A FactorySnapshot struct with aggregated data.
     */
    function getFactoryFinancialSnapshot() external view returns (FactorySnapshot memory snapshot) {
        snapshot.totalPoolsCreated = allLoanPools.length;

        for (uint256 i = 0; i < snapshot.totalPoolsCreated; i++) {
            ICredoraLoanPool pool = ICredoraLoanPool(allLoanPools[i]);
            FullLoanPoolInfo memory poolInfo = pool.getLoanPoolInfo();

            // LoanStatus enum mapping for poolInfo.currentStatus (uint8):
            // 0:PendingInitialization, 1:Funding, 2:Active, 3:Repaid, 4:Defaulted, 5:Cancelled
            if (poolInfo.currentStatus == 0) {
                // PendingInitialization
                snapshot.countPendingInitializationPools++;
            } else if (poolInfo.currentStatus == 1) {
                // Funding
                snapshot.countFundingPools++;
                snapshot.totalValueInFunding += poolInfo.totalFundsRaised;
            } else if (poolInfo.currentStatus == 2) {
                // Active
                snapshot.countActivePools++;
                snapshot.totalPrincipalActiveLoans += poolInfo.loanAmountPrincipal; // or totalFundsRaised if it's guaranteed to be full
            } else if (poolInfo.currentStatus == 3) {
                // Repaid
                snapshot.countRepaidPools++;
            } else if (poolInfo.currentStatus == 4) {
                // Defaulted
                snapshot.countDefaultedPools++;
            } else if (poolInfo.currentStatus == 5) {
                // Cancelled
                snapshot.countCancelledPools++;
            }

            snapshot.totalOverallPrincipalRepaid += poolInfo.totalPrincipalRepaid;
            snapshot.totalOverallInterestRepaid += poolInfo.totalInterestRepaid;
        }

        return snapshot;
    }
}
