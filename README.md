# @minmoto/sdk

The server-side TypeScript client for Minmo Partners.

The public package is a small API-key-only facade over the SDK implementation
maintained in the private Minmo monorepo. It binds one Partner when constructed
and defaults to the Minmo production API.

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

const account = await minmo.account.get();
const stores = await minmo.integrations.pay.listStores();
```

`baseUrl` is optional and defaults to `https://api.minmo.to/api/v1`:

```ts
const staging = new MinmoClient({
  partnerId: process.env.MINMO_PARTNER_ID!,
  apiKey: process.env.MINMO_API_KEY!,
  baseUrl: "https://api.staging.minmo.to/api/v1",
});
```

The constructor produces the Partner-bound SDK interface directly. Calls such
as `account.get()`, `settings.get()`, and `integrations.pay.listStores()` use the
configured Partner without a separate `forPartner()` setup call.

## Authentication and security

`@minmoto/sdk` supports only Partner API-key authentication. It sends the key in
the `X-API-Key` request header and does not export bearer-token or token-provider
authentication helpers.

Partner API keys are server secrets:

- Do not construct this client in browser code.
- Do not expose the key through `NEXT_PUBLIC_`, `VITE_`, or equivalent public
  environment variables.
- Do not log client options, request headers, or API keys.
- Store production keys in a secrets manager and grant only the capabilities
  required by the integration.

The Partner ID selects request scope. Authorization remains enforced by the
Minmo API; selecting a Partner never grants access to it.

## Upstream implementation

The SDK implementation and shared contracts are built in the private
`minmoto/mini` repository. This repository vendors an immutable build artifact
under `vendor/upstream` and publishes only the constrained facade in `dist`.

`vendor/upstream/manifest.json` records the exact Mini commit and a SHA-256
checksum covering every vendored file. CI verifies the checksum, ensures the
public output has no private package imports, installs the packed tarball into
an empty consumer, and confirms that private authentication providers are not
exported.

To update from a clean, built Mini worktree:

```sh
npm run vendor:upstream -- --worktree /path/to/clean/mini-worktree
npm run check
npm run test:package
npm pack --dry-run
```

Never vendor from a dirty worktree or publish `dist` from a different revision
than the one recorded in the upstream manifest.

## Contributing and releasing

Contributor instructions are in [`AGENTS.md`](./AGENTS.md). The repository uses
Conventional Commits, Release Please, semantic versioning, and npm trusted
publishing with provenance. See [`RELEASING.md`](./RELEASING.md) for the release
and one-time registry setup.

The package is MIT-licensed; see [`LICENSE`](./LICENSE).
