import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

// Public, non-sensitive site settings used by client components (footer, etc.).
export async function GET() {
  const s = await getSiteSettings();
  return NextResponse.json({
    footer_description: s?.footer_description ?? null,
    facebook_url: s?.facebook_url ?? null,
    github_url: s?.github_url ?? null,
    linkedin_url: s?.linkedin_url ?? null,
    email: s?.email ?? null,
    location: s?.location ?? null,
  });
}
