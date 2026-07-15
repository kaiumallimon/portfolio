-- ============================================================================
-- 0007_2026-07-15T10-00-00_project_images.sql
-- Allow projects to have multiple images (gallery) instead of a single one
-- ============================================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS images text[];

-- Backfill: move any existing single `image` into the new array
UPDATE projects
SET images = ARRAY[image]
WHERE image IS NOT NULL
  AND (images IS NULL OR array_length(images, 1) IS NULL);
