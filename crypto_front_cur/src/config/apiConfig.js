export const API_BASE_URL = "http://localhost:8082/api";

export const TOKEN_KEY = "cryptox_token";
export const USER_KEY = "cryptox_user";
export const TWO_FA_KEY = "cryptox_2fa";

/**
 * CryptoX AI chat endpoint.
 *
 * Inspected Spring Boot controllers (Auth, Wallet, Portfolio, Trading, Crypto, Test)
 * do not currently expose an AI assistant route.
 *
 * When the backend adds one, set this to the exact path under /api, for example:
 *   "/assistant/chat"
 * Do not put Gemini/OpenAI keys in this frontend.
 */
export const AI_ENDPOINT = null;
