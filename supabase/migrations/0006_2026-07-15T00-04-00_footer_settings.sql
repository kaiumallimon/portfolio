-- ============================================================================
-- 0006_2026-07-15T00-04-00_footer_settings.sql
-- Add manageable footer description + Facebook URL to site_settings
-- ============================================================================

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_description text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS facebook_url text;
