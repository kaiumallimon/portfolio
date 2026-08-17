import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { findUserByEmail } from "@/lib/auth/admin-user";
import { hashResetToken } from "@/lib/auth/reset-tokens";
import { logSystemActivity } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const supabase = getServerSupabase();
    const tokenHash = hashResetToken(String(token));

    const { data: rows, error } = await supabase
      .from("password_resets")
      .select("*")
      .eq("token_hash", tokenHash)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .limit(1);

    if (error || !rows || rows.length === 0) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    const record = rows[0];

    const found = await findUserByEmail(record.email);
    if (!found) {
      return NextResponse.json({ error: "Account not found" }, { status: 400 });
    }

    const { error: updateErr } = await supabase.auth.admin.updateUserById(found.id, {
      password: String(password),
    });
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    await supabase
      .from("password_resets")
      .update({ used_at: new Date().toISOString() })
      .eq("id", record.id);

    // Log password reset success
    await logSystemActivity({
      type: "password_reset_success",
      action: "Password Reset Completed",
      entity: "auth",
      status: "success",
      userEmail: record.email,
      metadata: {
        userId: found.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to reset password" },
      { status: 500 },
    );
  }
}
