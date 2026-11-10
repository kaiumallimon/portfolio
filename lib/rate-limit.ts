/**
 * Client-Specific Sliding Window Rate Limiter & Upstream Protection
 * 
 * Each client IP receives an isolated, independent usage limit (10 requests/minute).
 * Telemetry displayed in the UI reflects exclusively the visitor's individual IP usage.
 * 
 * Protection features:
 * 1. Per-Client IP Sliding Window: 10 requests per 60 seconds
 * 2. Anti-Bot Rapid Fire Burst Guard: minimum 750ms interval between submissions
 * 3. Token-Exhaustion / Spam Guard: maximum 1000 characters per user message
 * 4. Upstream Server Guard: 25 requests/min across all IPs to prevent Groq account 429s
 */

export interface ClientUsageTelemetry {
  limit: number;
  remaining: number;
  used: number;
  resetSeconds: number;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  status: number;
  error?: string;
  retryAfter?: number;
  telemetry: ClientUsageTelemetry;
}

const PER_IP_LIMIT = 10; // Requests per minute per client IP
const GLOBAL_LIMIT = 25; // Global ceiling across all IPs to protect Groq quota
const MIN_INTERVAL_MS = 750; // Minimum interval between submissions from the same client
const MAX_MESSAGE_LENGTH = 1000;

interface ClientRecord {
  timestamps: number[];
  lastRequestTime: number;
}

const clientIpStore = new Map<string, ClientRecord>();
const globalTimestamps: number[] = [];

/**
 * Filter out timestamps older than the sliding window (60 seconds)
 */
function purgeExpired(timestamps: number[], windowMs = 60000): number[] {
  const cutoff = Date.now() - windowMs;
  return timestamps.filter((t) => t > cutoff);
}

/**
 * Get snapshot of the client IP's current sliding window
 */
export function getClientTelemetry(ip: string): ClientUsageTelemetry {
  const now = Date.now();
  const record = clientIpStore.get(ip);
  const active = record ? purgeExpired(record.timestamps, 60000) : [];
  const used = active.length;
  const remaining = Math.max(0, PER_IP_LIMIT - used);

  let resetSeconds = 60;
  if (active.length > 0) {
    const oldest = active[0];
    resetSeconds = Math.max(1, Math.ceil((oldest + 60000 - now) / 1000));
  }

  return {
    limit: PER_IP_LIMIT,
    remaining,
    used,
    resetSeconds,
  };
}

/**
 * Check rate limit and anti-bot rules for incoming chat request
 */
export function checkClientRateLimit(ip: string, userMessage?: string): RateLimitCheckResult {
  const now = Date.now();

  // 1. Anti-spam message length check
  if (userMessage && userMessage.length > MAX_MESSAGE_LENGTH) {
    return {
      allowed: false,
      status: 400,
      error: `Message exceeds the allowed limit of ${MAX_MESSAGE_LENGTH} characters.`,
      telemetry: getClientTelemetry(ip),
    };
  }

  // 2. Fetch or create client record
  let record = clientIpStore.get(ip);
  if (!record) {
    record = { timestamps: [], lastRequestTime: 0 };
    clientIpStore.set(ip, record);
  }

  // 3. Anti-bot rapid-fire burst check
  const timeSinceLast = now - record.lastRequestTime;
  if (record.lastRequestTime > 0 && timeSinceLast < MIN_INTERVAL_MS) {
    const waitSeconds = Math.ceil((MIN_INTERVAL_MS - timeSinceLast) / 1000);
    return {
      allowed: false,
      status: 429,
      error: "Rapid request detected. Please pause briefly before sending another message.",
      retryAfter: Math.max(1, waitSeconds),
      telemetry: getClientTelemetry(ip),
    };
  }

  // 4. Purge expired timestamps from client window
  record.timestamps = purgeExpired(record.timestamps, 60000);

  // 5. Per-Client IP limit check
  if (record.timestamps.length >= PER_IP_LIMIT) {
    const oldest = record.timestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + 60000 - now) / 1000));
    return {
      allowed: false,
      status: 429,
      error: `You have reached your rate limit (${PER_IP_LIMIT} requests/min). Resets in ${retryAfter}s.`,
      retryAfter,
      telemetry: {
        limit: PER_IP_LIMIT,
        remaining: 0,
        used: PER_IP_LIMIT,
        resetSeconds: retryAfter,
      },
    };
  }

  // 6. Server global ceiling check (shared shield for Groq account)
  const activeGlobal = purgeExpired(globalTimestamps, 60000);
  globalTimestamps.length = 0;
  globalTimestamps.push(...activeGlobal);

  if (globalTimestamps.length >= GLOBAL_LIMIT) {
    const oldestGlobal = globalTimestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldestGlobal + 60000 - now) / 1000));
    return {
      allowed: false,
      status: 429,
      error: `The service is experiencing unusually high global volume. Please retry in ${retryAfter}s.`,
      retryAfter,
      telemetry: getClientTelemetry(ip),
    };
  }

  // 7. Record valid request
  record.timestamps.push(now);
  record.lastRequestTime = now;
  globalTimestamps.push(now);

  return {
    allowed: true,
    status: 200,
    telemetry: getClientTelemetry(ip),
  };
}

// Memory housekeeping every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - 3600000;
    for (const [ip, rec] of clientIpStore.entries()) {
      if (rec.lastRequestTime < cutoff) {
        clientIpStore.delete(ip);
      }
    }
  }, 300000);
}
