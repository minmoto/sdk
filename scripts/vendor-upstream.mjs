import { build } from "esbuild";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const worktree = resolve(readOption("--worktree"));
const vendorRoot = join(repositoryRoot, "vendor", "upstream");
const sdkDist = join(worktree, "packages", "sdk", "dist");
const coreDist = join(worktree, "packages", "core", "dist");
const sdkSource = join(worktree, "packages", "sdk", "src");
const coreSource = join(worktree, "packages", "core", "src", "index.ts");

assertCleanWorktree(worktree);
assertDirectory(sdkDist, "Build @minmo/sdk in the clean worktree first");
assertDirectory(coreDist, "Build @minmo/core in the clean worktree first");

rmSync(vendorRoot, { recursive: true, force: true });
mkdirSync(vendorRoot, { recursive: true });

const runtimeEntry = join(vendorRoot, "runtime-entry.mjs");
writeFileSync(
  runtimeEntry,
  [
    "export {",
    "  MinmoApiError,",
    "  MinmoAuthenticationError,",
    "  MinmoAuthorizationError,",
    "  MinmoRateLimitError,",
    "  MinmoSdkError,",
    "  MinmoTransportError,",
    `} from ${JSON.stringify(join(sdkSource, "http.ts"))};`,
    `export { PartnerClient } from ${JSON.stringify(join(sdkSource, "index.ts"))};`,
    "export { EventConnectionState, MemoryEventCursorStore, ResyncRequiredError }",
    `  from ${JSON.stringify(join(sdkSource, "events.ts"))};`,
    `export { SwapEscrowPaymentStatus } from ${JSON.stringify(join(sdkSource, "escrow.ts"))};`,
    `export { ApiKeyInvalidReason, ReferralCodeScope } from ${JSON.stringify(join(sdkSource, "partner.ts"))};`,
    "export {",
    "  AgentSelectionMode,",
    "  AgentStatus,",
    "  AgentTeamAssociationStatus,",
    "  AgentTeamAssociationVisibility,",
    "  AnalyticsBucket,",
    "  ApiKeyCapability,",
    "  ApiKeyResourceScope,",
    "  BitcoinNetwork,",
    "  ConfirmationRole,",
    "  Currency,",
    "  DisputeResolution,",
    "  EscrowEventType,",
    "  EscrowNetwork,",
    "  FxRateProvider,",
    "  OnchainConfirmationSpeed,",
    "  OtcEventType,",
    "  ParticipantRole,",
    "  PayErrorCode,",
    "  PayEventType,",
    "  PayInvoiceDetail,",
    "  PayInvoiceStatus,",
    "  PayStoreStatus,",
    "  PaymentChannel,",
    "  PayoutDestinationType,",
    "  Permission,",
    "  SwapState,",
    "  SwapType,",
    "  TeamRole,",
    "  WalletConnectionScope,",
    "  WalletEventType,",
    "  WalletProvider,",
    `} from ${JSON.stringify(coreSource)};`,
    "",
  ].join("\n"),
);

await build({
  entryPoints: [runtimeEntry],
  outfile: join(vendorRoot, "runtime.mjs"),
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node22",
  sourcemap: false,
  packages: "bundle",
  alias: {
    "@minmo/core": coreSource,
  },
  absWorkingDir: worktree,
  logLevel: "info",
});
rmSync(runtimeEntry);

copyDeclarations(sdkDist, join(vendorRoot, "sdk"));
copyDeclarations(coreDist, join(vendorRoot, "core"));
writeFileSync(
  join(vendorRoot, "runtime.d.mts"),
  [
    'export { PartnerClient } from "./sdk/index.js";',
    "export {",
    "  MinmoApiError,",
    "  MinmoAuthenticationError,",
    "  MinmoAuthorizationError,",
    "  MinmoRateLimitError,",
    "  MinmoSdkError,",
    "  MinmoTransportError,",
    '} from "./sdk/http.js";',
    'export { EventConnectionState, MemoryEventCursorStore, ResyncRequiredError } from "./sdk/events.js";',
    'export { SwapEscrowPaymentStatus } from "./sdk/escrow.js";',
    'export { ApiKeyInvalidReason, ReferralCodeScope } from "./sdk/partner.js";',
    "export {",
    "  AgentSelectionMode,",
    "  AgentStatus,",
    "  AgentTeamAssociationStatus,",
    "  AgentTeamAssociationVisibility,",
    "  AnalyticsBucket,",
    "  ApiKeyCapability,",
    "  ApiKeyResourceScope,",
    "  BitcoinNetwork,",
    "  ConfirmationRole,",
    "  Currency,",
    "  DisputeResolution,",
    "  EscrowEventType,",
    "  EscrowNetwork,",
    "  FxRateProvider,",
    "  OnchainConfirmationSpeed,",
    "  OtcEventType,",
    "  ParticipantRole,",
    "  PayErrorCode,",
    "  PayEventType,",
    "  PayInvoiceDetail,",
    "  PayInvoiceStatus,",
    "  PayStoreStatus,",
    "  PaymentChannel,",
    "  PayoutDestinationType,",
    "  Permission,",
    "  SwapState,",
    "  SwapType,",
    "  TeamRole,",
    "  WalletConnectionScope,",
    "  WalletEventType,",
    "  WalletProvider,",
    '} from "./core/index.js";',
    "",
  ].join("\n"),
);

const upstreamCommit = execFileSync("git", ["-C", worktree, "rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const manifest = {
  schemaVersion: 1,
  upstreamRepository: "https://github.com/minmoto/mini",
  upstreamCommit,
  artifactSha256: hashArtifact(vendorRoot),
};
writeFileSync(
  join(vendorRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

function readOption(name) {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) {
    console.error(`Usage: npm run vendor:upstream -- ${name} /path/to/clean/mini-worktree`);
    process.exit(2);
  }
  return value;
}

function assertCleanWorktree(path) {
  const status = execFileSync("git", ["-C", path, "status", "--porcelain"], {
    encoding: "utf8",
  }).trim();
  if (status) throw new Error("The Mini worktree must be clean before vendoring");
}

function assertDirectory(path, message) {
  if (!existsSync(path) || !statSync(path).isDirectory()) {
    throw new Error(`${message}: ${path}`);
  }
}

function copyDeclarations(source, destination) {
  for (const file of listFiles(source)) {
    if (!file.endsWith(".d.ts") || file.endsWith(".spec.d.ts")) continue;
    const target = join(destination, relative(source, file));
    mkdirSync(dirname(target), { recursive: true });
    cpSync(file, target);
  }
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function hashArtifact(directory) {
  const hash = createHash("sha256");
  for (const file of listFiles(directory)
    .filter((path) => !path.endsWith("manifest.json"))
    .sort()) {
    hash.update(relative(directory, file));
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}
