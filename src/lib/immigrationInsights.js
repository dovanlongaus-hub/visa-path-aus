
const CACHE_KEY = "immigration_insights_bundle_v1";
const CACHE_TTL = 6 * 60 * 60 * 1000;

let inFlightPromise = null;

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (!cached?.timestamp || !cached?.data) return null;
    if (Date.now() - cached.timestamp > CACHE_TTL) return null;
    return cached;
  } catch (_) {
    return null;
  }
}

function writeCache(data) {
  const timestamp = Date.now();
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp }));
  return timestamp;
}

function normalizePayload(payload) {
  return {
    news: Array.isArray(payload?.news) ? payload.news : [],
    chart_insights: payload?.chart_insights || null,
    has_important_updates: Boolean(payload?.has_important_updates),
    source: payload?.source || "openclaw_agent",
  };
}

export async function getImmigrationInsights(force = false) {
  if (!force) {
    const cached = readCache();
    if (cached) {
      return {
        ...normalizePayload(cached.data),
        timestamp: cached.timestamp,
        fromCache: true,
      };
    }
  }

  if (inFlightPromise && !force) return inFlightPromise;

  // Immigration insights: static data in local mode
  inFlightPromise = Promise.resolve({
    updates: [],
    alerts: [],
    timestamp: Date.now(),
    fromCache: false,
  })
    .finally(() => {
      inFlightPromise = null;
    });

  return inFlightPromise;
}
