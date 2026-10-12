import { Creem } from "creem";

/**
 * Returns a Creem SDK client. Test vs live is auto-detected from the key prefix:
 *   creem_test_... -> sandbox (https://test-api.creem.io)
 *   creem_...      -> production (https://api.creem.io)
 */
export function getCreem() {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    const err = new Error("CREEM_API_KEY is not set");
    err.code = "NO_CREEM_KEY";
    throw err;
  }
  const serverIdx = apiKey.startsWith("creem_test_") ? 1 : 0; // 0 = live, 1 = test
  return new Creem({ apiKey, serverIdx });
}

/** Creem product id of the AuthenTone Pro monthly subscription. */
export function creemProductId() {
  return process.env.CREEM_PRO_PRODUCT_ID || null;
}
