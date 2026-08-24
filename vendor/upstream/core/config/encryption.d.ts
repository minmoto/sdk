/**
 * Encryption utilities for secure configuration storage
 *
 * Provides AES-256-GCM encryption for sensitive configuration data
 * with support for key rotation and versioning.
 */
import { EncryptedData } from "./types";
/**
 * Encryption service interface
 */
export interface IEncryptionService {
    encrypt(plaintext: string): EncryptedData;
    decrypt(encrypted: EncryptedData): string;
    rotateKey(data: EncryptedData, newKey: string): EncryptedData;
    isValidKey(key: string): boolean;
}
/**
 * AES-256-GCM Encryption Service
 */
export declare class EncryptionService implements IEncryptionService {
    private readonly key;
    private readonly version;
    constructor(encryptionKey: string);
    /**
     * Derive a key from a password using SHA-256
     */
    private deriveKey;
    /**
     * Encrypt plaintext using AES-256-GCM
     */
    encrypt(plaintext: string): EncryptedData;
    /**
     * Decrypt ciphertext using AES-256-GCM
     */
    decrypt(encrypted: EncryptedData): string;
    /**
     * Re-encrypt data with a new key (for key rotation)
     */
    rotateKey(data: EncryptedData, newKey: string): EncryptedData;
    /**
     * Validate encryption key format
     */
    isValidKey(key: string): boolean;
}
/**
 * Utility for field-level encryption using nested dot-paths
 */
export declare class FieldEncryption {
    private encryptionService;
    constructor(encryptionService: IEncryptionService);
    /**
     * Encrypt fields at nested dot-separated paths in an object.
     * Supports `*` wildcard for array elements (e.g., "config.servers.*.apiKey").
     * Returns a deep clone with sensitive values set to null,
     * and an encrypted map keyed by the concrete dot-path.
     */
    encryptNestedFields<T extends Record<string, any>>(obj: T, fieldPaths: string[]): {
        data: T;
        encrypted: Record<string, EncryptedData>;
    };
    /**
     * Decrypt fields from an encrypted map and restore them on the object.
     * Returns a deep clone with sensitive fields restored.
     */
    decryptNestedFields<T extends Record<string, any>>(obj: T, encryptedMap: Record<string, EncryptedData>): T;
}
/**
 * Create encryption service from environment
 */
export declare function createEncryptionService(key?: string): IEncryptionService;
/**
 * Mock encryption service for testing
 */
export declare class MockEncryptionService implements IEncryptionService {
    encrypt(plaintext: string): EncryptedData;
    decrypt(encrypted: EncryptedData): string;
    rotateKey(data: EncryptedData, _newKey: string): EncryptedData;
    isValidKey(_key: string): boolean;
}
/**
 * Get appropriate encryption service based on environment
 */
export declare function getEncryptionService(key?: string): IEncryptionService;
//# sourceMappingURL=encryption.d.ts.map