export declare enum Currency {
    BTC = "BTC",
    GBP = "GBP",
    INR = "INR",
    KES = "KES",
    MUR = "MUR",
    MWK = "MWK",
    MZN = "MZN",
    NGN = "NGN",
    PKR = "PKR",
    USDT = "USDT",
    USD = "USD",
    ZAR = "ZAR",
    UNRECOGNIZED = "UNRECOGNIZED"
}
export interface CurrencyPair {
    base: Currency;
    target: Currency;
}
export declare function makeCurrencyPair(baseCurrency: Currency, targetCurrency: Currency): CurrencyPair;
export declare function currencyPairKey(pair: CurrencyPair): string;
export declare function parseCurrencyPairKey(key: string): CurrencyPair | null;
//# sourceMappingURL=currency.d.ts.map