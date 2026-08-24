/**
 * Destination Address Parser
 *
 * Validates Bitcoin onchain addresses, Lightning invoices, and Lightning addresses.
 * Supports Bitcoin addresses, BOLT11 Lightning invoices, and Lightning addresses (user@domain.com).
 *
 * Network support:
 * - Mainnet: lnbc invoices and bc1/1/3 addresses
 * - Regtest: lnbcrt invoices and bcrt1 addresses
 * - Lightning addresses are network-agnostic (resolved invoice is validated separately)
 */
import { BitcoinNetwork } from "../types/bitcoin";
/**
 * Destination address types
 */
export declare enum DestinationType {
    BITCOIN_ADDRESS = "BITCOIN_ADDRESS",
    BOLT11_INVOICE = "BOLT11_INVOICE",
    LIGHTNING_ADDRESS = "LIGHTNING_ADDRESS"
}
/**
 * Destination address validation result
 */
export interface ParsedAddress {
    /** The original raw input value */
    raw: string;
    /** The type of destination (Bitcoin address or Lightning invoice) */
    type?: DestinationType;
    /** The detected network (mainnet/regtest) */
    network?: BitcoinNetwork;
    /** Whether the address format is valid */
    isValid: boolean;
    /** Whether the address network matches the current environment */
    isValidForEnvironment: boolean;
    /** Error message if validation failed */
    error?: string;
}
/**
 * Detect the network from a BOLT11 Lightning invoice
 *
 * @param invoice - The BOLT11 invoice to check
 * @returns The network type or undefined if not detected
 */
export declare function detectInvoiceNetwork(invoice: string): BitcoinNetwork | undefined;
/**
 * Check if a string is a valid BOLT11 invoice format
 *
 * @param value - The value to check
 * @returns true if the value is a valid BOLT11 invoice format
 */
export declare function isBolt11Invoice(value: string): boolean;
/**
 * Detect the network from a Bitcoin address
 *
 * @param address - The Bitcoin address to check
 * @returns The network type or undefined if not detected
 */
export declare function detectAddressNetwork(address: string): BitcoinNetwork | undefined;
export declare function hasValidBech32Checksum(value: string, maxLength?: number | false): boolean;
/**
 * Check if a string is a valid Bitcoin address format
 *
 * @param value - The value to check
 * @returns true if the value is a valid Bitcoin address format
 */
export declare function isBitcoinAddressFormat(value: string): boolean;
/**
 * Check if a string is a valid Lightning address format (user@domain.com)
 *
 * @param value - The value to check
 * @returns true if the value is a valid Lightning address format
 */
export declare function isLightningAddress(value: string): boolean;
/**
 * Parse and validate a destination address (Bitcoin address, Lightning invoice, or Lightning address)
 *
 * Validates addresses and invoices for mainnet and regtest only.
 * Both Bitcoin addresses and Lightning invoices are environment-aware.
 *
 * @param input - The address or invoice string to parse
 * @returns Parsed address information including type, network, validity, and environment match
 *
 * @example
 * ```typescript
 * // Lightning invoices - mainnet
 * parseDestinationAddress("lnbc100n1...")
 * // => { raw: "lnbc...", type: BOLT11_INVOICE, network: MAINNET, isValid: true, isValidForEnvironment: true }
 *
 * // Lightning invoices - regtest
 * parseDestinationAddress("lnbcrt100n1...")
 * // => { raw: "lnbcrt...", type: BOLT11_INVOICE, network: REGTEST, isValid: true, isValidForEnvironment: true }
 *
 * // Bitcoin addresses - environment-aware validation
 * // In production environment (mainnet)
 * parseDestinationAddress("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")
 * // => { raw: "bc1...", type: BITCOIN_ADDRESS, network: MAINNET, isValid: true, isValidForEnvironment: true }
 *
 * parseDestinationAddress("bcrt1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080")
 * // => { raw: "bcrt1...", type: BITCOIN_ADDRESS, network: REGTEST, isValid: true, isValidForEnvironment: false,
 * //      error: "Regtest addresses are not allowed in production environment" }
 *
 * // In dev/staging environment (regtest wallet network)
 * parseDestinationAddress("bcrt1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080")
 * // => { raw: "bcrt1...", type: BITCOIN_ADDRESS, network: REGTEST, isValid: true, isValidForEnvironment: true }
 * ```
 */
export declare function parseDestinationAddress(input: string, expectedNetwork?: BitcoinNetwork): ParsedAddress;
//# sourceMappingURL=destination-parser.d.ts.map