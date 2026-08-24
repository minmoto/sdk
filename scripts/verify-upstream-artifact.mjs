import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vendor = join(root, "vendor", "upstream");
const manifest = JSON.parse(readFileSync(join(vendor, "manifest.json"), "utf8"));
const actual = hashArtifact(vendor);

if (!/^[0-9a-f]{40}$/.test(manifest.upstreamCommit ?? "")) {
  throw new Error("Upstream manifest does not contain a full Git commit SHA");
}
if (actual !== manifest.artifactSha256) {
  throw new Error(
    `Upstream artifact checksum mismatch: expected ${manifest.artifactSha256}, received ${actual}`,
  );
}
console.log(`Verified Mini SDK artifact ${manifest.upstreamCommit}`);

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
