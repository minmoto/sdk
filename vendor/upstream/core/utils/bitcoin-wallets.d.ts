/**
 * Registry of external Bitcoin/Lightning wallet apps a payment can be handed
 * off to, plus the deep-link helpers for doing so.
 *
 * **This registry is for iOS.** Android should use `buildLightningPaymentUri`
 * and let the OS "Open with" chooser pick the wallet — it lists every installed
 * handler with real names and icons, and needs no table to be maintained.
 *
 * iOS has no such chooser: `lightning:` opens whichever app most recently
 * claimed the scheme, with no way for the user to change it. Per-wallet schemes
 * are the documented workaround, and collecting them is the entire purpose of
 * https://github.com/tando-me/bitcoin-wallet-compatibility, whose `uri-schemes.md`
 * states it exists "so that you can give your (iOS) users choices".
 *
 * `uriPrefix` therefore follows that project's **iOS** form, `<scheme>://`, not
 * its `android:scheme` column (`walletofsatoshi:lightning:` and friends), which
 * applies only to the platform that no longer needs this table.
 *
 * The data is hand-transcribed and only partly verified on real devices — the
 * upstream Android entry for Blink, for instance, opens the app but cannot pay.
 * Treat an unverified row as a guess until it has been tapped through on a
 * device (upstream ships `uri-test.html` for exactly this).
 *
 * Every `scheme` here must also appear in `ios.infoPlist.LSApplicationQueriesSchemes`,
 * or `canOpenURL` reports the wallet as missing even when installed.
 */
export interface BitcoinWalletApp {
    /** Stable identifier, safe to persist. */
    id: string;
    /** Display name shown to the user. */
    name: string;
    /** Scheme probed for installation and declared in native allowlists. */
    scheme: string;
    /** URI prefix a bare BOLT11 invoice is appended to. */
    uriPrefix: string;
}
/**
 * Identifier for the generic fallback entry. Fires the bare `lightning:` scheme
 * and lets the OS resolve it, which reaches any wallet registering the standard
 * scheme (Coinos, Electrum, Minibits, ShockWallet, Volt, Lexe, and Blockstream
 * Green on iOS) without each needing its own registry row.
 */
export declare const GENERIC_LIGHTNING_WALLET_ID = "generic-lightning";
export declare const GENERIC_LIGHTNING_WALLET: BitcoinWalletApp;
/** Named wallets, ordered by expected usage before install detection. */
export declare const BITCOIN_WALLET_APPS: BitcoinWalletApp[];
/** Named wallets plus the generic fallback, in display order. */
export declare const ALL_BITCOIN_WALLET_OPTIONS: BitcoinWalletApp[];
/** Every scheme needing a native allowlist entry. */
export declare const BITCOIN_WALLET_SCHEMES: string[];
export declare const findBitcoinWalletById: (walletId: string) => BitcoinWalletApp | undefined;
/** URL used to probe whether a wallet is installed. */
export declare const buildWalletProbeUrl: (wallet: BitcoinWalletApp) => string;
/**
 * Builds the deep link that opens `wallet` with `invoice` prefilled, ready to
 * pay in one tap.
 *
 * The invoice is lowercased and passed through unencoded: BOLT11 is bech32, so
 * it only ever contains URI-safe characters, and percent-encoding breaks wallets
 * that parse the tail of the URI literally.
 */
export declare const buildWalletPaymentUri: (wallet: BitcoinWalletApp, invoice: string) => string;
/**
 * Builds the standard BOLT11 payment URI, addressed to no wallet in particular.
 *
 * This is the Android path. Android resolves it to every installed handler and
 * shows the system "Open with" chooser, where the user picks once and can set a
 * default. It needs no registry, surfaces wallets we have never heard of, and
 * uses the entry point every wallet declares for payments — so it sidesteps the
 * per-wallet scheme quirks the iOS table has to track by hand.
 */
export declare const buildLightningPaymentUri: (invoice: string) => string;
//# sourceMappingURL=bitcoin-wallets.d.ts.map