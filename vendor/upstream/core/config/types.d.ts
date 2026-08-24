export interface EncryptedData {
    ciphertext: string;
    iv: string;
    authTag: string;
    version: number;
    algorithm?: string;
}
export declare enum ConfigurationErrorCode {
    ENCRYPTION_FAILED = "ENCRYPTION_FAILED",
    DECRYPTION_FAILED = "DECRYPTION_FAILED",
    INVALID_ENCRYPTION_KEY = "INVALID_ENCRYPTION_KEY"
}
export declare class ConfigurationError extends Error {
    readonly code: ConfigurationErrorCode;
    readonly details?: unknown;
    constructor(code: ConfigurationErrorCode, message: string, details?: unknown);
}
//# sourceMappingURL=types.d.ts.map