export interface MinmoAuthProvider {
    /** Return the current authentication headers for each request attempt. */
    getHeaders(): Promise<Record<string, string>>;
    /**
     * Refresh or invalidate credentials after a 401 response. Concurrent calls
     * are coalesced by HttpClient before one bounded request replay.
     */
    invalidate?(): Promise<void>;
}
export declare const MinmoAuth: {
    apiKey(apiKey: string): MinmoAuthProvider;
    bearer(token: string): MinmoAuthProvider;
    tokenProvider(getToken: () => Promise<string | undefined> | string | undefined): MinmoAuthProvider;
};
//# sourceMappingURL=auth.d.ts.map