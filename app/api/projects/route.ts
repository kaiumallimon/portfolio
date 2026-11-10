import { NextRequest, NextResponse } from "next/server";
import { getPaginatedProjects } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const query = searchParams.get("q") || "";

  try {
    const result = await getPaginatedProjects({ page, limit, query });
    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch paginated projects" },
      { status: 500 }
    );
  }
}
