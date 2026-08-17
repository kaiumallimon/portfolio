import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Endpoint deprecated. All authentication is executed via secure Server Actions." }, { status: 404 });
}
