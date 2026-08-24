/**
 * Error handling utilities for type-safe error management
 */
/**
 * Type guard to check if error is an instance of Error
 */
export declare function isError(error: unknown): error is Error;
/**
 * Type guard to check if error has a message property
 */
export declare function hasErrorMessage(error: unknown): error is {
    message: string;
};
/**
 * Safely extract error message from unknown error
 */
export declare function getErrorMessage(error: unknown): string;
/**
 * Safely extract error stack trace from unknown error
 */
export declare function getErrorStack(error: unknown): string | undefined;
/**
 * Create a standardized error object from unknown error
 */
export interface StandardError {
    message: string;
    stack?: string;
    name?: string;
    code?: string | number;
}
export declare function standardizeError(error: unknown): StandardError;
/**
 * Utility for creating error handlers with consistent logging
 */
export declare function createErrorHandler(context: string, logger?: {
    error: (message: string, ...meta: unknown[]) => void;
}): (error: unknown, additionalContext?: string) => StandardError;
/**
 * Branded type for error codes
 */
export type ErrorCode = string & {
    readonly __brand: "ErrorCode";
};
/**
 * Create a branded error code
 */
export declare function createErrorCode(code: string): ErrorCode;
/**
 * Common error codes used across the application
 */
export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: ErrorCode;
    readonly AUTHENTICATION_ERROR: ErrorCode;
    readonly AUTHORIZATION_ERROR: ErrorCode;
    readonly NOT_FOUND: ErrorCode;
    readonly CONFLICT: ErrorCode;
    readonly INTERNAL_ERROR: ErrorCode;
    readonly NETWORK_ERROR: ErrorCode;
    readonly TIMEOUT_ERROR: ErrorCode;
    readonly RATE_LIMIT_ERROR: ErrorCode;
    readonly INVALID_REQUEST: ErrorCode;
    readonly SERVICE_UNAVAILABLE: ErrorCode;
};
/**
 * Application-specific error class with branded error codes
 */
export declare class AppError extends Error {
    readonly code: ErrorCode;
    readonly context?: Record<string, unknown>;
    constructor(message: string, code: ErrorCode, context?: Record<string, unknown>);
}
/**
 * Utility to check if error is an AppError
 */
export declare function isAppError(error: unknown): error is AppError;
/**
 * Result type for operations that can fail
 */
export type Result<T, E = StandardError> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
/**
 * Create a success result
 */
export declare function createSuccess<T>(data: T): Result<T, never>;
/**
 * Create an error result
 */
export declare function createError<E = StandardError>(error: E): Result<never, E>;
/**
 * Safely execute an async operation and return a Result
 */
export declare function safeAsync<T>(operation: () => Promise<T>): Promise<Result<T>>;
/**
 * Safely execute a synchronous operation and return a Result
 */
export declare function safeSync<T>(operation: () => T): Result<T>;
//# sourceMappingURL=error-handling.d.ts.map