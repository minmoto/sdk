export interface MinmoAuthProvider {
    getHeaders(): Promise<Record<string, string>>;
    invalidate?(): Promise<void>;
}
export declare const MinmoAuth: {
    apiKey(apiKey: string): MinmoAuthProvider;
    bearer(token: string): MinmoAuthProvider;
    tokenProvider(getToken: () => Promise<string | undefined> | string | undefined): MinmoAuthProvider;
};
//# sourceMappingURL=auth.d.ts.map