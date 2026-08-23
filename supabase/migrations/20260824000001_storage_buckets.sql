-- =============================================================================
-- ResuMesh Supabase Storage Buckets & Policies Initialization
-- =============================================================================

-- 1. CREATE AVATARS BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. CREATE CVS BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

-- 3. ENABLE PUBLIC READ POLICIES
CREATE POLICY "Public Read Access for Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Public Read Access for CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs');
