import { formatUnits } from "viem";
import { format, formatDistance, formatDistanceToNow, addSeconds, fromUnixTime, differenceInSeconds, isValid } from "date-fns";

/**
 * Formats a BigInt value as a USDC amount string with specified decimals
 * @param value The BigInt value to format
 * @param decimals The number of decimals (default: 6 for USDC)
 * @param addSymbol Whether to add the currency symbol (default: false)
 * @returns Formatted string
 */
export function formatCurrency(
    value: bigint | string | number | null | undefined,
    decimals: number = 6,
    addSymbol: boolean = false
): string {
    if (value === null || value === undefined) return addSymbol ? "$0.00" : "0";

    try {
        // Handle empty strings
        if (typeof value === 'string' && value.trim() === '') return addSymbol ? "$0.00" : "0";

        // Handle BigInt, string or number conversion
        const formattedValue = formatUnits(BigInt(value.toString()), decimals);

        // Format with currency symbol if requested
        if (addSymbol) {
            const numValue = parseFloat(formattedValue);
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            }).format(numValue);
        }

        return formattedValue;
    } catch (error) {
        console.error("Error formatting currency:", error);
        return addSymbol ? "$0.00" : "0";
    }
}

/**
 * Formats a BigInt value as a percentage string
 * @param basisPoints BPS value (100 = 1%)
 * @param includeSymbol Whether to include the % symbol (default: true)
 * @returns Formatted percentage string
 */
export function formatInterestRate(
    basisPoints: bigint | string | number | null | undefined,
    includeSymbol: boolean = true
): string {
    if (basisPoints === null || basisPoints === undefined) return includeSymbol ? "0%" : "0";

    try {
        // Handle empty strings
        if (typeof basisPoints === 'string' && basisPoints.trim() === '') {
            return includeSymbol ? "0%" : "0";
        }

        // Convert to number (BPS is typically a small enough number that we won't have precision issues)
        const bps = typeof basisPoints === 'bigint'
            ? Number(basisPoints)
            : Number(basisPoints);

        // 1 BPS = 0.01%
        const percentage = (bps / 100).toFixed(2);

        return includeSymbol ? `${percentage}%` : percentage;
    } catch (error) {
        console.error("Error formatting interest rate:", error);
        return includeSymbol ? "0%" : "0";
    }
}

/**
 * Formats a BigInt timestamp to a date string using date-fns
 * @param timestamp Unix timestamp in seconds
 * @param formatStr Optional custom date format string (default: 'PPpp' - Mar 15, 2024, 10:30 AM)
 * @returns Formatted date string
 */
export function formatTimestamp(
    timestamp: bigint | string | number | null | undefined,
    formatStr: string = 'PPpp'
): string {
    if (timestamp === null || timestamp === undefined) return "";

    try {
        // Handle empty strings
        if (typeof timestamp === 'string' && timestamp.trim() === '') return "";

        // Convert to number
        const ts = typeof timestamp === 'bigint' ? Number(timestamp) : Number(timestamp);
        if (ts === 0) return "";

        // Convert Unix timestamp (seconds) to date
        const date = fromUnixTime(ts);

        // Validate date before formatting
        if (!isValid(date)) {
            console.warn(`Invalid date from timestamp: ${ts}`);
            return "";
        }

        return format(date, formatStr);
    } catch (error) {
        console.error("Error formatting timestamp:", error);
        return "";
    }
}

/**
 * Formats a timestamp to a relative time string (e.g., "3 days ago", "in 2 hours")
 * @param timestamp Unix timestamp in seconds
 * @returns Relative time string
 */
export function formatRelativeTime(timestamp: bigint | string | number | null | undefined): string {
    if (timestamp === null || timestamp === undefined) return "";

    try {
        // Handle empty strings
        if (typeof timestamp === 'string' && timestamp.trim() === '') return "";

        // Convert to number
        const ts = typeof timestamp === 'bigint' ? Number(timestamp) : Number(timestamp);
        if (ts === 0) return "";

        const date = fromUnixTime(ts);

        // Validate date before formatting
        if (!isValid(date)) {
            console.warn(`Invalid date from timestamp: ${ts}`);
            return "";
        }

        // Compare to current time
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        console.error("Error formatting relative time:", error);
        return "";
    }
}

