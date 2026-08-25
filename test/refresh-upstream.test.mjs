import assert from "node:assert/strict";
import { test } from "node:test";

import {
  parseOptions,
  removedDeclarationLines,
} from "../scripts/refresh-upstream.mjs";

test("parses a pinned upstream ref with safe defaults", () => {
  assert.deepEqual(
    parseOptions(["--ref", "origin/main"], {
      defaultMiniPath: "/repos/mini",
    }),
    {
      ref: "origin/main",
      miniRepository: "/repos/mini",
      fetch: true,
      help: false,
    },
  );
});

test("supports an explicit Mini repository and offline resolution", () => {
  const options = parseOptions([
    "--ref",
    "4e5e473c834535699553ede6b9c4923eef443d96",
    "--mini",
    "/tmp/mini",
    "--no-fetch",
  ]);

  assert.equal(
    options.ref,
    "4e5e473c834535699553ede6b9c4923eef443d96",
  );
  assert.equal(options.miniRepository, "/tmp/mini");
  assert.equal(options.fetch, false);
});

test("requires a ref and rejects incomplete options", () => {
  assert.throws(() => parseOptions([]), /--ref is required/);
  assert.throws(() => parseOptions(["--ref"]), /--ref requires a value/);
  assert.throws(() => parseOptions(["--unknown"]), /Unknown option/);
});

test("reports removed declaration lines without implementation noise", () => {
  const diff = [
    "diff --git a/vendor/upstream/sdk/pay/client.d.ts b/vendor/upstream/sdk/pay/client.d.ts",
    "index 1111111..2222222 100644",
    "--- a/vendor/upstream/sdk/pay/client.d.ts",
    "+++ b/vendor/upstream/sdk/pay/client.d.ts",
    "@@ -1,2 +1 @@",
    "-    export(query?: Query): Promise<Blob>;",
    "     create(): Promise<void>;",
    "diff --git a/vendor/upstream/runtime.mjs b/vendor/upstream/runtime.mjs",
    "index 3333333..4444444 100644",
    "--- a/vendor/upstream/runtime.mjs",
    "+++ b/vendor/upstream/runtime.mjs",
    "@@ -1 +1 @@",
    "-implementation detail",
    "+replacement detail",
    "",
  ].join("\n");

  assert.deepEqual(removedDeclarationLines(diff), [
    {
      file: "vendor/upstream/sdk/pay/client.d.ts",
      line: "    export(query?: Query): Promise<Blob>;",
    },
  ]);
});
