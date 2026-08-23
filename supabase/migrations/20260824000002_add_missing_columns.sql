-- =============================================================================
-- Migration: Add missing title, languages, and tags columns to projects table
-- =============================================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
