-- Migration: 0008_2026-08-17T15-00-00_system_activities.sql
-- Description: Creates system_activities table to audit login attempts (IP, browser, device) and all admin panel write mutations.

CREATE TABLE IF NOT EXISTS public.system_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT NOT NULL, -- 'login_success', 'login_failed', 'password_reset_request', 'password_reset_success', 'create', 'update', 'delete', 'upload', 'settings_update'
  action TEXT NOT NULL, -- Human-readable action description
  entity TEXT, -- 'auth', 'projects', 'skills', 'education', 'activities', 'achievements', 'hobbies', 'metrics', 'settings', 'messages', 'storage'
  entity_id TEXT, -- ID of the modified entity if applicable
  ip_address TEXT, -- Client IP Address
  user_agent TEXT, -- Full User Agent string
  browser TEXT, -- Parsed Browser Name & Version
  os TEXT, -- Parsed Operating System
  device TEXT, -- Parsed Device Type (Desktop, Mobile, Tablet)
  status TEXT NOT NULL DEFAULT 'success', -- 'success', 'failure', 'warning'
  user_email TEXT, -- Admin/user email associated with activity
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb -- Additional payload details, diffs, error messages
);

-- Indexing for fast queries by timestamp, type, entity, and status
CREATE INDEX IF NOT EXISTS idx_system_activities_created_at ON public.system_activities (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_activities_type ON public.system_activities (type);
CREATE INDEX IF NOT EXISTS idx_system_activities_entity ON public.system_activities (entity);
CREATE INDEX IF NOT EXISTS idx_system_activities_status ON public.system_activities (status);
CREATE INDEX IF NOT EXISTS idx_system_activities_ip ON public.system_activities (ip_address);

-- Enable Row Level Security
ALTER TABLE public.system_activities ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admin users to read system activities
CREATE POLICY "Allow authenticated admin read on system_activities"
  ON public.system_activities
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role full access (insert, select, delete)
CREATE POLICY "Allow service role full access on system_activities"
  ON public.system_activities
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
