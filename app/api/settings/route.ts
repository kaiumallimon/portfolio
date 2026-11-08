import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data-service";

export const dynamic = "force-dynamic";

// Public, non-sensitive site settings used by client components
export async function GET() {
  const s = await getSiteSettings();
  return NextResponse.json({
    name: s.name,
    title: s.title,
    bio: s.bio,
    email: s.email,
    location: s.location,
    timezone: s.timezone,
    availableForHire: s.availableForHire,
    statusText: s.statusText,
    githubUrl: s.githubUrl,
    linkedinUrl: s.linkedinUrl,
    twitterUrl: s.twitterUrl,
    resumeUrl: s.resumeUrl,
  });
}
