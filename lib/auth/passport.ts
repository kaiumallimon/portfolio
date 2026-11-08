import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, IUser } from "@/lib/models";

const SESSION_SECRET = process.env.SESSION_SECRET || "default_fallback_session_secret_2026_xyz!";
const COOKIE_NAME = "portfolio_auth_token";

// Configure Passport Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        await connectToDatabase();
        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });

        // Auto-seed admin user if none exists and matches env credentials
        if (!user && normalizedEmail === (process.env.ADMIN_INITIAL_EMAIL || "admin@kaium.dev").toLowerCase()) {
          const initPass = process.env.ADMIN_INITIAL_PASSWORD || "adminPassword123!";
          if (password === initPass) {
            const passwordHash = await bcrypt.hash(initPass, 12);
            user = await User.create({
              email: normalizedEmail,
              passwordHash,
              name: "Kaium Al Limon",
              role: "admin",
            });
            return done(null, user);
          }
        }

        if (!user) {
          return done(null, false, { message: "Invalid email or password." });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return done(null, false, { message: "Invalid email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export interface AuthSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function generateToken(payload: AuthSessionPayload): string {
  return jwt.sign(payload, SESSION_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthSessionPayload | null {
  try {
    return jwt.verify(token, SESSION_SECRET) as AuthSessionPayload;
  } catch {
    return null;
  }
}

// Helper to authenticate using Passport's Local Strategy in Next.js App Router
export async function authenticateWithPassport(
  email: string,
  pass: string
): Promise<{ user: IUser | null; error?: string }> {
  return new Promise((resolve) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: Error | null, user: IUser | false, info: { message?: string } | undefined) => {
        if (err) {
          return resolve({ user: null, error: err.message });
        }
        if (!user) {
          return resolve({ user: null, error: info?.message || "Authentication failed." });
        }
        return resolve({ user, error: undefined });
      }
    )({ body: { email, password: pass } });
  });
}

export async function getCurrentUser(): Promise<AuthSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
