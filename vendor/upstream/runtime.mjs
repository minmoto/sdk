// packages/sdk/src/http.ts
var MinmoApiError = class extends Error {
  constructor(message, status, responseBody) {
    super(message);
    this.status = status;
    this.responseBody = responseBody;
    this.name = "MinmoApiError";
    this.code = typeof responseBody === "object" && responseBody !== null && "code" in responseBody && typeof responseBody.code === "string" ? responseBody.code : void 0;
  }
  code;
};
var MinmoSdkError = class extends Error {
  constructor(message, code, status, requestId, retryable = false, responseBody) {
    super(message);
    this.code = code;
    this.status = status;
    this.requestId = requestId;
    this.retryable = retryable;
    this.responseBody = responseBody;
    this.name = "MinmoSdkError";
  }
};
var MinmoAuthenticationError = class extends MinmoSdkError {
  constructor(message = "Authentication is required", status, responseBody, requestId) {
    super(
      message,
      "authentication_required",
      status,
      requestId,
      false,
      responseBody
    );
    this.name = "MinmoAuthenticationError";
  }
};
var MinmoAuthorizationError = class extends MinmoSdkError {
  constructor(message = "You are not authorized", status, responseBody, requestId) {
    super(message, "not_authorized", status, requestId, false, responseBody);
    this.name = "MinmoAuthorizationError";
  }
};
var MinmoRateLimitError = class extends MinmoSdkError {
  constructor(message = "Rate limit exceeded", status, responseBody, requestId) {
    super(message, "rate_limited", status, requestId, true, responseBody);
    this.name = "MinmoRateLimitError";
  }
};
var MinmoTransportError = class extends MinmoSdkError {
  constructor(message, cause) {
    super(message, "transport_error", void 0, void 0, true, cause);
    this.name = "MinmoTransportError";
  }
};
var HttpClient = class {
  baseUrl;
  auth;
  fetchFn;
  timeoutMs;
  constructor(options) {
    const url = new URL(options.baseUrl);
    if (!/^https?:$/.test(url.protocol)) {
      throw new Error("Minmo baseUrl must use http or https");
    }
    this.baseUrl = url.toString().replace(/\/$/, "");
    this.auth = options.auth;
    this.fetchFn = options.fetch ?? globalThis.fetch.bind(globalThis);
    this.timeoutMs = options.timeoutMs ?? 3e4;
  }
  async request(path, init = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    for (const [name, value] of Object.entries(
      await this.auth?.getHeaders() ?? {}
    )) {
      headers.set(name, value);
    }
    try {
      let response;
      try {
        response = await this.fetchResponse(path, {
          ...init,
          headers,
          signal: init.signal ?? controller.signal
        });
      } catch (error) {
        throw new MinmoTransportError(
          error instanceof Error ? error.message : String(error),
          error
        );
      }
      const text = await response.text();
      const body = text ? this.parseBody(text) : void 0;
      if (!response.ok) {
        const requestId = response.headers.get("x-request-id") ?? void 0;
        const message = typeof body === "object" && body && "message" in body ? String(body.message) : `Minmo API request failed (${response.status})`;
        if (response.status === 401) {
          throw new MinmoAuthenticationError(
            message,
            response.status,
            body,
            requestId
          );
        }
        if (response.status === 403) {
          throw new MinmoAuthorizationError(
            message,
            response.status,
            body,
            requestId
          );
        }
        if (response.status === 429) {
          throw new MinmoRateLimitError(
            message,
            response.status,
            body,
            requestId
          );
        }
        throw new MinmoApiError(message, response.status, body);
      }
      return body;
    } finally {
      clearTimeout(timeout);
    }
  }
  async fetchResponse(path, init = {}) {
    const headers = new Headers(init.headers);
    headers.set("Accept", headers.get("Accept") ?? "application/json");
    for (const [name, value] of Object.entries(
      await this.auth?.getHeaders() ?? {}
    )) {
      headers.set(name, value);
    }
    return this.fetchFn(`${this.baseUrl}${path}`, { ...init, headers });
  }
  parseBody(text) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
};

