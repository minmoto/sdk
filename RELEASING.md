# Releasing

Releases are prepared by Release Please and published to npm by GitHub Actions.
Maintainers do not manually edit released versions, tags, release notes, or
changelog entries after automated releases begin.

## One-time repository setup

1. Protect `main` and require `CI / check` before merging pull requests.
2. Add a fine-grained `RELEASE_PLEASE_TOKEN` Actions secret with repository
   contents, pull-request, and issue write access. This is not an npm token.
3. Verify the initial `0.1.0` tarball from a clean checkout:

   ```sh
   npm ci
   npm run check
   npm run test:package
   npm pack --dry-run
   ```

4. Publish `0.1.0` once using an authorized Minmo npm maintainer. This bootstrap
   creates the package in the npm registry.
5. Configure an npm trusted publisher for organization `minmoto`, repository
   `sdk`, and workflow `release.yml`.
6. Require 2FA for package administration and disable token-based publication
   after trusted publishing succeeds.

Do not add a long-lived npm automation token to GitHub Actions.

## Preparing a release

### Refreshing the vendored Mini SDK

Start from a clean public SDK checkout and pin the intended Mini commit:

```sh
npm run refresh:upstream -- --ref <mini-commit>
```

The command uses the sibling `../mini` repository by default. It fetches that
repository's `origin`, installs locked dependencies in both repositories,
creates a temporary detached worktree at the resolved commit, builds
`@minmo/core` and the private SDK, regenerates `vendor/upstream`, and runs:

```sh
npm run check
npm run test:package
npm pack --dry-run
```

Use `--mini <path>` for another local Mini repository or `--no-fetch` when
the pinned commit is already available and the refresh must stay offline.

After the command succeeds, review:

- the old and new commits printed by the command;
- `vendor/upstream/manifest.json`;
- the generated artifact diff;
- every removed declaration line reported as a compatibility risk.

Commit only the generated vendor artifact and any public tests or documentation
that explain its consumer-visible changes. Do not commit `dist`, a package
tarball, or the temporary Mini worktree. The refresh command does not update
versions, changelogs, tags, or npm.

Merge changes using Conventional Commit subjects:

- `fix: ...` requests a patch release.
- `feat: ...` requests a minor release.
- `feat!: ...`, `fix!: ...`, or a `BREAKING CHANGE:` footer requests a major
  release.
- `docs:`, `test:`, `build:`, `ci:`, and `chore:` do not request a release by
  themselves.

An upstream refresh must identify the Mini commit in
`vendor/upstream/manifest.json`. Review that commit and the generated artifact
alongside the public changelog impact.

Release Please opens or updates a release pull request containing the next
version in `package.json` and `package-lock.json` and the generated changelog.
Review that pull request as the declaration of the public release.

## Publishing

Merging the Release Please pull request creates the version tag and GitHub
release. The publish job checks out that exact SHA, installs locked dependencies,
runs `prepack`, and publishes through npm OIDC with provenance.

If publication fails, do not move or recreate the tag. Fix the workflow or npm
trusted-publisher configuration and rerun the failed job. npm package versions
are immutable.