/**
 * Formats a duration in seconds to a human-readable string using date-fns
 * @param seconds Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: bigint | string | number | null | undefined): string {
    if (seconds === null || seconds === undefined) return "";

    try {
        // Handle empty strings
        if (typeof seconds === 'string' && seconds.trim() === '') return "";

        // Convert to number
        const secs = typeof seconds === 'bigint' ? Number(seconds) : Number(seconds);
        if (secs === 0) return "0";

        // Use a base date and add the seconds to it
        const baseDate = new Date(0); // Unix epoch start
        const targetDate = addSeconds(baseDate, secs);

        // Calculate the formatted distance between the dates
        return formatDistance(targetDate, baseDate, {
            includeSeconds: true
        });
    } catch (error) {
        console.error("Error formatting duration:", error);
        return "";
    }
}

/**
 * Alternative format for durations that uses days, hours, minutes format
 * @param seconds Duration in seconds
 * @param includeSeconds Whether to include seconds in output (default: false)
 * @returns Formatted duration string (e.g., "2d 5h 30m")
 */
export function formatDurationCompact(
    seconds: bigint | string | number | null | undefined,
    includeSeconds: boolean = false
): string {
    if (seconds === null || seconds === undefined) return "";

    try {
        // Handle empty strings
        if (typeof seconds === 'string' && seconds.trim() === '') return "";

        // Convert to number
        const secs = typeof seconds === 'bigint' ? Number(seconds) : Number(seconds);
        if (secs === 0) return "0";

        const days = Math.floor(secs / 86400);
        const hours = Math.floor((secs % 86400) / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const remainingSeconds = Math.floor(secs % 60);

        // Build output based on significant time units
        if (days > 0) {
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return includeSeconds ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
        } else {
            return `${remainingSeconds}s`;
        }
    } catch (error) {
        console.error("Error formatting duration compact:", error);
        return "";
    }
}

/**
 * Formats a date range between two timestamps
 * @param startTimestamp Start Unix timestamp in seconds 
 * @param endTimestamp End Unix timestamp in seconds
 * @param formatStr Optional date format string (default: 'PP' - Mar 15, 2024)
 * @returns Formatted date range string
 */
export function formatDateRange(
    startTimestamp: bigint | string | number | null | undefined,
    endTimestamp: bigint | string | number | null | undefined,
    formatStr: string = 'PP'
): string {
    if (startTimestamp === null || startTimestamp === undefined ||
        endTimestamp === null || endTimestamp === undefined) {
        return "";
    }

    try {
        // Handle empty strings
        if ((typeof startTimestamp === 'string' && startTimestamp.trim() === '') ||
            (typeof endTimestamp === 'string' && endTimestamp.trim() === '')) {
            return "";
        }

        // Convert to numbers
        const startTs = typeof startTimestamp === 'bigint' ? Number(startTimestamp) : Number(startTimestamp);
        const endTs = typeof endTimestamp === 'bigint' ? Number(endTimestamp) : Number(endTimestamp);

        if (startTs === 0 || endTs === 0) return "";

        const startDate = fromUnixTime(startTs);
        const endDate = fromUnixTime(endTs);

        // Validate dates
        if (!isValid(startDate) || !isValid(endDate)) {
            console.warn(`Invalid date range: ${startTs} - ${endTs}`);
            return "";
        }

        return `${format(startDate, formatStr)} - ${format(endDate, formatStr)}`;
    } catch (error) {
        console.error("Error formatting date range:", error);
        return "";
    }
}

/**
 * Formats a number with commas for thousands
 * @param value The number to format
 * @param maximumFractionDigits Maximum fraction digits to display
 * @returns Formatted number string
 */
export function formatNumber(
    value: bigint | string | number | null | undefined,
    maximumFractionDigits: number = 0
): string {
    if (value === null || value === undefined) return "0";

    try {
        // Handle empty strings
        if (typeof value === 'string' && value.trim() === '') return "0";

        // Convert to number
        const num = typeof value === 'bigint' ? Number(value) : Number(value);

        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits
        }).format(num);
    } catch (error) {
        console.error("Error formatting number:", error);
        return "0";
    }
} 