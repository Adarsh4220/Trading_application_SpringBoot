export function formatMoney(value, options = {}) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  const maximumFractionDigits = options.maximumFractionDigits ?? (Math.abs(num) < 1 ? 6 : 2);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
  }).format(num);
}

export function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(value) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function displayName(coinId, fallback) {
  if (fallback) return fallback;
  if (!coinId) return "Unknown";
  return String(coinId)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function initials(name, email) {
  const source = (name || email || "CX").trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 0) return "CX";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function looksLikeJwt(value) {
  if (typeof value !== "string") return false;
  const parts = value.trim().split(".");
  return parts.length === 3 && parts.every((p) => p.length > 0);
}

export function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function coinPriceFromDetails(details) {
  return details?.market_data?.current_price?.usd ?? null;
}

export function coinChangeFromDetails(details) {
  return details?.market_data?.price_change_percentage_24h ?? null;
}

export function coinMarketCapFromDetails(details) {
  return details?.market_data?.market_cap?.usd ?? null;
}

export function coinHighFromDetails(details) {
  return details?.market_data?.high_24h?.usd ?? null;
}

export function coinLowFromDetails(details) {
  return details?.market_data?.low_24h?.usd ?? null;
}

export function coinImageFromDetails(details) {
  return details?.image?.large || details?.image?.small || details?.image?.thumb || null;
}
