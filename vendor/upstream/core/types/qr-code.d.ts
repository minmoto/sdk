/**
 * Agent swap-link QR code contract
 * Shared between the API (which renders and serves the files) and the clients
 * that download them.
 */
export declare const AGENT_QR_CODE_FORMATS: readonly ["png", "jpg", "pdf"];
export type AgentQrCodeFormat = (typeof AGENT_QR_CODE_FORMATS)[number];
export declare const AGENT_QR_CODE_MIME_TYPES: Record<AgentQrCodeFormat, string>;
export declare const AGENT_QR_CODE_EXTENSIONS: Record<AgentQrCodeFormat, string>;
export declare const AGENT_QR_CODE_DEFAULT_FORMAT: AgentQrCodeFormat;
/**
 * Rendered size in pixels. The upstream generator treats `size` as a minimum,
 * so the returned image can be slightly larger than requested.
 */
export declare const AGENT_QR_CODE_MIN_SIZE = 200;
export declare const AGENT_QR_CODE_MAX_SIZE = 2000;
export declare const AGENT_QR_CODE_DEFAULT_SIZE = 1000;
export declare const isAgentQrCodeFormat: (value: unknown) => value is AgentQrCodeFormat;
/**
 * Builds the download filename for an agent's swap-link QR code.
 *
 * The label is slugified so the value is safe to use in a
 * `Content-Disposition` header and on any device filesystem.
 *
 * @param label - Agent name or ID to base the filename on
 * @param format - The requested output format
 * @returns A filesystem-safe filename, e.g. `minmo-swap-qr-jane-doe.png`
 */
export declare const buildAgentQrCodeFilename: (label: string | undefined, format: AgentQrCodeFormat) => string;
//# sourceMappingURL=qr-code.d.ts.map