/**
 * Validation utility functions
 */

export function isValidId(id: unknown): id is string {
    return typeof id === 'string' && id.length > 0 && id.trim() === id;
}

export function isValidEmail(email: unknown): email is string {
    if (typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidUrl(url: unknown): url is string {
    if (typeof url !== 'string') return false;

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isPositiveNumber(value: unknown): value is number {
    return typeof value === 'number' && value >= 0 && !isNaN(value);
}

export function isValidPercentage(value: unknown): value is number {
    return typeof value === 'number' && value >= 0 && value <= 1 && !isNaN(value);
}

export function sanitizeString(input: unknown): string {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
}

export function validateRequired<T>(value: T, fieldName: string): T {
    if (value === null || value === undefined || value === '') {
        throw new Error(`${fieldName} is required`);
    }
    return value;
}