// packages/sdk/src/events.ts
var EventConnectionState = /* @__PURE__ */ ((EventConnectionState2) => {
  EventConnectionState2["IDLE"] = "idle";
  EventConnectionState2["CONNECTING"] = "connecting";
  EventConnectionState2["CONNECTED"] = "connected";
  EventConnectionState2["RECONNECTING"] = "reconnecting";
  EventConnectionState2["RESYNC_REQUIRED"] = "resync_required";
  EventConnectionState2["CLOSED"] = "closed";
  return EventConnectionState2;
})(EventConnectionState || {});
var MemoryEventCursorStore = class {
  cursors = /* @__PURE__ */ new Map();
  load(streamKey) {
    return Promise.resolve(this.cursors.get(streamKey));
  }
  save(streamKey, cursor) {
    this.cursors.set(streamKey, cursor);
    return Promise.resolve();
  }
  clear(streamKey) {
    this.cursors.delete(streamKey);
    return Promise.resolve();
  }
};
var ResyncRequiredError = class extends Error {
  constructor(reason = "The event stream requires resynchronization") {
    super(reason);
    this.reason = reason;
    this.name = "ResyncRequiredError";
  }
};
var MAX_DEDUPLICATION_ENTRIES = 1e3;
var EventSubscriptionImpl = class {
  constructor(http, options) {
    this.http = http;
    this.options = options;
    this.streamKey = options.streamKey ?? this.defaultStreamKey();
    options.signal?.addEventListener("abort", () => void this.close(), {
      once: true
    });
    void this.run();
  }
  currentState = "idle" /* IDLE */;
  abortController = new AbortController();
  seenIds = /* @__PURE__ */ new Set();
  streamKey;
  resolveReady;
  rejectReady;
  ready = new Promise((resolve, reject) => {
    this.resolveReady = resolve;
    this.rejectReady = reject;
  });
  get state() {
    return this.currentState;
  }
  async close() {
    if (this.currentState === "closed" /* CLOSED */) return;
    this.abortController.abort();
    this.setState("closed" /* CLOSED */);
  }
  async run() {
    let retry = 0;
    while (!this.abortController.signal.aborted) {
      try {
        this.setState(
          retry ? "reconnecting" /* RECONNECTING */ : "connecting" /* CONNECTING */
        );
        await this.connect();
        retry = 0;
      } catch (error) {
        if (this.abortController.signal.aborted) return;
        const normalized = error instanceof Error ? error : new Error(String(error));
        if (normalized instanceof ResyncRequiredError) {
          this.setState("resync_required" /* RESYNC_REQUIRED */);
          await this.options.cursorStore?.clear(this.streamKey);
          await this.options.onResyncRequired?.(normalized);
          retry = 0;
          continue;
        }
        this.options.onError?.(normalized);
        if (this.currentState === "connecting" /* CONNECTING */) {
          this.rejectReady(normalized);
        }
        const delay = Math.min(3e4, 500 * 2 ** retry) + Math.round(Math.random() * 250);
        retry += 1;
        await this.sleep(delay);
      }
    }
  }
  async connect() {
    const cursor = await this.options.cursorStore?.load(this.streamKey);
    const params = new URLSearchParams();
    if (this.options.beneficiaryId)
      params.set("beneficiaryId", this.options.beneficiaryId);
    if (this.options.principalId)
      params.set("principalId", this.options.principalId);
    if (this.options.partnerId) params.set("partnerId", this.options.partnerId);
    if (this.options.storeId) params.set("storeId", this.options.storeId);
    if (this.options.aggregateId)
      params.set("aggregateId", this.options.aggregateId);
    for (const eventType of this.options.eventTypes ?? []) {
      params.append("eventType", eventType);
    }
    const suffix = params.toString() ? `?${params}` : "";
    const response = await this.http.fetchResponse("/events/stream" + suffix, {
      headers: {
        Accept: "text/event-stream",
        ...cursor ? { "Last-Event-ID": cursor } : {}
      },
      signal: this.abortController.signal
    });
    if (response.status === 409 || response.status === 410) {
      throw new ResyncRequiredError(await response.text());
    }
    if (!response.ok || !response.body) {
      throw new Error(`Event stream failed (${response.status})`);
    }
    this.setState("connected" /* CONNECTED */);
    this.resolveReady();
    await this.readStream(response.body);
  }
  async readStream(body) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (!this.abortController.signal.aborted) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const records = buffer.split(/\r?\n\r?\n/);
        buffer = records.pop() ?? "";
        for (const record of records) await this.handleRecord(record);
      }
    } finally {
      reader.releaseLock();
    }
  }
  async handleRecord(record) {
    let id;
    const data = [];
    for (const line of record.split(/\r?\n/)) {
      if (line.startsWith("id:")) id = line.slice(3).trim();
      if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
    }
    if (!data.length) return;
    const event = JSON.parse(data.join("\n"));
    if (event.type === "resync_required") {
      throw new ResyncRequiredError(
        String(
          event.payload?.reason ?? "Event cursor requires resynchronization"
        )
      );
    }
    const eventId = id ?? event.id;
    if (!eventId || this.seenIds.has(eventId)) return;
    this.seenIds.add(eventId);
    if (this.seenIds.size > MAX_DEDUPLICATION_ENTRIES) {
      const oldest = this.seenIds.values().next().value;
      if (oldest) this.seenIds.delete(oldest);
    }
    await this.options.cursorStore?.save(this.streamKey, eventId);
    if (this.options.eventTypes?.length && !this.options.eventTypes.includes(event.type)) {
      return;
    }
    const hydrator = this.options.eventHydrators?.[event.type];
    if (event.payload === null && hydrator) {
      const payload = await hydrator(event);
      await this.options.onEvent({ ...event, payload });
      return;
    }
    await this.options.onEvent(event);
  }
  defaultStreamKey() {
    return JSON.stringify({
      deployment: this.http.baseUrl,
      beneficiaryId: this.options.beneficiaryId,
      principalId: this.options.principalId,
      partnerId: this.options.partnerId,
      storeId: this.options.storeId,
      aggregateId: this.options.aggregateId
    });
  }
  setState(state) {
    this.currentState = state;
    this.options.onStateChange?.(state);
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
var EventsClient = class {
  constructor(http, defaultCursorStore, defaultHydrators) {
    this.http = http;
    this.defaultCursorStore = defaultCursorStore;
    this.defaultHydrators = defaultHydrators;
  }
  subscribe(options) {
    return new EventSubscriptionImpl(this.http, {
      ...options,
      cursorStore: options.cursorStore ?? this.defaultCursorStore,
      eventHydrators: options.eventHydrators ?? this.defaultHydrators
    });
  }
  subscribeToBeneficiarySwaps(beneficiaryId, options) {
    return this.subscribe({ ...options, beneficiaryId });
  }
  subscribeToPartner(partnerId, options) {
    return this.subscribe({ ...options, partnerId });
  }
  subscribeToPartnerRates(partnerId, options = {
    onEvent: () => void 0
  }) {
    return this.subscribe({ ...options, partnerId });
  }
};
function subscribeToDomainEvents(events, domain, eventTypes, options, filter) {
  const { onEvent, streamKey, ...subscriptionOptions } = options;
  return events.subscribe({
    ...subscriptionOptions,
    eventTypes,
    streamKey: streamKey ?? JSON.stringify({
      domain,
      beneficiaryId: options.beneficiaryId,
      principalId: options.principalId,
      partnerId: options.partnerId,
      storeId: options.storeId,
      aggregateId: options.aggregateId
    }),
    onEvent: async (event) => {
      if (filter && !filter(event)) return;
      await onEvent(event);
    }
  });
}

// packages/core/src/types/agent.ts
var AgentStatus = /* @__PURE__ */ ((AgentStatus2) => {
  AgentStatus2["ACTIVE"] = "active";
  AgentStatus2["INACTIVE"] = "inactive";
  AgentStatus2["SUSPENDED"] = "suspended";
  return AgentStatus2;
})(AgentStatus || {});
var AgentTeamAssociationStatus = /* @__PURE__ */ ((AgentTeamAssociationStatus2) => {
  AgentTeamAssociationStatus2["PENDING"] = "pending";
  AgentTeamAssociationStatus2["ACTIVE"] = "active";
  AgentTeamAssociationStatus2["REMOVED"] = "removed";
  return AgentTeamAssociationStatus2;
})(AgentTeamAssociationStatus || {});
var AgentTeamAssociationVisibility = /* @__PURE__ */ ((AgentTeamAssociationVisibility2) => {
  AgentTeamAssociationVisibility2["TEAM"] = "team";
  AgentTeamAssociationVisibility2["PRIVATE"] = "private";
  return AgentTeamAssociationVisibility2;
})(AgentTeamAssociationVisibility || {});
var SwapType = /* @__PURE__ */ ((SwapType2) => {
  SwapType2["ONRAMP"] = "onramp";
  SwapType2["OFFRAMP"] = "offramp";
  return SwapType2;
})(SwapType || {});
var SwapState = /* @__PURE__ */ ((SwapState2) => {
  SwapState2["CREATED"] = "created";
  SwapState2["AGENT_MATCHED"] = "agent_matched";
  SwapState2["ESCROW_PENDING"] = "escrow_pending";
  SwapState2["ESCROW_LOCKED"] = "escrow_locked";
  SwapState2["PAYMENT_INSTRUCTED"] = "payment_instructed";
  SwapState2["PAYMENT_PENDING"] = "payment_pending";
  SwapState2["PAYMENT_SUBMITTED"] = "payment_submitted";
  SwapState2["PAYMENT_CONFIRMED_USER"] = "payment_confirmed_user";
  SwapState2["PAYMENT_CONFIRMED_AGENT"] = "payment_confirmed_agent";
  SwapState2["CONFIRMATION_PENDING"] = "confirmation_pending";
  SwapState2["COMPLETED"] = "completed";
  SwapState2["CANCELLED"] = "cancelled";
  SwapState2["REFUND_INITIATED"] = "refund_initiated";
  SwapState2["REFUND_FAILED"] = "refund_failed";
  SwapState2["DISPUTED"] = "disputed";
  SwapState2["DISPUTE_EVIDENCE_COLLECTION"] = "dispute_evidence_collection";
  SwapState2["DISPUTE_INTERNAL_REVIEW"] = "dispute_internal_review";
  SwapState2["DISPUTE_RESOLVED"] = "dispute_resolved";
  SwapState2["DISPUTE_REVIEW"] = "dispute_review";
  SwapState2["REFUNDED"] = "refunded";
  SwapState2["EXPIRED"] = "expired";
  SwapState2["FIAT_SENDER_TIMEOUT"] = "fiat_sender_timeout";
  SwapState2["FIAT_RECEIVER_TIMEOUT"] = "fiat_receiver_timeout";
  SwapState2["TRANSFERRED_TO_BACKUP"] = "transferred_to_backup";
  return SwapState2;
})(SwapState || {});

// packages/core/src/types/currency.ts
var Currency = /* @__PURE__ */ ((Currency2) => {
  Currency2["BTC"] = "BTC";
  Currency2["GBP"] = "GBP";
  Currency2["INR"] = "INR";
  Currency2["KES"] = "KES";
  Currency2["MUR"] = "MUR";
  Currency2["MWK"] = "MWK";
  Currency2["MZN"] = "MZN";
  Currency2["NGN"] = "NGN";
  Currency2["PKR"] = "PKR";
  Currency2["USDT"] = "USDT";
  Currency2["USD"] = "USD";
  Currency2["ZAR"] = "ZAR";
  Currency2["UNRECOGNIZED"] = "UNRECOGNIZED";
  return Currency2;
})(Currency || {});

// packages/core/src/types/channels.ts
var PaymentChannel = /* @__PURE__ */ ((PaymentChannel2) => {
  PaymentChannel2["MPESA_PHONE"] = "mpesa_phone";
  PaymentChannel2["MPESA_TILL"] = "mpesa_till";
  PaymentChannel2["MPESA_PAYBILL"] = "mpesa_paybill";
  PaymentChannel2["AIRTEL_MONEY"] = "airtel_money";
  PaymentChannel2["AIRTEL_MONEY_TILL"] = "airtel_money_till";
  PaymentChannel2["TNM_MPAMBA"] = "tnm_mpamba";
  PaymentChannel2["TNM_MPAMBA_MERCHANT"] = "tnm_mpamba_merchant";
  PaymentChannel2["BANK_TRANSFER"] = "bank_transfer";
  PaymentChannel2["CARD"] = "card";
  PaymentChannel2["CASH"] = "cash";
  PaymentChannel2["LIGHTNING"] = "lightning";
  PaymentChannel2["ONCHAIN"] = "onchain";
  return PaymentChannel2;
})(PaymentChannel || {});
var MWK_AIRTEL_PHONE_PATTERN = /^\+2659[89][0-9]{7}$/;
var CURRENCY_CHANNEL_FIELD_OVERRIDES = {
  ["MWK" /* MWK */]: {
    ["airtel_money" /* AIRTEL_MONEY */]: {
      phoneNumber: {
        required: true,
        pattern: MWK_AIRTEL_PHONE_PATTERN,
        placeholder: "+265991234567",
        helpText: "Enter an Airtel number in international format (+265 99... or 98...)",
        validate: (v) => !v || MWK_AIRTEL_PHONE_PATTERN.test(String(v)) || "Airtel Money requires an Airtel number, e.g. +265991234567"
      }
    }
  }
};

// packages/core/src/types/analytics.ts
var AnalyticsBucket = /* @__PURE__ */ ((AnalyticsBucket2) => {
  AnalyticsBucket2["DAY"] = "day";
  AnalyticsBucket2["WEEK"] = "week";
  AnalyticsBucket2["MONTH"] = "month";
  AnalyticsBucket2["YEAR"] = "year";
  AnalyticsBucket2["ALL"] = "all";
  return AnalyticsBucket2;
})(AnalyticsBucket || {});

// packages/core/src/types/events.ts
var OtcEventType = /* @__PURE__ */ ((OtcEventType2) => {
  OtcEventType2["SWAP_CREATED"] = "otc.swap.created";
  OtcEventType2["SWAP_ESCROW_PENDING"] = "otc.swap.escrow.pending";
  OtcEventType2["SWAP_ESCROW_LOCKED"] = "otc.swap.escrow.locked";
  OtcEventType2["SWAP_CLAIMED"] = "otc.swap.claimed";
  OtcEventType2["SWAP_PAYMENT_INSTRUCTED"] = "otc.swap.payment.instructed";
  OtcEventType2["SWAP_PAYMENT_PENDING"] = "otc.swap.payment.pending";
  OtcEventType2["SWAP_PAYMENT_SUBMITTED"] = "otc.swap.payment.submitted";
  OtcEventType2["SWAP_PAYMENT_CONFIRMED_USER"] = "otc.swap.payment.confirmed.user";
  OtcEventType2["SWAP_PAYMENT_CONFIRMED_AGENT"] = "otc.swap.payment.confirmed.agent";
  OtcEventType2["SWAP_CONFIRMATION_PENDING"] = "otc.swap.confirmation.pending";
  OtcEventType2["SWAP_COMPLETED"] = "otc.swap.completed";
  OtcEventType2["SWAP_CANCELLED"] = "otc.swap.cancelled";
  OtcEventType2["SWAP_REFUND_INITIATED"] = "otc.swap.refund.initiated";
  OtcEventType2["SWAP_REFUND_FAILED"] = "otc.swap.refund.failed";
  OtcEventType2["SWAP_DISPUTED"] = "otc.swap.disputed";
  OtcEventType2["SWAP_DISPUTE_EVIDENCE_COLLECTION"] = "otc.swap.dispute.evidence.collection";
  OtcEventType2["SWAP_DISPUTE_INTERNAL_REVIEW"] = "otc.swap.dispute.internal.review";
  OtcEventType2["SWAP_DISPUTE_REVIEW"] = "otc.swap.dispute.review";
  OtcEventType2["SWAP_DISPUTE_RESOLVED"] = "otc.swap.dispute.resolved";
  OtcEventType2["SWAP_REFUNDED"] = "otc.swap.refunded";
  OtcEventType2["SWAP_EXPIRED"] = "otc.swap.expired";
  OtcEventType2["SWAP_FIAT_SENDER_TIMEOUT"] = "otc.swap.fiat.sender.timeout";
  OtcEventType2["SWAP_FIAT_RECEIVER_TIMEOUT"] = "otc.swap.fiat.receiver.timeout";
  OtcEventType2["SWAP_TRANSFERRED_TO_BACKUP"] = "otc.swap.transferred.to.backup";
  OtcEventType2["AGENT_REGISTERED"] = "otc.agent.registered";
  OtcEventType2["AGENT_UPDATED"] = "otc.agent.updated";
  OtcEventType2["AGENT_AVAILABILITY_CHANGED"] = "otc.agent.availability.changed";
  OtcEventType2["AGENT_TEAM_ASSOCIATED"] = "otc.agent.team.associated";
  OtcEventType2["AGENT_TEAM_REMOVED"] = "otc.agent.team.removed";
  OtcEventType2["RATE_QUOTED"] = "otc.rate.quoted";
  OtcEventType2["RATE_UPDATED"] = "otc.rate.updated";
  OtcEventType2["RATE_EXPIRED"] = "otc.rate.expired";
  return OtcEventType2;
})(OtcEventType || {});
var PayEventType = /* @__PURE__ */ ((PayEventType2) => {
  PayEventType2["INVOICE_CREATED"] = "pay.invoice.created";
  PayEventType2["INVOICE_PROCESSING"] = "pay.invoice.processing";
  PayEventType2["INVOICE_SETTLED"] = "pay.invoice.settled";
  PayEventType2["INVOICE_EXPIRED"] = "pay.invoice.expired";
  PayEventType2["INVOICE_INVALID"] = "pay.invoice.invalid";
  PayEventType2["STORE_CONNECTED"] = "pay.store.connected";
  PayEventType2["STORE_CONNECTION_FAILED"] = "pay.store.connection.failed";
  return PayEventType2;
})(PayEventType || {});
var WalletEventType = /* @__PURE__ */ ((WalletEventType2) => {
  WalletEventType2["SYNCED"] = "wallet.synced";
  WalletEventType2["PAYMENT_PENDING"] = "wallet.payment.pending";
  WalletEventType2["PAYMENT_SUCCEEDED"] = "wallet.payment.succeeded";
  WalletEventType2["PAYMENT_FAILED"] = "wallet.payment.failed";
  return WalletEventType2;
})(WalletEventType || {});
var EscrowEventType = /* @__PURE__ */ ((EscrowEventType2) => {
  EscrowEventType2["REFERENCE_ISSUED"] = "escrow.reference.issued";
  EscrowEventType2["FUNDING_CONFIRMED"] = "escrow.funding.confirmed";
  EscrowEventType2["DISPUTE_RESOLUTION_RECORDED"] = "escrow.dispute.resolution.recorded";
  EscrowEventType2["RELEASED"] = "escrow.released";
  EscrowEventType2["REFUNDED"] = "escrow.refunded";
  EscrowEventType2["EXPIRED"] = "escrow.expired";
  return EscrowEventType2;
})(EscrowEventType || {});
var MINMO_EVENT_TYPES = [
  ...Object.values(OtcEventType),
  ...Object.values(PayEventType),
  ...Object.values(WalletEventType),
  ...Object.values(EscrowEventType)
];

// packages/core/src/types/rates.ts
var FxRateProvider = /* @__PURE__ */ ((FxRateProvider2) => {
  FxRateProvider2["CURRENCY_API"] = "currency_api";
  FxRateProvider2["COINGECKO"] = "coingecko";
  FxRateProvider2["CUSTOM_RATES"] = "custom_rates";
  return FxRateProvider2;
})(FxRateProvider || {});

// packages/core/src/auth/permissions.ts
var TeamRole = /* @__PURE__ */ ((TeamRole2) => {
  TeamRole2["TEAM_ADMIN"] = "team_admin";
  TeamRole2["TEAM_MEMBER"] = "team_member";
  return TeamRole2;
})(TeamRole || {});
var Permission = /* @__PURE__ */ ((Permission2) => {
  Permission2["SYSTEM_CONFIG"] = "system:config";
  Permission2["SYSTEM_MONITOR"] = "system:monitor";
  Permission2["SYSTEM_AUDIT"] = "system:audit";
  Permission2["REFERRAL_CODE_CREATE"] = "referral_code:create";
  Permission2["REFERRAL_CODE_READ"] = "referral_code:read";
  Permission2["USER_READ"] = "user:read";
  Permission2["USER_WRITE"] = "user:write";
  Permission2["USER_DELETE"] = "user:delete";
  Permission2["USER_MANAGE_ROLES"] = "user:manage_roles";
  Permission2["AGENT_REGISTER"] = "agent:register";
  Permission2["AGENT_MANAGE_OWN"] = "agent:manage_own";
  Permission2["AGENT_MANAGE_ALL"] = "agent:manage_all";
  Permission2["AGENT_READ_ALL"] = "agent:read_all";
  Permission2["SWAP_CREATE"] = "swap:create";
  Permission2["SWAP_READ_OWN"] = "swap:read_own";
  Permission2["SWAP_READ_ALL"] = "swap:read_all";
  Permission2["SWAP_APPROVE"] = "swap:approve";
  Permission2["SWAP_CANCEL_OWN"] = "swap:cancel_own";
  Permission2["SWAP_CANCEL_ALL"] = "swap:cancel_all";
  Permission2["LIQUIDITY_MANAGE_OWN"] = "liquidity:manage_own";
  Permission2["LIQUIDITY_MANAGE_ALL"] = "liquidity:manage_all";
  Permission2["LIQUIDITY_READ_ALL"] = "liquidity:read_all";
  Permission2["BITCOIN_WALLET_READ"] = "bitcoin:wallet_read";
  Permission2["BITCOIN_WALLET_RECEIVE"] = "bitcoin:wallet_receive";
  Permission2["BITCOIN_WALLET_SEND"] = "bitcoin:wallet_send";
  Permission2["ESCROW_CREATE"] = "escrow:create";
  Permission2["ESCROW_READ"] = "escrow:read";
  Permission2["ESCROW_VERIFY_FUNDING"] = "escrow:verify_funding";
  Permission2["ESCROW_RELEASE"] = "escrow:release";
  Permission2["ESCROW_REFUND"] = "escrow:refund";
  Permission2["ESCROW_RESOLVE_DISPUTE"] = "escrow:resolve_dispute";
  Permission2["ESCROW_DESCRIPTOR_PUBLISH"] = "escrow:descriptor_publish";
  Permission2["FX_RATES_MANAGE"] = "fx:rates_manage";
  Permission2["FX_RATES_READ"] = "fx:rates_read";
  Permission2["ANALYTICS_READ_OWN"] = "reports:read_own";
  Permission2["ANALYTICS_READ_ALL"] = "reports:read_all";
  Permission2["ANALYTICS_EXPORT"] = "reports:export";
  Permission2["PARTNER_READ_OWN"] = "partner:read_own";
  Permission2["PARTNER_MANAGE_OWN"] = "partner:manage_own";
  Permission2["PARTNER_READ_ALL"] = "partner:read_all";
  Permission2["PARTNER_MANAGE_ALL"] = "partner:manage_all";
  Permission2["PARTNER_AGENT_INVITE"] = "partner:agent_invite";
  Permission2["PARTNER_AGENT_REMOVE"] = "partner:agent_remove";
  Permission2["PARTNER_AGENT_READ"] = "partner:agent_read";
  Permission2["PARTNER_AGENT_MANAGE"] = "partner:agent_manage";
  Permission2["PARTNER_AGENTS_READ"] = "partner:agents_read";
  Permission2["PARTNER_SWAPS_READ"] = "partner:swaps_read";
  Permission2["PARTNER_LIQUIDITY_READ"] = "partner:liquidity_read";
  Permission2["PARTNER_METRICS_READ"] = "partner:metrics_read";
  Permission2["PARTNER_SERVICES_CREATE"] = "partner:services_create";
  Permission2["PARTNER_SERVICES_MANAGE"] = "partner:services_manage";
  Permission2["PARTNER_SERVICES_READ"] = "partner:services_read";
  Permission2["PARTNER_SERVICES_DELETE"] = "partner:services_delete";
  Permission2["PAY_PAYMENT_CREATE"] = "pay:payment_create";
  Permission2["PAY_PAYMENT_READ"] = "pay:payment_read";
  Permission2["PAY_PAYMENT_CANCEL"] = "pay:payment_cancel";
  Permission2["PAY_EVENT_SUBSCRIBE"] = "pay:event_subscribe";
  Permission2["PAY_STORE_READ"] = "pay:store_read";
  Permission2["PAY_STORE_MANAGE"] = "pay:store_manage";
  return Permission2;
})(Permission || {});
var PERMISSION_GROUPS = {
  SYSTEM_OPERATIONS: [
    "system:config" /* SYSTEM_CONFIG */,
    "system:monitor" /* SYSTEM_MONITOR */,
    "system:audit" /* SYSTEM_AUDIT */
  ],
  REFERRAL_CODE_MANAGEMENT: [
    "referral_code:create" /* REFERRAL_CODE_CREATE */,
    "referral_code:read" /* REFERRAL_CODE_READ */
  ],
  BITCOIN_OPERATIONS: [
    "bitcoin:wallet_read" /* BITCOIN_WALLET_READ */,
    "bitcoin:wallet_receive" /* BITCOIN_WALLET_RECEIVE */,
    "bitcoin:wallet_send" /* BITCOIN_WALLET_SEND */
  ],
  ESCROW_OPERATIONS: [
    "escrow:create" /* ESCROW_CREATE */,
    "escrow:read" /* ESCROW_READ */,
    "escrow:verify_funding" /* ESCROW_VERIFY_FUNDING */,
    "escrow:release" /* ESCROW_RELEASE */,
    "escrow:refund" /* ESCROW_REFUND */,
    "escrow:resolve_dispute" /* ESCROW_RESOLVE_DISPUTE */,
    "escrow:descriptor_publish" /* ESCROW_DESCRIPTOR_PUBLISH */
  ],
  USER_MANAGEMENT: [
    "user:read" /* USER_READ */,
    "user:write" /* USER_WRITE */,
    "user:delete" /* USER_DELETE */,
    "user:manage_roles" /* USER_MANAGE_ROLES */
  ],
  AGENT_MANAGEMENT: [
    "agent:register" /* AGENT_REGISTER */,
    "agent:manage_own" /* AGENT_MANAGE_OWN */,
    "agent:manage_all" /* AGENT_MANAGE_ALL */,
    "agent:read_all" /* AGENT_READ_ALL */
  ],
  SWAP_OPERATIONS: [
    "swap:read_own" /* SWAP_READ_OWN */,
    "swap:read_all" /* SWAP_READ_ALL */,
    "swap:create" /* SWAP_CREATE */,
    "swap:cancel_own" /* SWAP_CANCEL_OWN */,
    "swap:cancel_all" /* SWAP_CANCEL_ALL */,
    "swap:approve" /* SWAP_APPROVE */
  ],
  LIQUIDITY_OPERATIONS: [
    "liquidity:manage_own" /* LIQUIDITY_MANAGE_OWN */,
    "liquidity:manage_all" /* LIQUIDITY_MANAGE_ALL */,
    "liquidity:read_all" /* LIQUIDITY_READ_ALL */
  ],
  FX_OPERATIONS: ["fx:rates_read" /* FX_RATES_READ */, "fx:rates_manage" /* FX_RATES_MANAGE */],
  ANALYTICS: [
    "reports:read_own" /* ANALYTICS_READ_OWN */,
    "reports:read_all" /* ANALYTICS_READ_ALL */,
    "reports:export" /* ANALYTICS_EXPORT */
  ],
  PARTNER_OPERATIONS: [
    "partner:read_own" /* PARTNER_READ_OWN */,
    "partner:manage_own" /* PARTNER_MANAGE_OWN */,
    "partner:agent_invite" /* PARTNER_AGENT_INVITE */,
    "partner:agent_remove" /* PARTNER_AGENT_REMOVE */,
    "partner:agent_read" /* PARTNER_AGENT_READ */,
    "partner:agent_manage" /* PARTNER_AGENT_MANAGE */,
    "partner:agents_read" /* PARTNER_AGENTS_READ */,
    "partner:swaps_read" /* PARTNER_SWAPS_READ */,
    "partner:liquidity_read" /* PARTNER_LIQUIDITY_READ */,
    "partner:metrics_read" /* PARTNER_METRICS_READ */,
    "partner:services_create" /* PARTNER_SERVICES_CREATE */,
    "partner:services_manage" /* PARTNER_SERVICES_MANAGE */,
    "partner:services_read" /* PARTNER_SERVICES_READ */,
    "partner:services_delete" /* PARTNER_SERVICES_DELETE */
  ],
  PARTNER_ADMIN_OPERATIONS: [
    "partner:read_all" /* PARTNER_READ_ALL */,
    "partner:manage_all" /* PARTNER_MANAGE_ALL */
  ],
  PAY_OPERATIONS: [
    "pay:payment_create" /* PAY_PAYMENT_CREATE */,
    "pay:payment_read" /* PAY_PAYMENT_READ */,
    "pay:payment_cancel" /* PAY_PAYMENT_CANCEL */,
    "pay:event_subscribe" /* PAY_EVENT_SUBSCRIBE */,
    "pay:store_read" /* PAY_STORE_READ */,
    "pay:store_manage" /* PAY_STORE_MANAGE */
  ]
};
var ROLE_PERMISSIONS = {
  // User Roles (assigned directly to users)
  ["minmo_admin" /* MINMO_ADMIN */]: [
    ...PERMISSION_GROUPS.SYSTEM_OPERATIONS,
    ...PERMISSION_GROUPS.REFERRAL_CODE_MANAGEMENT,
    ...PERMISSION_GROUPS.BITCOIN_OPERATIONS,
    ...PERMISSION_GROUPS.ESCROW_OPERATIONS,
    ...PERMISSION_GROUPS.USER_MANAGEMENT,
    ...PERMISSION_GROUPS.AGENT_MANAGEMENT,
    ...PERMISSION_GROUPS.SWAP_OPERATIONS,
    ...PERMISSION_GROUPS.LIQUIDITY_OPERATIONS,
    ...PERMISSION_GROUPS.FX_OPERATIONS,
    ...PERMISSION_GROUPS.ANALYTICS,
    ...PERMISSION_GROUPS.PARTNER_OPERATIONS,
    ...PERMISSION_GROUPS.PARTNER_ADMIN_OPERATIONS,
    ...PERMISSION_GROUPS.PAY_OPERATIONS
  ],
  // Group Roles (assigned via Hexclave team/RBAC membership)
  ["team_admin" /* TEAM_ADMIN */]: [
    // Core agent operations
    "agent:register" /* AGENT_REGISTER */,
    "agent:manage_own" /* AGENT_MANAGE_OWN */,
    // Transaction operations
    "swap:create" /* SWAP_CREATE */,
    "swap:read_own" /* SWAP_READ_OWN */,
    // Financial operations
    "liquidity:manage_own" /* LIQUIDITY_MANAGE_OWN */,
    ...PERMISSION_GROUPS.ESCROW_OPERATIONS,
    // Exchange rates
    "fx:rates_read" /* FX_RATES_READ */,
    // Analytics
    "reports:read_all" /* ANALYTICS_READ_ALL */,
    // Partner-specific tenant-level permissions
    ...PERMISSION_GROUPS.PARTNER_OPERATIONS
  ],
  ["team_member" /* TEAM_MEMBER */]: [
    // Console/product visibility for assigned teams
    "agent:register" /* AGENT_REGISTER */,
    "agent:manage_own" /* AGENT_MANAGE_OWN */,
    "swap:create" /* SWAP_CREATE */,
    "swap:read_own" /* SWAP_READ_OWN */,
    "liquidity:manage_own" /* LIQUIDITY_MANAGE_OWN */,
    "fx:rates_read" /* FX_RATES_READ */,
    "reports:read_own" /* ANALYTICS_READ_OWN */,
    "partner:read_own" /* PARTNER_READ_OWN */,
    "partner:agents_read" /* PARTNER_AGENTS_READ */,
    "partner:swaps_read" /* PARTNER_SWAPS_READ */,
    "partner:liquidity_read" /* PARTNER_LIQUIDITY_READ */,
    "partner:metrics_read" /* PARTNER_METRICS_READ */,
    "partner:services_read" /* PARTNER_SERVICES_READ */
  ],
  ["minmo_partner" /* MINMO_PARTNER */]: [
    // Agent read access for dashboard visibility
    "agent:read_all" /* AGENT_READ_ALL */,
    // Read-only FX access for the partner console rates dashboard
    "fx:rates_read" /* FX_RATES_READ */
  ],
  ["minmo_agent" /* MINMO_AGENT */]: [
    // Basic agent permissions
    "agent:register" /* AGENT_REGISTER */,
    "agent:manage_own" /* AGENT_MANAGE_OWN */,
    // Transaction permissions
    "swap:create" /* SWAP_CREATE */,
    "swap:read_own" /* SWAP_READ_OWN */,
    "swap:cancel_own" /* SWAP_CANCEL_OWN */,
    // Financial permissions
    "liquidity:manage_own" /* LIQUIDITY_MANAGE_OWN */,
    "escrow:create" /* ESCROW_CREATE */,
    "escrow:read" /* ESCROW_READ */,
    "escrow:verify_funding" /* ESCROW_VERIFY_FUNDING */,
    // FX permissions
    "fx:rates_read" /* FX_RATES_READ */,
    // Reporting
    "reports:read_own" /* ANALYTICS_READ_OWN */
  ]
};

// packages/core/src/types/bitcoin.ts
var BitcoinNetwork = /* @__PURE__ */ ((BitcoinNetwork2) => {
  BitcoinNetwork2["MAINNET"] = "mainnet";
  BitcoinNetwork2["REGTEST"] = "regtest";
  return BitcoinNetwork2;
})(BitcoinNetwork || {});

// packages/core/src/types/common.ts
var AgentSelectionMode = /* @__PURE__ */ ((AgentSelectionMode2) => {
  AgentSelectionMode2["DIRECT"] = "direct";
  AgentSelectionMode2["AUTO"] = "auto";
  return AgentSelectionMode2;
})(AgentSelectionMode || {});
var DisputeResolution = /* @__PURE__ */ ((DisputeResolution2) => {
  DisputeResolution2["RELEASE_TO_USER"] = "release_to_user";
  DisputeResolution2["RELEASE_TO_AGENT"] = "release_to_agent";
  DisputeResolution2["PARTIAL_SETTLEMENT"] = "partial_settlement";
  DisputeResolution2["FULL_REFUND"] = "full_refund";
  return DisputeResolution2;
})(DisputeResolution || {});
var ConfirmationRole = /* @__PURE__ */ ((ConfirmationRole2) => {
  ConfirmationRole2["USER"] = "user";
  ConfirmationRole2["AGENT"] = "agent";
  return ConfirmationRole2;
})(ConfirmationRole || {});

// packages/core/src/types/pay.ts
var PayStoreStatus = /* @__PURE__ */ ((PayStoreStatus2) => {
  PayStoreStatus2["CREATED"] = "created";
  PayStoreStatus2["CONNECTED"] = "connected";
  PayStoreStatus2["FAILED"] = "failed";
  return PayStoreStatus2;
})(PayStoreStatus || {});
var PayErrorCode = /* @__PURE__ */ ((PayErrorCode2) => {
  PayErrorCode2["PARTNER_SCOPE_REQUIRED"] = "pay_partner_scope_required";
  PayErrorCode2["STORE_NOT_FOUND"] = "pay_store_not_found";
  PayErrorCode2["STORE_NOT_CONNECTED"] = "pay_store_not_connected";
  PayErrorCode2["INVOICE_NOT_FOUND"] = "pay_invoice_not_found";
  PayErrorCode2["IDEMPOTENCY_KEY_INVALID"] = "pay_idempotency_key_invalid";
  PayErrorCode2["IDEMPOTENCY_CONFLICT"] = "pay_idempotency_conflict";
  PayErrorCode2["PROVIDER_UNAVAILABLE"] = "pay_provider_unavailable";
  PayErrorCode2["PROVIDER_REJECTED"] = "pay_provider_rejected";
  PayErrorCode2["PERSISTENCE_FAILED"] = "pay_persistence_failed";
  PayErrorCode2["WALLET_CONNECTION_FAILED"] = "pay_wallet_connection_failed";
  PayErrorCode2["WALLET_ROTATION_UNAVAILABLE"] = "pay_wallet_rotation_unavailable";
  PayErrorCode2["WALLET_NOT_FOUND"] = "pay_wallet_not_found";
  PayErrorCode2["WALLET_UNAVAILABLE"] = "pay_wallet_unavailable";
  return PayErrorCode2;
})(PayErrorCode || {});
var PayInvoiceStatus = /* @__PURE__ */ ((PayInvoiceStatus2) => {
  PayInvoiceStatus2["NEW"] = "new";
  PayInvoiceStatus2["PROCESSING"] = "processing";
  PayInvoiceStatus2["SETTLED"] = "settled";
  PayInvoiceStatus2["EXPIRED"] = "expired";
  PayInvoiceStatus2["INVALID"] = "invalid";
  return PayInvoiceStatus2;
})(PayInvoiceStatus || {});
var PayInvoiceDetail = /* @__PURE__ */ ((PayInvoiceDetail2) => {
  PayInvoiceDetail2["NONE"] = "none";
  PayInvoiceDetail2["PAID_LATE"] = "paid_late";
  PayInvoiceDetail2["PAID_OVER"] = "paid_over";
  PayInvoiceDetail2["PAID_PARTIAL"] = "paid_partial";
  PayInvoiceDetail2["MARKED"] = "marked";
  return PayInvoiceDetail2;
})(PayInvoiceDetail || {});

// packages/core/src/auth/api-key-policy.ts
var ApiKeyResourceScope = /* @__PURE__ */ ((ApiKeyResourceScope2) => {
  ApiKeyResourceScope2["TEAM"] = "team";
  ApiKeyResourceScope2["PLATFORM"] = "platform";
  ApiKeyResourceScope2["EXPLICIT"] = "explicit";
  return ApiKeyResourceScope2;
})(ApiKeyResourceScope || {});
var ApiKeyCapability = /* @__PURE__ */ ((ApiKeyCapability2) => {
  ApiKeyCapability2["TEAM_READONLY"] = "team.readonly";
  ApiKeyCapability2["TEAM_READ_WRITE"] = "team.read_write";
  ApiKeyCapability2["SWAP_READONLY"] = "swap.readonly";
  ApiKeyCapability2["SWAP_READ_WRITE"] = "swap.read_write";
  ApiKeyCapability2["ESCROW_READONLY"] = "escrow.readonly";
  ApiKeyCapability2["ESCROW_OPERATIONS"] = "escrow.operations";
  ApiKeyCapability2["ESCROW_ADMIN"] = "escrow.admin";
  ApiKeyCapability2["PAY_READONLY"] = "pay.readonly";
  ApiKeyCapability2["PAY_READ_WRITE"] = "pay.read_write";
  return ApiKeyCapability2;
})(ApiKeyCapability || {});
var API_KEY_CAPABILITY_PERMISSIONS = {
  ["swap.readonly" /* SWAP_READONLY */]: [
    "agent:read_all" /* AGENT_READ_ALL */,
    "swap:read_all" /* SWAP_READ_ALL */,
    "fx:rates_read" /* FX_RATES_READ */
  ],
  ["swap.read_write" /* SWAP_READ_WRITE */]: [
    "agent:read_all" /* AGENT_READ_ALL */,
    "swap:read_all" /* SWAP_READ_ALL */,
    "swap:create" /* SWAP_CREATE */,
    "swap:cancel_all" /* SWAP_CANCEL_ALL */,
    "fx:rates_read" /* FX_RATES_READ */
  ],
  ["team.readonly" /* TEAM_READONLY */]: [
    "agent:read_all" /* AGENT_READ_ALL */,
    "swap:read_all" /* SWAP_READ_ALL */,
    "liquidity:read_all" /* LIQUIDITY_READ_ALL */,
    "fx:rates_read" /* FX_RATES_READ */,
    "reports:read_all" /* ANALYTICS_READ_ALL */
  ],
  ["team.read_write" /* TEAM_READ_WRITE */]: [
    "agent:read_all" /* AGENT_READ_ALL */,
    "agent:manage_all" /* AGENT_MANAGE_ALL */,
    "swap:read_all" /* SWAP_READ_ALL */,
    "swap:create" /* SWAP_CREATE */,
    "swap:cancel_all" /* SWAP_CANCEL_ALL */,
    "liquidity:read_all" /* LIQUIDITY_READ_ALL */,
    "liquidity:manage_all" /* LIQUIDITY_MANAGE_ALL */,
    "fx:rates_read" /* FX_RATES_READ */,
    "reports:read_all" /* ANALYTICS_READ_ALL */
  ],
  ["escrow.readonly" /* ESCROW_READONLY */]: ["escrow:read" /* ESCROW_READ */],
  ["escrow.operations" /* ESCROW_OPERATIONS */]: [
    "escrow:create" /* ESCROW_CREATE */,
    "escrow:read" /* ESCROW_READ */,
    "escrow:verify_funding" /* ESCROW_VERIFY_FUNDING */,
    "escrow:release" /* ESCROW_RELEASE */,
    "escrow:refund" /* ESCROW_REFUND */,
    "escrow:resolve_dispute" /* ESCROW_RESOLVE_DISPUTE */
  ],
  ["escrow.admin" /* ESCROW_ADMIN */]: ["escrow:descriptor_publish" /* ESCROW_DESCRIPTOR_PUBLISH */],
  ["pay.readonly" /* PAY_READONLY */]: [
    "pay:store_read" /* PAY_STORE_READ */,
    "pay:payment_read" /* PAY_PAYMENT_READ */,
    "pay:event_subscribe" /* PAY_EVENT_SUBSCRIBE */
  ],
  ["pay.read_write" /* PAY_READ_WRITE */]: [
    "pay:store_read" /* PAY_STORE_READ */,
    "pay:store_manage" /* PAY_STORE_MANAGE */,
    "pay:payment_read" /* PAY_PAYMENT_READ */,
    "pay:payment_create" /* PAY_PAYMENT_CREATE */,
    "pay:payment_cancel" /* PAY_PAYMENT_CANCEL */,
    "pay:event_subscribe" /* PAY_EVENT_SUBSCRIBE */
  ]
};

// packages/core/src/escrow/types.ts
var EscrowNetwork = /* @__PURE__ */ ((EscrowNetwork2) => {
  EscrowNetwork2["BITCOIN"] = "bitcoin";
  EscrowNetwork2["LIGHTNING"] = "lightning";
  EscrowNetwork2["SPARK"] = "spark";
  return EscrowNetwork2;
})(EscrowNetwork || {});
var PayoutDestinationType = /* @__PURE__ */ ((PayoutDestinationType2) => {
  PayoutDestinationType2["LIGHTNING_INVOICE"] = "lightning_invoice";
  PayoutDestinationType2["LIGHTNING_ADDRESS"] = "lightning_address";
  PayoutDestinationType2["BITCOIN_ADDRESS"] = "bitcoin_address";
  PayoutDestinationType2["SPARK_ADDRESS"] = "spark_address";
  PayoutDestinationType2["SPARK_INVOICE"] = "spark_invoice";
  return PayoutDestinationType2;
})(PayoutDestinationType || {});
var ParticipantRole = /* @__PURE__ */ ((ParticipantRole2) => {
  ParticipantRole2["USER"] = "user";
  ParticipantRole2["AGENT"] = "agent";
  ParticipantRole2["OPERATOR"] = "operator";
  return ParticipantRole2;
})(ParticipantRole || {});

// packages/core/src/wallet/types.ts
var OnchainConfirmationSpeed = /* @__PURE__ */ ((OnchainConfirmationSpeed2) => {
  OnchainConfirmationSpeed2["SLOW"] = "slow";
  OnchainConfirmationSpeed2["MEDIUM"] = "medium";
  OnchainConfirmationSpeed2["FAST"] = "fast";
  return OnchainConfirmationSpeed2;
})(OnchainConfirmationSpeed || {});
var WalletConnectionScope = /* @__PURE__ */ ((WalletConnectionScope2) => {
  WalletConnectionScope2["WALLET_READ"] = "wallet.read";
  WalletConnectionScope2["WALLET_RECEIVE"] = "wallet.receive";
  WalletConnectionScope2["WALLET_PAYMENT_READ"] = "wallet.payment.read";
  return WalletConnectionScope2;
})(WalletConnectionScope || {});
var WalletProvider = /* @__PURE__ */ ((WalletProvider2) => {
  WalletProvider2["BREEZ_SPARK"] = "breez_spark";
  return WalletProvider2;
})(WalletProvider || {});

// packages/sdk/src/disputes.ts
var segment = (value) => encodeURIComponent(value);
function queryString(query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== void 0) params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}
var EscrowDisputesClient = class {
  constructor(http) {
    this.http = http;
  }
  /** Lists all swaps currently requiring dispute arbitration. */
  list() {
    return this.http.request("/swap/disputed");
  }
  /** Reads the authoritative swap resource containing the dispute. */
  get(swapId) {
    return this.http.request(`/swap/${segment(swapId)}`);
  }
  /** Opens a dispute as an authorized swap participant. */
  open(swapId, input) {
    return this.http.request(`/swap/${segment(swapId)}/dispute`, {
      method: "POST",
      body: JSON.stringify(input)
    });
  }
  /** Adds participant evidence while the dispute is collecting evidence. */
  submitEvidence(swapId, input) {
    return this.http.request(
      `/swap/${segment(swapId)}/dispute-evidence`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  /**
   * Records the operator decision for an escrow-backed dispute.
   * Swaps without an escrow record use the API's compatibility path.
   */
  resolve(swapId, input) {
    return this.http.request(
      `/swap/${segment(swapId)}/resolve-dispute`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  /** Executes the payout required after a dispute enters refund state. */
  executeRefund(swapId, input) {
    return this.http.request(
      `/swap/${segment(swapId)}/execute-refund`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  /** Lists dispute history for one agent. */
  listForAgent(agentId, query = {}) {
    return this.http.request(
      `/swap/agent/${segment(agentId)}/disputes${queryString(query)}`
    );
  }
  /** Reads aggregate dispute outcomes and timing for one agent. */
  statsForAgent(agentId) {
    return this.http.request(
      `/swap/agent/${segment(agentId)}/dispute-stats`
    );
  }
};

// packages/sdk/src/escrow.ts
var segment2 = (value) => encodeURIComponent(value);
var SwapEscrowPaymentStatus = /* @__PURE__ */ ((SwapEscrowPaymentStatus2) => {
  SwapEscrowPaymentStatus2["PENDING"] = "PENDING";
  SwapEscrowPaymentStatus2["PROCESSING"] = "PROCESSING";
  SwapEscrowPaymentStatus2["COMPLETE"] = "COMPLETE";
  SwapEscrowPaymentStatus2["FAILED"] = "FAILED";
  SwapEscrowPaymentStatus2["EXPIRED"] = "EXPIRED";
  SwapEscrowPaymentStatus2["CANCELLED"] = "CANCELLED";
  SwapEscrowPaymentStatus2["NOT_APPLICABLE"] = "NOT_APPLICABLE";
  SwapEscrowPaymentStatus2["NOT_FOUND"] = "NOT_FOUND";
  return SwapEscrowPaymentStatus2;
})(SwapEscrowPaymentStatus || {});
var EscrowClient = class {
  constructor(http, events) {
    this.http = http;
    this.events = events;
    this.disputes = new EscrowDisputesClient(http);
  }
  disputes;
  create(teamId, input) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  list(teamId, query = {}) {
    const params = new URLSearchParams();
    if (query.limit !== void 0) params.set("limit", String(query.limit));
    if (query.offset !== void 0) params.set("offset", String(query.offset));
    const suffix = params.toString() ? `?${params}` : "";
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows${suffix}`
    );
  }
  get(teamId, reference) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows/${segment2(reference)}`
    );
  }
  payoutStatus(teamId, reference) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows/${segment2(reference)}/payout-status`
    );
  }
  audit(teamId, reference) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows/${segment2(reference)}/audit`
    );
  }
  verifyFunding(teamId, reference) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows/${segment2(reference)}/funding/verify`,
      { method: "POST" }
    );
  }
  /** Test-only command; production deployments reject it. */
  markMockFundingComplete(teamId, reference) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows/${segment2(reference)}/funding/mock-complete`,
      { method: "POST" }
    );
  }
  release(teamId, reference, input) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows/${segment2(reference)}/release`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  refund(teamId, reference, input) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows/${segment2(reference)}/refund`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  recordDisputeResolution(teamId, reference, input) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrows/${segment2(reference)}/dispute-resolution`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  getDescriptor(teamId) {
    return this.http.request(
      `/teams/${segment2(teamId)}/descriptors`
    );
  }
  publishDescriptor(teamId) {
    return this.http.request(
      `/teams/${segment2(teamId)}/descriptors/publish`,
      { method: "POST" }
    );
  }
  updateDescriptor(teamId, input) {
    return this.http.request(
      `/teams/${segment2(teamId)}/descriptors`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  updateDescriptorWallet(teamId, input) {
    return this.http.request(
      `/teams/${segment2(teamId)}/descriptors/wallet`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  getFeePolicy(teamId, descriptorId) {
    return this.http.request(
      `/teams/${segment2(teamId)}/descriptors/${segment2(descriptorId)}/escrow-fee-policy`
    );
  }
  updateFeePolicy(teamId, descriptorId, input) {
    return this.http.request(
      `/teams/${segment2(teamId)}/descriptors/${segment2(descriptorId)}/escrow-fee-policy`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  reconcile(teamId) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrow/reconcile`,
      { method: "POST" }
    );
  }
  reconcileSwap(teamId, reference, input = {}) {
    return this.http.request(
      `/teams/${segment2(teamId)}/escrow/${segment2(reference)}/reconcile-swap`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  subscribe(options) {
    const {
      teamId,
      escrowReferences: requestedReferences = [],
      ...eventOptions
    } = options;
    const references = new Set(requestedReferences);
    const sortedReferences = [...references].sort();
    return subscribeToDomainEvents(
      this.events,
      "escrow",
      Object.values(EscrowEventType),
      {
        ...eventOptions,
        partnerId: teamId,
        aggregateId: sortedReferences.length === 1 ? sortedReferences[0] : void 0,
        streamKey: eventOptions.streamKey ?? `escrow:${teamId}:${sortedReferences.join(",")}`
      },
      (event) => event.metadata.scope?.partnerId === teamId && (references.size === 0 || references.has(event.metadata.aggregateId))
    );
  }
};

// packages/sdk/src/otc/agents.ts
function queryString2(query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== void 0) params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}
var AgentsClient = class {
  constructor(http) {
    this.http = http;
  }
  register(input) {
    return this.http.request("/agents/register", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }
  list(query = {}) {
    return this.http.request(`/agents${queryString2(query)}`);
  }
  discover(query = {}) {
    return this.http.request(
      `/agents/discovery${queryString2(query)}`
    );
  }
  get(agentId) {
    return this.http.request(`/agents/${encodeURIComponent(agentId)}`);
  }
  update(agentId, input) {
    return this.http.request(`/agents/${encodeURIComponent(agentId)}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  }
  updateAvailability(agentId, input) {
    return this.http.request(
      `/agents/${encodeURIComponent(agentId)}/availability`,
      { method: "PUT", body: JSON.stringify(input) }
    );
  }
  deactivate(agentId) {
    return this.http.request(`/agents/${encodeURIComponent(agentId)}`, {
      method: "DELETE"
    });
  }
  validate(agentId, input) {
    return this.http.request(
      `/agents/${encodeURIComponent(agentId)}/validate`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  stats() {
    return this.http.request("/agents/stats");
  }
  swaps(agentId, query = {}) {
    return this.http.request(
      `/agents/${encodeURIComponent(agentId)}/swaps${queryString2(query)}`
    );
  }
  escrowStatus(agentId) {
    return this.http.request(
      `/swap/agent/${encodeURIComponent(agentId)}/escrow-status`
    );
  }
  disputes(agentId, query = {}) {
    return this.http.request(
      `/swap/agent/${encodeURIComponent(agentId)}/disputes${queryString2(query)}`
    );
  }
  disputeStats(agentId) {
    return this.http.request(
      `/swap/agent/${encodeURIComponent(agentId)}/dispute-stats`
    );
  }
  activatePartnerReferral(agentId, referralCode) {
    return this.http.request(
      `/agents/${encodeURIComponent(agentId)}/team-referral`,
      { method: "POST", body: JSON.stringify({ referralCode }) }
    );
  }
  listPartnerAgents(partnerId, query = {}) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/agents${queryString2(query)}`
    );
  }
  getPartnerAgent(partnerId, agentId) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/agents/${encodeURIComponent(agentId)}`
    );
  }
  updatePartnerAgentAvailability(partnerId, agentId, input) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/agents/${encodeURIComponent(agentId)}/availability`,
      { method: "PUT", body: JSON.stringify(input) }
    );
  }
  setPartnerAssociation(partnerId, agentId, input = {}) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/agents/${encodeURIComponent(agentId)}/association`,
      { method: "PUT", body: JSON.stringify(input) }
    );
  }
  removePartnerAssociation(partnerId, agentId) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/agents/${encodeURIComponent(agentId)}/association`,
      { method: "DELETE" }
    );
  }
};

