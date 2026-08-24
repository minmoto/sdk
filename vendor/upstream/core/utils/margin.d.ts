/**
 * Margin-aware conversion between fiat and Bitcoin amounts.
 * Single source of truth for swap margin logic used by API and clients.
 *
 * Semantics:
 * - Fiat amounts are in smallest unit (e.g. cents); backend uses 2 decimal places (fiatMain = cents/100).
 * - Exchange rate is in main fiat unit per BTC (e.g. 50_000 = 50,000 USD per BTC).
 * - Margin is in basis points (100 bp = 1%). Agent keeps the margin (customer gets less BTC on onramp, pays more BTC on offramp).
 *
 * Minor units: This module assumes 2 decimal places (FIAT_MAIN_UNIT_DIVISOR = 100), i.e. cents for USD/EUR.
 * Currencies with no minor units (e.g. JPY) or different precision would require a different divisor if supported.
 * Callers must pass marginBp in [0, 10000] and exchangeRate > 0; validation is not enforced here.
 */
import { SwapType } from "../types/agent";
/**
 * Calculate satoshis from fiat amount (smallest unit) using exchange rate and agent margin.
 * Used when fiat is the source of truth (onramp with on-chain, offramp).
 * Uses rate in smallest unit per BTC so sub-unit fiat (e.g. 50 pence) yields non-zero sats.
 *
 * @param fiatAmountCents - Fiat in smallest unit (e.g. cents, pence)
 * @param exchangeRate - Main fiat unit per BTC (e.g. 50_000 GBP/BTC)
 * @param swapType - ONRAMP: user gets fewer sats; OFFRAMP: user sends more sats for same fiat
 * @param marginBp - Margin in basis points (100 = 1%)
 */
export declare function calculateSatsFromFiatWithMargin(fiatAmountCents: string | number | bigint, exchangeRate: number, swapType: SwapType, marginBp: number): bigint;
/**
 * Calculate fiat amount (smallest unit) from satoshis using exchange rate and agent margin.
 * Used when BTC is the source of truth (e.g. onramp with Lightning invoice).
 *
 * @param satoshis - Amount in satoshis
 * @param exchangeRate - Main fiat unit per BTC
 * @param swapType - ONRAMP: fiat equivalent is higher (user "pays" more fiat for that BTC); OFFRAMP: lower
 * @param marginBp - Margin in basis points
 * @returns Fiat in smallest unit (cents) as string
 */
export declare function calculateFiatFromSatsWithMargin(satoshis: bigint | number, exchangeRate: number, swapType: SwapType, marginBp: number): string;
/**
 * Derive the effective exchange rate (fiat per BTC) that the customer sees after margin.
 * For UI display: "Customer sees ~1 BTC = X fiat".
 *
 * @param baseRate - Spot rate in main fiat unit per BTC
 * @param swapType - ONRAMP: customer gets fewer sats per fiat (worse rate); OFFRAMP: less fiat per BTC
 * @param marginBp - Margin in basis points
 */
export declare function deriveEffectiveRateWithMargin(baseRate: number, swapType: SwapType, marginBp: number): number;
//# sourceMappingURL=margin.d.ts.map