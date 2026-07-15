-- ============================================================================
-- 0005_2026-07-15T00-03-00_password_resets.sql
-- Manual (SMTP) password-reset tokens
-- ============================================================================

CREATE TABLE IF NOT EXISTS password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS password_resets_email_idx ON password_resets (email);
CREATE INDEX IF NOT EXISTS password_resets_token_hash_idx ON password_resets (token_hash);
