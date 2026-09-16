import type { MinmoAuthProvider } from "./auth";
export declare class MinmoApiError extends Error {
    readonly status: number;
    readonly responseBody?: unknown;
    readonly code?: string;
    constructor(message: string, status: number, responseBody?: unknown);
}
export declare class MinmoSdkError extends Error {
    readonly code: string;
    readonly status?: number | undefined;
    readonly requestId?: string | undefined;
    readonly retryable: boolean;
    readonly responseBody?: unknown;
    constructor(message: string, code: string, status?: number | undefined, requestId?: string | undefined, retryable?: boolean, responseBody?: unknown);
}
export declare class MinmoAuthenticationError extends MinmoSdkError {
    constructor(message?: string, status?: number, responseBody?: unknown, requestId?: string);
}
export declare class MinmoAuthorizationError extends MinmoSdkError {
    constructor(message?: string, status?: number, responseBody?: unknown, requestId?: string);
}
export declare class MinmoRateLimitError extends MinmoSdkError {
    constructor(message?: string, status?: number, responseBody?: unknown, requestId?: string);
}
export declare class MinmoTransportError extends MinmoSdkError {
    constructor(message: string, cause?: unknown);
}
export type HttpClientOptions = {
    baseUrl: string;
    auth?: MinmoAuthProvider;
    fetch?: FetchLike;
    timeoutMs?: number;
};
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export declare class HttpClient {
    readonly baseUrl: string;
    private readonly auth?;
    private readonly fetchFn;
    private readonly timeoutMs;
    private authInvalidationPromise;
    constructor(options: HttpClientOptions);
    request<T>(path: string, init?: RequestInit): Promise<T>;
    /** Returns an unconsumed successful response for streaming/binary callers. */
    requestResponse(path: string, init?: RequestInit): Promise<Response>;
    fetchResponse(path: string, init?: RequestInit): Promise<Response>;
    private requestWithAuthRetry;
    private responseWithAuthRetry;
    private createResponseError;
    private invalidateAuth;
    private parseBody;
}
//# sourceMappingURL=http.d.ts.map