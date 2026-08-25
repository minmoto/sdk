import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = resolve(dirname(scriptPath), "..");
const defaultMiniRepository = resolve(repositoryRoot, "..", "mini");
const manifestPath = join(
  repositoryRoot,
  "vendor",
  "upstream",
  "manifest.json",
);

const usage = [
  "Usage:",
  "  npm run refresh:upstream -- --ref <commit-or-ref> [--mini <path>] [--no-fetch]",
  "",
  "Options:",
  "  --ref <commit-or-ref>  Mini commit or ref to vendor (required)",
  "  --mini <path>          Mini repository (default: ../mini)",
  "  --no-fetch             Resolve the ref without fetching origin first",
  "  --help                 Show this help",
  "",
].join("\n");

export function parseOptions(
  args,
  { defaultMiniPath = defaultMiniRepository } = {},
) {
  const options = {
    ref: undefined,
    miniRepository: resolve(defaultMiniPath),
    fetch: true,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--help") {
      options.help = true;
      continue;
    }
    if (option === "--no-fetch") {
      options.fetch = false;
      continue;
    }
    if (option === "--ref") {
      options.ref = requiredOptionValue(args, ++index, option);
      continue;
    }
    if (option === "--mini") {
      options.miniRepository = resolve(
        requiredOptionValue(args, ++index, option),
      );
      continue;
    }
    throw new Error("Unknown option: " + option);
  }

  if (!options.help && !options.ref) {
    throw new Error("--ref is required");
  }
  return options;
}

export function removedDeclarationLines(diff) {
  const removals = [];
  let declarationFile;

  for (const line of diff.split("\n")) {
    const header = /^diff --git a\/(.+) b\/(.+)$/.exec(line);
    if (header) {
      declarationFile = /\.d\.(?:ts|mts)$/.test(header[2])
        ? header[2]
        : undefined;
      continue;
    }
    if (
      declarationFile &&
      line.startsWith("-") &&
      !line.startsWith("---")
    ) {
      removals.push({ file: declarationFile, line: line.slice(1) });
    }
  }

  return removals;
}

export function refreshUpstream(options) {
  assertDirectory(options.miniRepository, "Mini repository");
  assertCleanSdkCheckout();

  run("npm", ["ci"], repositoryRoot);
  const previousManifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (options.fetch) {
    run("git", ["fetch", "origin"], options.miniRepository);
  }

  const upstreamCommit = capture(
    "git",
    ["rev-parse", "--verify", options.ref + "^{commit}"],
    options.miniRepository,
  ).trim();
  if (!/^[0-9a-f]{40}$/.test(upstreamCommit)) {
    throw new Error(
      "Could not resolve a full Mini commit for " + options.ref,
    );
  }

  const temporaryRoot = mkdtempSync(join(tmpdir(), "minmo-sdk-vendor-"));
  const miniWorktree = join(temporaryRoot, "mini");
  let worktreeAdded = false;

  try {
    run(
      "git",
      ["worktree", "add", "--detach", miniWorktree, upstreamCommit],
      options.miniRepository,
    );
    worktreeAdded = true;

    run("npm", ["ci"], miniWorktree);
    run(
      "npm",
      ["run", "build", "--workspace=@minmo/core"],
      miniWorktree,
    );
    run(
      "npm",
      ["run", "build", "--workspace=@minmo/sdk"],
      miniWorktree,
    );
    run(
      process.execPath,
      [
        join(repositoryRoot, "scripts", "vendor-upstream.mjs"),
        "--worktree",
        miniWorktree,
      ],
      repositoryRoot,
    );

    run("npm", ["run", "check"], repositoryRoot);
    run("npm", ["run", "test:package"], repositoryRoot);
    run("npm", ["pack", "--dry-run"], repositoryRoot);

    reportRefresh(previousManifest.upstreamCommit, upstreamCommit);
  } finally {
    if (worktreeAdded) {
      try {
        run(
          "git",
          ["worktree", "remove", "--force", miniWorktree],
          options.miniRepository,
        );
      } catch (error) {
        console.error(
          "Failed to remove temporary Mini worktree: " + error.message,
        );
      }
    }
    try {
      run("git", ["worktree", "prune"], options.miniRepository);
    } catch (error) {
      console.error("Failed to prune Mini worktrees: " + error.message);
    }
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function requiredOptionValue(args, index, option) {
  const value = args[index];
  if (!value || value.startsWith("--")) {
    throw new Error(option + " requires a value");
  }
  return value;
}

function assertCleanSdkCheckout() {
  const status = capture("git", ["status", "--porcelain"], repositoryRoot).trim();
  if (status) {
    throw new Error(
      "The public SDK checkout must be clean before refreshing vendored artifacts",
    );
  }
}

function assertDirectory(path, label) {
  if (!existsSync(path) || !statSync(path).isDirectory()) {
    throw new Error(label + " does not exist: " + path);
  }
}

function run(command, args, cwd) {
  console.log("\n> " + command + " " + args.join(" "));
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

function capture(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
}

function reportRefresh(previousCommit, upstreamCommit) {
  const stat = capture(
    "git",
    ["diff", "--stat", "--", "vendor/upstream"],
    repositoryRoot,
  ).trim();
  const declarationDiff = capture(
    "git",
    [
      "diff",
      "--unified=0",
      "--",
      "vendor/upstream/runtime.d.mts",
      ":(glob)vendor/upstream/**/*.d.ts",
    ],
    repositoryRoot,
  );
  const removals = removedDeclarationLines(declarationDiff);

  console.log("\nVendored Mini SDK refresh complete");
  console.log("  previous: " + previousCommit);
  console.log("  current:  " + upstreamCommit);
  console.log("\nGenerated artifact diff:");
  console.log(stat || "  No vendored artifact changes");

  if (removals.length === 0) {
    console.log("\nNo removed declaration lines detected.");
    return;
  }

  console.log(
    "\nRemoved declaration lines require compatibility review before release:",
  );
  for (const removal of removals.slice(0, 100)) {
    console.log("  - " + removal.file + ": " + removal.line);
  }
  if (removals.length > 100) {
    console.log("  ... and " + (removals.length - 100) + " more");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  try {
    const options = parseOptions(process.argv.slice(2));
    if (options.help) {
      console.log(usage);
    } else {
      refreshUpstream(options);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    console.error("\n" + usage);
    process.exitCode = 1;
  }
}
