export interface LightningAddressMetadata {
    address: string;
    username: string;
    domain: string;
    callback: string;
    minSendable: number;
    maxSendable: number;
    metadata: string;
    tag: string;
    commentAllowed?: number;
    allowsNostr?: boolean;
    nostrPubkey?: string;
}
export interface LightningAddressInvoiceResponse {
    invoice: string;
}
export type LightningAddressValidationResult = (LightningAddressMetadata & {
    valid: true;
}) | {
    valid: false;
    error: string;
    statusCode: 400 | 422;
};
export interface LightningAddressClient {
    address: string;
    username?: string;
    domain?: string;
    nostrPubkey?: string;
    lnurlpData?: {
        rawData?: {
            callback?: string;
            minSendable?: number;
            maxSendable?: number;
            metadata?: string;
            tag?: string;
            commentAllowed?: number;
            allowsNostr?: boolean;
        };
    };
    fetch(): Promise<void>;
    requestInvoice(args: {
        satoshi: number;
    }): Promise<{
        paymentRequest: string;
    }>;
}
export type LightningAddressClientFactory = (address: string) => LightningAddressClient | Promise<LightningAddressClient>;
export declare function lightningAddressToLnurlpUrl(address: string): string;
export declare function resolveLightningAddress(address: string, createClient?: LightningAddressClientFactory): Promise<LightningAddressMetadata>;
export declare function getLightningAddressValidationErrorMessage(error: unknown): string;
export declare function validateLightningAddress(address: string | null | undefined, createClient?: LightningAddressClientFactory): Promise<LightningAddressValidationResult>;
export declare function fetchLightningAddressInvoice(address: string, amountMsats: number, metadata?: LightningAddressMetadata, createClient?: LightningAddressClientFactory): Promise<LightningAddressInvoiceResponse>;
//# sourceMappingURL=lightning-address.d.ts.map