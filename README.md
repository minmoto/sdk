# @minmoto/sdk

Build server-side Minmo Partner integrations in TypeScript.

`@minmoto/sdk` is the typed Node.js client for the
[Minmo](https://www.minmo.to) Partner API. It gives you one Partner-bound
interface for bringing Bitcoin and local-currency workflows into your own
services: quote rates, coordinate OTC swaps and agents, operate wallets and
escrow, create Minmo Pay stores and invoices, connect payment service
providers, generate accounting reports, and consume live domain events.

Create a client with your Partner ID and API key, then start calling
Partner-scoped resources. The production API is configured by default, so
there is no separate `forPartner()` step or browser-oriented authentication
flow.

## Why use the SDK?

- **Partner-bound by default.** Every client starts in the Partner context you
  provide, making the intended request scope explicit.
- **Typed from request to response.** TypeScript declarations cover inputs,
  resources, events, errors, currencies, payment channels, and domain states.
- **Built for backend services.** Authentication is intentionally limited to
  Partner API keys and the package targets Node.js server runtimes.
- **Small deployment surface.** The package ships as ESM with no runtime
  dependencies.
- **Useful defaults.** Minmo's production API URL is configured automatically,
  with an optional `baseUrl` for another Minmo deployment.

## Requirements

- Node.js 22 or newer
- A Minmo Partner ID
- A Partner API key with the capabilities required by your integration

Partner API keys are server secrets. Keep them in a secrets manager or private
server environment; never expose them to browser or mobile clients.

## Install

```sh
npm install @minmoto/sdk
```

## Quick start

```ts
import { MinmoClient } from "@minmoto/sdk";

const minmo = new MinmoClient({
  partnerId: process.env.MINMO_PARTNER_ID!,
  apiKey: process.env.MINMO_API_KEY!,
});

const partner = await minmo.account.get();

console.log(`Connected to ${partner.displayName}`);
```

`MinmoClient` requires a non-empty Partner ID and API key, then sends the key in
the `X-API-Key` header. Calls such as `account.get()`, `settings.get()`, and
`integrations.pay.listStores()` automatically use the configured Partner.

## What you can build

| Area | Client | Use it to |
| --- | --- | --- |
| Partner operations | `account`, `settings`, `analytics`, `members`, `invitations`, `apiKeys`, `referrals` | Manage the Partner account, team access, reporting, API keys, and referrals |
| Minmo Pay | `integrations.pay` | Create stores and invoices, connect settlement wallets, read authoritative invoice state, and subscribe to Pay events |
| Payment service providers | `integrations.psp` | Connect providers, collect and disburse funds, inspect liquidity and statements, reconcile transactions, and subscribe to PSP events |
| Accounting | `integrations.accounting` | List accounting sources, manage reporting templates, and generate CSV reports |
| OTC | `otc.rates`, `otc.swap`, `otc.agents` | Quote Bitcoin and local-currency rates, coordinate swaps, and operate an agent network |
| Wallets | `wallet` | Create and manage wallets, receive or send funds, transfer balances, and inspect wallet activity |
| Escrow | `escrow` | Create and reconcile escrows, verify funding, release or refund funds, and manage disputes |
| Events | `events` and domain subscriptions | React to Partner, Pay, OTC, wallet, and escrow changes with typed events |

For example, request a typed BTC/KES quote and list the Partner's Minmo Pay
stores:

```ts
import { Currency, MinmoClient } from "@minmoto/sdk";

const minmo = new MinmoClient({
  partnerId: process.env.MINMO_PARTNER_ID!,
  apiKey: process.env.MINMO_API_KEY!,
});

const [quote, stores] = await Promise.all([
  minmo.otc.rates.quote(Currency.BTC, Currency.KES),
  minmo.integrations.pay.listStores(),
]);
```

For payment-provider and accounting integrations, use the same Partner-bound
client:

```ts
import { MinmoClient, SourceType } from "@minmoto/sdk";

const minmo = new MinmoClient({
  partnerId: process.env.MINMO_PARTNER_ID!,
  apiKey: process.env.MINMO_API_KEY!,
});

const [providers, accountingSources] = await Promise.all([
  minmo.integrations.psp.listProviders(),
  minmo.integrations.accounting.listSources(SourceType.PSP_CONNECTION),
]);
```

### Subscribe to live changes

Domain clients expose typed subscriptions alongside their command and query
methods. With a cursor store, a subscription can resume after reconnecting and
reports when an authoritative resync is required.

```ts
const subscription = minmo.integrations.pay.events({
  onEvent(event) {
    console.log(event.type, event.id);
  },
  onError(error) {
    console.error("Minmo Pay event stream failed", error.message);
  },
});

await subscription.ready;

// Close the stream during application shutdown.
await subscription.close();
```

Treat an event as a signal that something changed. When current state matters,
read the corresponding resource again through the SDK.

## Configuration

```ts
import {
  MINMO_PRODUCTION_BASE_URL,
  MinmoClient,
  type MinmoClientOptions,
} from "@minmoto/sdk";

const options: MinmoClientOptions = {
  partnerId: process.env.MINMO_PARTNER_ID!,
  apiKey: process.env.MINMO_API_KEY!,
  baseUrl: process.env.MINMO_BASE_URL ?? MINMO_PRODUCTION_BASE_URL,
};

const minmo = new MinmoClient(options);
```

| Option | Required | Description |
| --- | --- | --- |
| `partnerId` | Yes | Partner scope used by Partner-bound resources |
| `apiKey` | Yes | Secret Partner API key sent as `X-API-Key` |
| `baseUrl` | No | Minmo API base URL; defaults to `https://api.minmo.to/api/v1` |

## Error handling

The SDK exposes typed errors so your service can distinguish authentication,
authorization, rate-limit, transport, and other API failures.

```ts
import { MinmoSdkError } from "@minmoto/sdk";

try {
  await minmo.integrations.pay.listStores();
} catch (error) {
  if (error instanceof MinmoSdkError) {
    console.error({
      code: error.code,
      status: error.status,
      requestId: error.requestId,
      retryable: error.retryable,
    });
  }

  throw error;
}
```

Use `retryable` as an input to your retry policy, not as permission to retry
without limits. Apply bounded backoff and preserve idempotency keys for
money-moving commands.

## Authentication and security

`@minmoto/sdk` supports only Partner API-key authentication. It does not export
bearer-token or token-provider authentication helpers.

- Construct the client only in trusted server code.
- Never place the API key in `NEXT_PUBLIC_`, `VITE_`, or an equivalent public
  environment variable.
- Do not log client options, request headers, API keys, or sensitive response
  bodies.
- Grant each key only the capabilities its integration needs, and rotate or
  revoke keys according to your operational policy.
- Keep idempotency keys stable when retrying commands that can move money or
  create payable resources.

The Partner ID selects request scope; it does not grant access. The Minmo API
continues to enforce the API key's Partner access and capability policy for
every request.

## Contributing

The public SDK is built from a pinned Minmo SDK artifact. CI verifies its
checksum, public export boundary, generated declarations, and packed consumer
experience.

```sh
npm install
npm run check
npm run test:package
npm pack --dry-run
```

See [`AGENTS.md`](./AGENTS.md) for contributor guidance and
[`RELEASING.md`](./RELEASING.md) for the release process. Bugs and feature
requests are welcome in [GitHub Issues](https://github.com/minmoto/sdk/issues).

## License

MIT © Minmo. See [`LICENSE`](./LICENSE).
