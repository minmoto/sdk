import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
if (!existsSync(join(dist, "index.js")) || !existsSync(join(dist, "index.d.ts"))) {
  throw new Error("dist must contain index.js and index.d.ts");
}

const forbidden = [
  "@minmo/core",
  "BearerAuthProvider",
  "TokenProviderAuthProvider",
  "tokenProvider(",
  "sourceMappingURL",
];
for (const file of listFiles(dist)) {
  if (/\.spec\.|\.map$/.test(file)) {
    throw new Error(`Unexpected generated artifact: ${file}`);
  }
  const contents = readFileSync(file, "utf8");
  for (const pattern of forbidden) {
    if (contents.includes(pattern)) {
      throw new Error(`Forbidden public artifact reference ${pattern} in ${file}`);
    }
  }
  if (/export\s*\{[^}]*\bMinmoAuth\b/s.test(contents)) {
    throw new Error(`Private MinmoAuth export found in ${file}`);
  }
}
console.log("Verified self-contained API-key-only dist");

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}
