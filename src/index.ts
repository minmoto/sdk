import {
  AgentSelectionMode,
  AgentStatus,
  AgentTeamAssociationStatus,
  AgentTeamAssociationVisibility,
  AnalyticsBucket,
  ApiKeyCapability,
  ApiKeyInvalidReason,
  ApiKeyResourceScope,
  BitcoinNetwork,
  ConfirmationRole,
  Currency,
  DisputeResolution,
  EscrowEventType,
  EscrowNetwork,
  EventConnectionState,
  FxRateProvider,
  MemoryEventCursorStore,
  MinmoApiError,
  MinmoAuthenticationError,
  MinmoAuthorizationError,
  MinmoRateLimitError,
  MinmoSdkError,
  MinmoTransportError,
  OnchainConfirmationSpeed,
  OtcEventType,
  PartnerClient,
  ParticipantRole,
  PayErrorCode,
  PayEventType,
  PayInvoiceDetail,
  PayInvoiceStatus,
  PayStoreStatus,
  PaymentChannel,
  PayoutDestinationType,
  Permission,
  ReferralCodeScope,
  ResyncRequiredError,
  SwapEscrowPaymentStatus,
  SwapState,
  SwapType,
  TeamRole,
  WalletConnectionScope,
  WalletEventType,
  WalletProvider,
} from "../vendor/upstream/runtime.mjs";

export {
  AgentSelectionMode,
  AgentStatus,
  AgentTeamAssociationStatus,
  AgentTeamAssociationVisibility,
  AnalyticsBucket,
  ApiKeyCapability,
  ApiKeyInvalidReason,
  ApiKeyResourceScope,
  BitcoinNetwork,
  ConfirmationRole,
  Currency,
  DisputeResolution,
  EscrowEventType,
  EscrowNetwork,
  EventConnectionState,
  FxRateProvider,
  MemoryEventCursorStore,
  MinmoApiError,
  MinmoAuthenticationError,
  MinmoAuthorizationError,
  MinmoRateLimitError,
  MinmoSdkError,
  MinmoTransportError,
  OnchainConfirmationSpeed,
  OtcEventType,
  ParticipantRole,
  PayErrorCode,
  PayEventType,
  PayInvoiceDetail,
  PayInvoiceStatus,
  PayStoreStatus,
  PaymentChannel,
  PayoutDestinationType,
  Permission,
  ReferralCodeScope,
  ResyncRequiredError,
  SwapEscrowPaymentStatus,
  SwapState,
  SwapType,
  TeamRole,
  WalletConnectionScope,
  WalletEventType,
  WalletProvider,
};

export type * from "../vendor/upstream/sdk/disputes.js";
export type * from "../vendor/upstream/sdk/escrow.js";
export type * from "../vendor/upstream/sdk/events.js";
export type * from "../vendor/upstream/sdk/otc/index.js";
export type * from "../vendor/upstream/sdk/partner.js";
export type * from "../vendor/upstream/sdk/pay/index.js";
export type * from "../vendor/upstream/sdk/wallet.js";

export const MINMO_PRODUCTION_BASE_URL = "https://api.minmo.to/api/v1";

export interface MinmoClientOptions {
  partnerId: string;
  apiKey: string;
  baseUrl?: string;
}

/**
 * A server-side Minmo client bound to one Partner and one API key.
 *
 * Partner API keys are secrets. Never construct this client in browser code or
 * expose the key through a public environment variable.
 */
export class MinmoClient extends PartnerClient {
  constructor(options: MinmoClientOptions) {
    const partnerId = required(options.partnerId, "A Partner ID");
    const apiKey = required(options.apiKey, "An API key");

    super(
      {
        baseUrl: options.baseUrl ?? MINMO_PRODUCTION_BASE_URL,
        auth: {
          getHeaders: async () => ({ "X-API-Key": apiKey }),
        },
      },
      partnerId,
    );
  }
}

function required(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} is required`);
  return normalized;
}
