import { createHash } from "crypto";
import { NextRequest } from "next/server";

function firstHeaderValue(rawValue: string | null): string {
  if (!rawValue) {
    return "";
  }

  return rawValue.split(",")[0]?.trim() ?? "";
}

export function getIpAddress(request: NextRequest): string {
  const forwarded = firstHeaderValue(request.headers.get("x-forwarded-for"));
  if (forwarded) {
    return forwarded;
  }

  const realIp = firstHeaderValue(request.headers.get("x-real-ip"));
  if (realIp) {
    return realIp;
  }

  const cfIp = firstHeaderValue(request.headers.get("cf-connecting-ip"));
  if (cfIp) {
    return cfIp;
  }

  return "unknown";
}

export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent")?.trim() || "unknown";
}

export function buildVisitorHash(ipAddress: string, userAgent: string): string {
  const salt = process.env.FINGERPRINT_SALT || "dev-only-salt";
  return createHash("sha256").update(`${ipAddress}|${userAgent}|${salt}`).digest("hex");
}