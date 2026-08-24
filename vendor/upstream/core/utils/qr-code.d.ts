/**
 * QR code generation utilities
 *
 * Builds request URLs for the QRCode Monkey generator, which renders the
 * branded QR codes agents share for their swap links.
 */
import { type AgentQrCodeFormat } from "../types/qr-code";
export declare const QR_CODE_MONKEY_BASE_URL = "https://api.qrcode-monkey.com";
/**
 * Formats the upstream generator can actually produce.
 *
 * Note that `jpg` is deliberately absent. Requesting `file=jpg` upstream
 * returns a PNG payload behind an `image/jpeg` content type, so JPEG output is
 * produced by transcoding a PNG on the client instead.
 */
export type QrCodeMonkeyFileParam = "png" | "pdf";
/**
 * Visual configuration passed to the generator's `config` parameter.
 * Only the options Minmo actually sets are modelled here.
 */
export interface QrCodeMonkeyConfig {
    body?: string;
    eye?: string;
    eyeBall?: string;
    bodyColor?: string;
    bgColor?: string;
    eye1Color?: string;
    eye2Color?: string;
    eye3Color?: string;
    eyeBall1Color?: string;
    eyeBall2Color?: string;
    eyeBall3Color?: string;
    logo?: string;
    logoMode?: "default" | "clean";
}
export interface QrCodeMonkeyUrlOptions {
    /** The payload the QR code encodes, such as an agent swap link */
    data: string;
    /** Desired output format. `jpg` is fetched as PNG and transcoded client-side */
    format: AgentQrCodeFormat;
    /** Rendered size in pixels. Treated as a minimum by the generator */
    size?: number;
    /** Visual configuration overrides merged over the Minmo defaults */
    config?: QrCodeMonkeyConfig;
    /** Override the generator host, primarily for tests */
    baseUrl?: string;
}
/**
 * Minmo brand colours used in generated QR codes.
 * Mirrors `@minmo/theme` tokens, duplicated here so `@minmo/core` stays
 * dependency-free.
 */
export declare const MINMO_QR_COLORS: {
    /** Near-black body, matching the Minmo dark surface */
    readonly body: "#0a0a0a";
    readonly background: "#FFFFFF";
};
/**
 * The three logo layers, mapped onto the QR eyes.
 *
 * These are hue-matched to the logo and pushed as bright as scanning allows.
 * Scanners binarise the image before locating the finder patterns, and the
 * logo's own shades sit too close to white to survive that step - the mint
 * green is only 1.29:1 against the background and would be read as blank,
 * breaking detection outright.
 *
 * Saturation is raised for vividness and lightness taken to just under a 0.30
 * relative-luminance ceiling on the frames (0.20 on the balls), which is the
 * brightest that still binarises reliably as dark.
 */
export declare const MINMO_QR_EYE_COLORS: {
    readonly green: {
        readonly frame: "#0eab24";
        readonly ball: "#0c8e1e";
    };
    readonly grey: {
        readonly frame: "#9b9485";
        readonly ball: "#827a6a";
    };
    readonly orange: {
        readonly frame: "#d97f00";
        readonly ball: "#b56900";
    };
};
/**
 * Largest share of the QR's width the centre logo may cover.
 *
 * Measured, not guessed: decoding an agent swap link survives a centred mark
 * up to 26% of the width and fails at 28%. This sits below that cliff so real
 * scans - at an angle, in poor light, off a print - keep working.
 */
export declare const MINMO_QR_LOGO_WIDTH_RATIO = 0.22;
/** Share of the white logo patch taken up by the mark itself */
export declare const MINMO_QR_LOGO_INSET_RATIO = 0.78;
/**
 * Minmo's branded QR styling.
 *
 * The body stays near-black on white. Colour lives in the eyes instead, which
 * carries the brand without weakening the contrast scanners rely on.
 *
 * Every value here must appear in the allowlists below - the generator answers
 * `200 OK` with a QR whose body is silently missing when given a style name it
 * does not recognise.
 */
export declare const MINMO_QR_CODE_CONFIG: QrCodeMonkeyConfig;
/**
 * Body styles verified to render a complete QR code.
 *
 * An unrecognised value does not fail loudly - the generator returns a QR with
 * only the eyes drawn, which cannot be scanned. Anything not listed here is
 * rejected before the request goes out.
 */
export declare const QR_CODE_BODY_STYLES: readonly ["square", "round", "rounded-in", "circle", "dot", "mosaic", "star", "diamond"];
export declare const isQrCodeBodyStyle: (value: string) => boolean;
/**
 * Maps a requested output format to the format actually asked of the generator.
 *
 * @param format - The format the caller wants
 * @returns The upstream `file` parameter to request
 */
export declare const getQrCodeMonkeyFileParam: (format: AgentQrCodeFormat) => QrCodeMonkeyFileParam;
/**
 * Clamps a requested size into the supported range.
 *
 * @param size - Requested pixel size, if any
 * @returns A size within the supported bounds
 */
export declare const clampQrCodeSize: (size?: number) => number;
/**
 * Builds a QRCode Monkey request URL.
 *
 * @param options - The payload, format, size, and styling to request
 * @returns A fully encoded GET URL, or null when there is no data to encode
 */
export declare const buildQrCodeMonkeyUrl: (options: QrCodeMonkeyUrlOptions) => string | null;
//# sourceMappingURL=qr-code.d.ts.map