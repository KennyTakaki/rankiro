/**
 * Date utility functions
 */

export function isValidDate(date: unknown): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
}

export function formatDateForAPI(date: Date): string {
    return date.toISOString();
}

export function parseAPIDate(dateString: string): Date {
    const date = new Date(dateString);
    if (!isValidDate(date)) {
        throw new Error(`Invalid date string: ${dateString}`);
    }
    return date;
}

export function getDateRange(days: number): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    return { startDate, endDate };
}

export function getDaysDifference(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function isWithinDateRange(
    date: Date,
    range: { startDate: Date; endDate: Date }
): boolean {
    return date >= range.startDate && date <= range.endDate;
}