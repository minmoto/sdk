import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = mkdtempSync(join(tmpdir(), "minmo-sdk-consumer-"));
const packOutput = execFileSync(
  "npm",
  ["pack", "--json", "--ignore-scripts", "--pack-destination", fixture],
  { cwd: root, encoding: "utf8" },
);
const packed = JSON.parse(packOutput)[0];
if (!packed?.filename) throw new Error("npm pack did not return a tarball");

writeFileSync(
  join(fixture, "package.json"),
  `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`,
);
execFileSync("npm", ["install", "--ignore-scripts", join(fixture, packed.filename)], {
  cwd: fixture,
  stdio: "inherit",
});
writeFileSync(
  join(fixture, "consumer.mjs"),
  [
    'import * as sdk from "@minmoto/sdk";',
    'if (typeof sdk.MinmoClient !== "function") throw new Error("MinmoClient missing");',
    'if ("MinmoAuth" in sdk) throw new Error("MinmoAuth must not be public");',
    'new sdk.MinmoClient({ partnerId: "partner-1", apiKey: "secret" });',
    "",
  ].join("\n"),
);
execFileSync("node", [join(fixture, "consumer.mjs")], { stdio: "inherit" });
writeFileSync(
  join(fixture, "consumer.ts"),
  [
    'import { Currency, MinmoClient, PaymentChannel, type MinmoClientOptions } from "@minmoto/sdk";',
    "const options: MinmoClientOptions = { partnerId: \"partner-1\", apiKey: \"secret\" };",
    "const client: MinmoClient = new MinmoClient(options);",
    "void client.account.get;",
    "void client.otc.rates.quote(Currency.BTC, Currency.KES);",
    "void PaymentChannel.MPESA_PHONE;",
    "",
  ].join("\n"),
);
execFileSync(
  process.execPath,
  [
    join(root, "node_modules", "typescript", "bin", "tsc"),
    join(fixture, "consumer.ts"),
    "--noEmit",
    "--strict",
    "--skipLibCheck",
    "--target",
    "ES2022",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--lib",
    "ES2022,DOM,DOM.Iterable",
  ],
  { cwd: fixture, stdio: "inherit" },
);

const installedPackage = JSON.parse(
  readFileSync(join(fixture, "node_modules", "@minmoto", "sdk", "package.json"), "utf8"),
);
if (installedPackage.dependencies && Object.keys(installedPackage.dependencies).length) {
  throw new Error("The public SDK must not have runtime dependencies");
}
console.log(`Installed and executed ${packed.filename} in an empty consumer`);
rmSync(fixture, { recursive: true, force: true });
