# AGENTS.md

## Purpose

This repository publishes `@minmoto/sdk`, the server-side, API-key-only facade for
the Minmo Partner API. The implementation is built in private `minmoto/mini`;
this repository owns the stable public constructor, export boundary,
documentation, packaging, and releases.

## Repository map

- `src/index.ts` is the public facade and only source entrypoint.
- `vendor/upstream/` contains generated runtime and declaration artifacts from a
  pinned, clean Mini worktree.
- `vendor/upstream/manifest.json` records the upstream commit and artifact hash.
- `scripts/vendor-upstream.mjs` refreshes the vendored artifact.
- `scripts/verify-upstream-artifact.mjs` verifies artifact integrity.
- `scripts/verify-dist.mjs` enforces the public export and dependency boundary.
- `test/facade.test.mjs` tests Partner binding, URL selection, and authentication.
- `RELEASING.md` documents Release Please and npm trusted publishing.
- `dist/` is generated and must not be committed.

## Development commands

Use Node.js 22 or newer and npm only.

```sh
npm install
npm run check
npm run test:package
npm pack --dry-run
```

`npm run check` verifies the upstream checksum, type-checks, builds, tests, and
scans the generated package. `npm run test:package` installs the tarball in an
empty fixture to prove that no private registry or workspace dependency is
required.

## Public contract

- `MinmoClient` requires `partnerId` and `apiKey`.
- `baseUrl` is optional and defaults to `https://api.minmo.to/api/v1`.
- The constructed object is the Partner-bound client experience.
- `X-API-Key` is the only supported public authentication mechanism.
- Do not export `MinmoAuth`, bearer auth, token providers, the generic private
  client, or private package imports.
- Keep Partner API keys server-side and out of logs and public environment
  variables.
- Preserve existing exported names and behavior according to semantic
  versioning.

## Updating the upstream artifact

Use a detached, clean Mini worktree at the intended commit. Build `@minmo/core`
before the private SDK workspace, then run:

```sh
npm run vendor:upstream -- --worktree /path/to/mini-worktree
```

Review `vendor/upstream/manifest.json`, run the full verification commands, and
commit the generated artifact together with any facade or documentation changes
that depend on it. Never edit generated vendor files by hand.

## Compatibility and releases

Use Conventional Commit subjects. Release Please determines versions and
generates `CHANGELOG.md`. Breaking constructor, export, authentication, or
Partner-scoping changes require a major release after `1.0.0` and should be
called out explicitly during `0.x` releases.

The package tarball must contain only `dist`, `README.md`, `CHANGELOG.md`, and
`LICENSE`. Do not commit credentials, generated `dist`, package tarballs, source
maps, declaration maps, test builds, or private repository paths.

Before handing work back, report the exact upstream commit, changed files, and
verification commands actually run.
