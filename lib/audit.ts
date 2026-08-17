import { headers } from "next/headers";
import { getServerSupabase } from "@/lib/supabase/server";

export interface LogActivityParams {
  type:
    | "login_success"
    | "login_failed"
    | "password_reset_request"
    | "password_reset_success"
    | "create"
    | "update"
    | "delete"
    | "upload"
    | "settings_update";
  action: string;
  entity?: string;
  entityId?: string | null;
  status?: "success" | "failure" | "warning";
  userEmail?: string | null;
  metadata?: Record<string, any>;
  ipOverride?: string;
  userAgentOverride?: string;
}

/**
 * Parses user agent string to extract clean Browser, OS, and Device details
 */
export function parseUserAgent(uaString: string | null | undefined): {
  browser: string;
  os: string;
  device: string;
} {
  if (!uaString) {
    return { browser: "Unknown Browser", os: "Unknown OS", device: "Desktop" };
  }

  const ua = uaString.toLowerCase();

  // Determine Device
  let device = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "Tablet";
  } else if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    device = "Mobile";
  }

  // Determine OS
  let os = "Unknown OS";
  if (ua.includes("win")) os = "Windows";
  else if (ua.includes("mac") && !ua.includes("iphone") && !ua.includes("ipad"))
    os = "macOS";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod"))
    os = "iOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("cros")) os = "ChromeOS";

  // Determine Browser
  let browser = "Unknown Browser";
  if (ua.includes("edg/")) {
    const match = ua.match(/edg\/([\d.]+)/);
    browser = `Edge ${match ? match[1].split(".")[0] : ""}`.trim();
  } else if (ua.includes("opr/") || ua.includes("opera")) {
    const match = ua.match(/opr\/([\d.]+)/);
    browser = `Opera ${match ? match[1].split(".")[0] : ""}`.trim();
  } else if (ua.includes("chrome/") && !ua.includes("chromium")) {
    const match = ua.match(/chrome\/([\d.]+)/);
    browser = `Chrome ${match ? match[1].split(".")[0] : ""}`.trim();
  } else if (ua.includes("safari/") && !ua.includes("chrome")) {
    const match = ua.match(/version\/([\d.]+)/);
    browser = `Safari ${match ? match[1].split(".")[0] : ""}`.trim();
  } else if (ua.includes("firefox/")) {
    const match = ua.match(/firefox\/([\d.]+)/);
    browser = `Firefox ${match ? match[1].split(".")[0] : ""}`.trim();
  }

  return { browser, os, device };
}

/**
 * Extracts the real client IP address from standard headers
 */
export async function getClientIp(headersList?: Headers): Promise<string> {
  const h = headersList || (await headers());
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  return (
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    h.get("true-client-ip") ||
    h.get("x-client-ip") ||
    "127.0.0.1"
  );
}

/**
 * Logs a system activity event to the Supabase database.
 * Ignores reads and records mutations, logins, and access events.
 */
export async function logSystemActivity(
  params: LogActivityParams
): Promise<void> {
  try {
    const h = await headers();
    const ipAddress = params.ipOverride || (await getClientIp(h));
    const userAgent = params.userAgentOverride || h.get("user-agent") || "";
    const { browser, os, device } = parseUserAgent(userAgent);

    const geoCity = h.get("x-vercel-ip-city");
    const geoCountry = h.get("x-vercel-ip-country");

    const enrichedMetadata = {
      ...(params.metadata || {}),
      ...(geoCity ? { city: geoCity } : {}),
      ...(geoCountry ? { country: geoCountry } : {}),
    };

    const supabase = getServerSupabase();
    await supabase.from("system_activities").insert({
      type: params.type,
      action: params.action,
      entity: params.entity || null,
      entity_id: params.entityId || null,
      ip_address: ipAddress,
      user_agent: userAgent,
      browser,
      os,
      device,
      status: params.status || "success",
      user_email: params.userEmail || null,
      metadata: enrichedMetadata,
    });
  } catch (err) {
    // Audit logging should never crash primary application operations
    console.error("[SystemActivity Audit Error]:", err);
  }
}
