import { type SwapType } from "../types/agent";
import { BitcoinNetwork } from "../types/bitcoin";
import { DestinationType, type ParsedAddress } from "./destination-parser";
export declare class DestinationAddressValidationError extends Error {
    constructor(message: string);
}
export type ExpectedLightningInvoiceAmount = {
    type: "msats";
    msats: unknown;
} | {
    type: "fiat_with_margin";
    fiatAmount: unknown;
    exchangeRate: unknown;
    swapType: SwapType;
    marginBp: unknown;
};
export type ValidateInvoiceDestinationInput = {
    destination: unknown;
    expectedAmount: ExpectedLightningInvoiceAmount;
    expectedNetwork?: BitcoinNetwork;
    amountToleranceMsats?: number;
};
export type ValidateOnchainDestinationInput = {
    destination: unknown;
    allowedTypes?: DestinationType[];
    expectedNetwork?: BitcoinNetwork;
    expectedInvoiceAmount?: ExpectedLightningInvoiceAmount;
    amountToleranceMsats?: number;
};
export type OnchainDestinationValidation = ParsedAddress & {
    raw: string;
    invoiceValidation?: LightningInvoiceDestinationValidation;
};
export type LightningInvoiceDestinationValidation = {
    destination: string;
    invoiceNetwork: BitcoinNetwork;
    expectedNetwork: BitcoinNetwork;
    invoiceMsats: number;
    expectedMsats: number;
    amountDeltaMsats: number;
};
export declare function validateInvoiceDestination({ destination, expectedAmount, expectedNetwork, amountToleranceMsats, }: ValidateInvoiceDestinationInput): LightningInvoiceDestinationValidation;
export declare function validateOnchainDestination({ destination, allowedTypes, expectedNetwork, expectedInvoiceAmount, amountToleranceMsats, }: ValidateOnchainDestinationInput): OnchainDestinationValidation;
//# sourceMappingURL=destination-validation.d.ts.map