// packages/sdk/src/otc/rates.ts
var RatesClient = class {
  constructor(http) {
    this.http = http;
  }
  quote(baseCurrency, targetCurrency) {
    return this.get(baseCurrency, targetCurrency);
  }
  get(baseCurrency, targetCurrency) {
    return this.http.request(
      `/fx/rates/${encodeURIComponent(baseCurrency)}/${encodeURIComponent(targetCurrency)}`
    );
  }
  detailed(baseCurrency, targetCurrency) {
    return this.http.request(
      `/fx/rates/${encodeURIComponent(baseCurrency)}/${encodeURIComponent(targetCurrency)}/detailed`
    );
  }
  supportedPairs() {
    return this.http.request("/fx/supported-pairs");
  }
  /** Fetches the rate policy resolved from a selected agent's partner. */
  quoteForAgent(agentId, request) {
    const params = new URLSearchParams({
      agentId,
      baseCurrency: request.baseCurrency,
      fiatCurrency: request.targetCurrency,
      ...request.amount ? { amount: request.amount } : {}
    });
    return this.http.request(`/swap/quote?${params}`);
  }
  /** Fetches a rate using an explicitly authorized partner context. */
  quoteForPartner(partnerId, request) {
    const params = new URLSearchParams({
      baseCurrency: request.baseCurrency,
      targetCurrency: request.targetCurrency,
      ...request.amount ? { amount: request.amount } : {}
    });
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/fx/rates/quote?${params}`
    );
  }
  detailedForPartner(partnerId, baseCurrency, targetCurrency) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/fx/rates/${encodeURIComponent(baseCurrency)}/${encodeURIComponent(targetCurrency)}/detailed`
    );
  }
  healthForPartner(partnerId) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/fx/health`
    );
  }
  sourceConfigForPartner(partnerId) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/fx/source-config`
    );
  }
  updateSourceConfigForPartner(partnerId, input) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/fx/source-config`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
};

// packages/sdk/src/otc/swap.ts
var SwapClient = class {
  constructor(http) {
    this.http = http;
  }
  create(input) {
    return this.http.request("/swap", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }
  get(swapId) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}`
    );
  }
  listDisputes() {
    return this.http.request("/swap/disputed");
  }
  list(query = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== void 0) params.set(key, String(value));
    }
    const suffix = params.toString() ? `?${params}` : "";
    return this.http.request(`/swap${suffix}`);
  }
  claim(swapId, input = {}) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/claim`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  cancel(swapId, input = {}) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/cancel`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  confirmPayment(swapId, input) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/confirm`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  submitPaymentProof(swapId, input) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/payment-proof`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  verifyEscrow(swapId) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/verify-escrow`,
      { method: "POST" }
    );
  }
  dispute(swapId, input) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/dispute`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  submitDisputeEvidence(swapId, input) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/dispute-evidence`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  executeRefund(swapId, input) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/execute-refund`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  resolveDispute(swapId, input) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/resolve-dispute`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  transfer(swapId, input) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/transfer`,
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  export(query = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== void 0) params.set(key, String(value));
    }
    return this.http.fetchResponse(`/swap/export?${params}`).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Swap export failed (${response.status})`);
      }
      return response.blob();
    });
  }
  repair(partnerId, swapId, input) {
    return this.http.request(
      `/teams/${encodeURIComponent(partnerId)}/swaps/${encodeURIComponent(swapId)}/repair`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  escrowStatus(swapId) {
    return this.http.request(
      `/swap/${encodeURIComponent(swapId)}/escrow-status`
    );
  }
};

// packages/sdk/src/otc/index.ts
var OtcClient = class {
  constructor(http, events) {
    this.events = events;
    this.swap = new SwapClient(http);
    this.rates = new RatesClient(http);
    this.agents = new AgentsClient(http);
  }
  swap;
  rates;
  agents;
  subscribe(options) {
    return subscribeToDomainEvents(
      this.events,
      "otc",
      Object.values(OtcEventType),
      options
    );
  }
};

// packages/sdk/src/pay/client.ts
var segment3 = (value) => encodeURIComponent(value);
var payPath = (partnerId) => partnerId ? `/partners/${segment3(partnerId)}/integrations/pay` : "/integrations/pay";
var PayClient = class {
  constructor(http, eventsClient, partnerId) {
    this.http = http;
    this.eventsClient = eventsClient;
    this.partnerId = partnerId;
  }
  /** Lists stores visible in this Partner scope. */
  async listStores() {
    const response = await this.http.request(
      `${payPath(this.partnerId)}/stores`
    );
    return response.items;
  }
  /** Creates a store in this Partner scope. */
  async createStore(input) {
    const response = await this.http.request(
      `${payPath(this.partnerId)}/stores`,
      { method: "POST", body: JSON.stringify(input) }
    );
    return response.store;
  }
  /** Subscribes to Pay events across this Partner, optionally for one store. */
  events(options) {
    return subscribeToDomainEvents(
      this.eventsClient,
      "pay",
      Object.values(PayEventType),
      {
        ...options,
        partnerId: this.partnerId,
        streamKey: options.streamKey ?? JSON.stringify({
          domain: "pay",
          partnerId: this.partnerId,
          storeId: options.storeId
        })
      }
    );
  }
  /** Returns a lazy resource handle for one store. No request is made yet. */
  getStore(storeId) {
    const normalizedStoreId = storeId.trim();
    if (!normalizedStoreId) throw new Error("A Pay store ID is required");
    return new PayStoreResource(
      this.http,
      this.eventsClient,
      normalizedStoreId,
      this.partnerId
    );
  }
};
var PayStoreResource = class {
  constructor(http, eventsClient, storeId, partnerId) {
    this.http = http;
    this.eventsClient = eventsClient;
    this.storeId = storeId;
    this.partnerId = partnerId;
  }
  /** Reads current stored and live provider state. */
  async read() {
    const response = await this.http.request(this.path());
    return response.store;
  }
  /** Connects or rotates the Partner wallet receiving this store's payments. */
  async connectWallet(input) {
    const response = await this.http.request(
      `${this.path()}/connect-wallet`,
      { method: "POST", body: JSON.stringify(input) }
    );
    return response.store;
  }
  /** Creates an idempotent invoice in this store. */
  async createInvoice(input, idempotencyKey) {
    const response = await this.http.request(
      `${this.path()}/invoices`,
      {
        method: "POST",
        body: JSON.stringify(input),
        headers: { "Idempotency-Key": idempotencyKey }
      }
    );
    return response.invoice;
  }
  /** Reads authoritative state for an invoice created in this store. */
  async getInvoice(invoiceId) {
    const response = await this.http.request(
      `${this.path()}/invoices/${segment3(invoiceId)}`
    );
    return response.invoice;
  }
  /** Subscribes to standard Minmo Pay events belonging to this store. */
  events(options) {
    return subscribeToDomainEvents(
      this.eventsClient,
      "pay.store",
      Object.values(PayEventType),
      {
        ...options,
        partnerId: this.partnerId,
        storeId: this.storeId,
        streamKey: options.streamKey ?? JSON.stringify({
          domain: "pay.store",
          partnerId: this.partnerId,
          storeId: this.storeId
        })
      }
    );
  }
  path() {
    return `${payPath(this.partnerId)}/stores/${segment3(this.storeId)}`;
  }
};

// packages/sdk/src/partner.ts
var segment4 = (value) => encodeURIComponent(value);
var partnerPath = (partnerId, suffix = "") => `/teams/${segment4(partnerId)}${suffix}`;
var requiredId = (value, label) => {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} is required`);
  return normalized;
};
var ApiKeyInvalidReason = /* @__PURE__ */ ((ApiKeyInvalidReason2) => {
  ApiKeyInvalidReason2["MANUALLY_REVOKED"] = "manually-revoked";
  ApiKeyInvalidReason2["EXPIRED"] = "expired";
  return ApiKeyInvalidReason2;
})(ApiKeyInvalidReason || {});
var ReferralCodeScope = /* @__PURE__ */ ((ReferralCodeScope2) => {
  ReferralCodeScope2["SYSTEM"] = "system";
  ReferralCodeScope2["TEAM"] = "team";
  return ReferralCodeScope2;
})(ReferralCodeScope || {});
async function readPartnerDetail(http, partnerId) {
  return http.request(partnerPath(partnerId));
}
var AccountClient = class {
  constructor(http, partnerId) {
    this.http = http;
    this.partnerId = partnerId;
  }
  async get() {
    const detail = await readPartnerDetail(this.http, this.partnerId);
    return detail.team;
  }
  async update(input) {
    return this.http.request(partnerPath(this.partnerId), {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  }
};
var SettingsClient = class {
  constructor(http, partnerId) {
    this.http = http;
    this.partnerId = partnerId;
  }
  async get() {
    return this.http.request(
      partnerPath(this.partnerId, "/currency-settings")
    );
  }
  async update(input) {
    return this.http.request(
      partnerPath(this.partnerId, "/currency-settings"),
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
};
var AnalyticsClient = class {
  constructor(http, partnerId) {
    this.http = http;
    this.partnerId = partnerId;
  }
  async get(options = {}) {
    const query = new URLSearchParams();
    if (options.bucket) query.set("bucket", options.bucket);
    const suffix = query.size ? `?${query.toString()}` : "";
    return this.http.request(
      partnerPath(this.partnerId, `/analytics${suffix}`)
    );
  }
};
var MembersClient = class {
  constructor(http, partnerId) {
    this.http = http;
    this.partnerId = partnerId;
  }
  async list() {
    const detail = await readPartnerDetail(this.http, this.partnerId);
    return detail.members;
  }
  async add(input) {
    return this.http.request(
      partnerPath(this.partnerId, "/members"),
      {
        method: "POST",
        body: JSON.stringify({ userId: input.localUserId })
      }
    );
  }
  async updateRoles(memberId, input) {
    const normalizedMemberId = requiredId(memberId, "A Partner member ID");
    return this.http.request(
      partnerPath(
        this.partnerId,
        `/members/${segment4(normalizedMemberId)}/roles`
      ),
      { method: "PATCH", body: JSON.stringify(input) }
    );
  }
  async remove(memberId) {
    const normalizedMemberId = requiredId(memberId, "A Partner member ID");
    return this.http.request(
      partnerPath(this.partnerId, `/members/${segment4(normalizedMemberId)}`),
      { method: "DELETE" }
    );
  }
};
var InvitationsClient = class {
  constructor(http, partnerId) {
    this.http = http;
    this.partnerId = partnerId;
  }
  async list() {
    const detail = await readPartnerDetail(this.http, this.partnerId);
    return detail.invitations;
  }
  async create(input) {
    return this.http.request(
      partnerPath(this.partnerId, "/invitations"),
      { method: "POST", body: JSON.stringify(input) }
    );
  }
};
var ApiKeysClient = class {
  constructor(http, partnerId) {
    this.http = http;
    this.partnerId = partnerId;
  }
  async list() {
    const detail = await readPartnerDetail(this.http, this.partnerId);
    return detail.apiKeys;
  }
  async create(input) {
    return this.http.request(
      partnerPath(this.partnerId, "/api-keys"),
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  async updatePolicy(apiKeyId, policy) {
    const normalizedApiKeyId = requiredId(apiKeyId, "A Partner API key ID");
    return this.http.request(
      partnerPath(
        this.partnerId,
        `/api-keys/${segment4(normalizedApiKeyId)}/policy`
      ),
      { method: "PATCH", body: JSON.stringify(policy) }
    );
  }
  async revoke(apiKeyId) {
    const normalizedApiKeyId = requiredId(apiKeyId, "A Partner API key ID");
    return this.http.request(
      partnerPath(this.partnerId, `/api-keys/${segment4(normalizedApiKeyId)}`),
      { method: "DELETE" }
    );
  }
};
var ReferralsClient = class {
  constructor(http, partnerId) {
    this.http = http;
    this.partnerId = partnerId;
  }
  async get() {
    return this.http.request(
      partnerPath(this.partnerId, "/referral-code")
    );
  }
  async rotate() {
    return this.http.request(
      partnerPath(this.partnerId, "/referral-code/rotate"),
      { method: "POST" }
    );
  }
};

// packages/sdk/src/wallet.ts
var segment5 = (value) => encodeURIComponent(value);
var walletPath = (teamId, walletId) => walletId ? `/teams/${segment5(teamId)}/wallets/${segment5(walletId)}` : `/teams/${segment5(teamId)}/wallets`;
var WalletClient = class {
  constructor(http, events) {
    this.http = http;
    this.events = events;
  }
  list(teamId) {
    return this.http.request(walletPath(teamId));
  }
  create(teamId, input) {
    return this.http.request(walletPath(teamId), {
      method: "POST",
      body: JSON.stringify(input)
    });
  }
  get(teamId, walletId) {
    return this.http.request(walletPath(teamId, walletId));
  }
  update(teamId, walletId, input) {
    return this.http.request(walletPath(teamId, walletId), {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  }
  delete(teamId, walletId) {
    return this.http.request(
      walletPath(teamId, walletId),
      {
        method: "DELETE"
      }
    );
  }
  overview(teamId, walletId) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/bitcoin/overview`
    );
  }
  history(teamId, walletId) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/bitcoin/history`
    );
  }
  receive(teamId, walletId, input) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/bitcoin/receive`,
      {
        method: "POST",
        body: JSON.stringify(input)
      }
    );
  }
  send(teamId, walletId, input) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/bitcoin/send`,
      {
        method: "POST",
        body: JSON.stringify(input)
      }
    );
  }
  quotePayout(teamId, walletId, input) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/payout-quote`,
      {
        method: "POST",
        body: JSON.stringify(input)
      }
    );
  }
  transfer(teamId, walletId, input, idempotencyKey) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/bitcoin/transfer`,
      {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(input)
      }
    );
  }
  revealSeed(teamId, walletId) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/seed/reveal`,
      { method: "POST" }
    );
  }
  stabilize(teamId, walletId, input) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/stable-balance/stabilize`,
      { method: "POST", body: JSON.stringify(input) }
    );
  }
  payoutStatus(teamId, walletId, reference) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/bitcoin/payouts/${segment5(reference)}`
    );
  }
  listConnections(teamId, walletId) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/connections`
    );
  }
  createConnection(teamId, walletId, input) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/connections`,
      {
        method: "POST",
        body: JSON.stringify(input)
      }
    );
  }
  revokeConnection(teamId, walletId, connectionId) {
    return this.http.request(
      `${walletPath(teamId, walletId)}/connections/${segment5(connectionId)}`,
      { method: "DELETE" }
    );
  }
  subscribe(options) {
    const {
      teamId,
      walletIds: requestedWalletIds = [],
      ...eventOptions
    } = options;
    const walletIds = new Set(requestedWalletIds);
    const sortedWalletIds = [...walletIds].sort();
    return subscribeToDomainEvents(
      this.events,
      "wallet",
      Object.values(WalletEventType),
      {
        ...eventOptions,
        partnerId: teamId,
        aggregateId: sortedWalletIds.length === 1 ? sortedWalletIds[0] : void 0,
        streamKey: eventOptions.streamKey ?? `wallet:${teamId}:${sortedWalletIds.join(",")}`
      },
      (event) => {
        const walletId = event.payload?.walletId ?? event.metadata.aggregateId;
        return event.metadata.scope?.partnerId === teamId && Boolean(walletId) && (walletIds.size === 0 || walletIds.has(walletId));
      }
    );
  }
};

// packages/sdk/src/index.ts
var MinmoClient = class {
  constructor(options, partnerId) {
    this.options = options;
    this.partnerId = partnerId;
    this.http = new HttpClient(options);
    this.events = new EventsClient(
      this.http,
      options.cursorStore,
      options.eventHydrators
    );
    this.escrow = new EscrowClient(this.http, this.events);
    this.wallet = new WalletClient(this.http, this.events);
    this.otc = new OtcClient(this.http, this.events);
    this.integrations = {
      pay: new PayClient(this.http, this.events, partnerId)
    };
  }
  http;
  events;
  escrow;
  wallet;
  otc;
  integrations;
  /**
   * Returns the same SDK interface bound to an explicitly selected Partner.
   * This does not grant access; the API still enforces the credential policy.
   */
  forPartner(partnerId) {
    const normalizedPartnerId = partnerId.trim();
    if (!normalizedPartnerId) throw new Error("A Partner ID is required");
    if (normalizedPartnerId === this.partnerId && this instanceof PartnerClient) {
      return this;
    }
    return new PartnerClient(this.options, normalizedPartnerId);
  }
};
var PartnerClient = class extends MinmoClient {
  account;
  settings;
  analytics;
  members;
  invitations;
  apiKeys;
  referrals;
  constructor(options, partnerId) {
    super(options, partnerId);
    this.account = new AccountClient(this.http, partnerId);
    this.settings = new SettingsClient(this.http, partnerId);
    this.analytics = new AnalyticsClient(this.http, partnerId);
    this.members = new MembersClient(this.http, partnerId);
    this.invitations = new InvitationsClient(this.http, partnerId);
    this.apiKeys = new ApiKeysClient(this.http, partnerId);
    this.referrals = new ReferralsClient(this.http, partnerId);
  }
};
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
  PartnerClient,
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
  WalletProvider
};
