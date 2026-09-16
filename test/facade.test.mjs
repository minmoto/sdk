import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  MINMO_PRODUCTION_BASE_URL,
  MinmoClient,
  PspProvider,
  SourceType,
} from "../dist/index.js";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("binds the Partner and API key with the production URL by default", async () => {
  let request;
  globalThis.fetch = async (input, init) => {
    request = new Request(input, init);
    return Response.json({
      team: {
        id: "partner/1",
        displayName: "Partner",
        profileImageUrl: null,
        createdAt: null,
      },
      members: [],
      invitations: [],
      apiKeys: [],
    });
  };

  const client = new MinmoClient({
    partnerId: " partner/1 ",
    apiKey: " secret-key ",
  });
  await client.account.get();

  assert.equal(MINMO_PRODUCTION_BASE_URL, "https://api.minmo.to/api/v1");
  assert.equal(
    request.url,
    "https://api.minmo.to/api/v1/teams/partner%2F1",
  );
  assert.equal(request.headers.get("X-API-Key"), "secret-key");
  assert.equal(request.headers.get("Authorization"), null);
});

test("accepts an optional deployment base URL", async () => {
  let url;
  globalThis.fetch = async (input) => {
    url = String(input);
    return Response.json({
      team: {
        id: "partner-1",
        displayName: "Partner",
        profileImageUrl: null,
        createdAt: null,
      },
      members: [],
      invitations: [],
      apiKeys: [],
    });
  };

  const client = new MinmoClient({
    partnerId: "partner-1",
    apiKey: "secret-key",
    baseUrl: "https://api.staging.minmo.to/api/v1/",
  });
  await client.account.get();

  assert.equal(url, "https://api.staging.minmo.to/api/v1/teams/partner-1");
});

test("binds PSP and accounting integrations to the Partner API key", async () => {
  const requests = [];
  globalThis.fetch = async (input, init) => {
    requests.push(new Request(input, init));
    return Response.json([]);
  };

  const client = new MinmoClient({
    partnerId: "partner/1",
    apiKey: "secret-key",
  });

  await client.integrations.psp.listProviders();
  await client.integrations.accounting.listSources(SourceType.PSP_CONNECTION);

  assert.deepEqual(
    requests.map((request) => request.url),
    [
      "https://api.minmo.to/api/v1/teams/partner%2F1/psp/providers",
      "https://api.minmo.to/api/v1/teams/partner%2F1/accounting/sources?type=psp_connection",
    ],
  );
  assert.deepEqual(
    requests.map((request) => request.headers.get("X-API-Key")),
    ["secret-key", "secret-key"],
  );
  assert.equal(PspProvider.SAFARICOM_DARAJA, "safaricom_daraja");
});

test("rejects blank Partner IDs and API keys", () => {
  assert.throws(
    () => new MinmoClient({ partnerId: " ", apiKey: "secret-key" }),
    /Partner ID is required/,
  );
  assert.throws(
    () => new MinmoClient({ partnerId: "partner-1", apiKey: " " }),
    /API key is required/,
  );
});

test("does not export private authentication providers", async () => {
  const sdk = await import("../dist/index.js");
  assert.equal("MinmoAuth" in sdk, false);
  assert.equal("PartnerClient" in sdk, false);
});
