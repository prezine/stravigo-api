-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC POLICIES (Read/Insert only for public)
-- ============================================

-- 1. LEADS TABLE: Allow public to insert, only admins can read
CREATE POLICY "Public can insert leads" 
ON leads 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read leads" 
ON leads 
FOR SELECT 
TO authenticated 
USING (true);

-- 2. RESOURCE ACCESS: Allow public to insert
CREATE POLICY "Public can insert resource_access" 
ON resource_access 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read resource_access" 
ON resource_access 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. JOB APPLICATIONS: Allow public to insert
CREATE POLICY "Public can insert job_applications" 
ON job_applications 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read job_applications" 
ON job_applications 
FOR SELECT 
TO authenticated 
USING (true);

-- ============================================
-- READ-ONLY POLICIES (Public can only read)
-- ============================================

-- 4. PAGES: Public can read published pages
CREATE POLICY "Public can read published pages" 
ON pages 
FOR SELECT 
TO public 
USING (is_published = true);

-- 5. CASE STUDIES: Public can read published case studies
CREATE POLICY "Public can read published case_studies" 
ON case_studies 
FOR SELECT 
TO public 
USING (is_published = true);

-- 6. INSIGHTS: Public can read published insights
CREATE POLICY "Public can read published insights" 
ON insights 
FOR SELECT 
TO public 
USING (is_published = true);

-- 7. TESTIMONIALS: Public can read approved testimonials
CREATE POLICY "Public can read approved testimonials" 
ON testimonials 
FOR SELECT 
TO public 
USING (is_approved = true);

-- 8. SERVICES: Public can read active services
CREATE POLICY "Public can read active services" 
ON services 
FOR SELECT 
TO public 
USING (is_active = true);

-- 9. SERVICE OFFERINGS: Public can read active offerings
CREATE POLICY "Public can read active service_offerings" 
ON service_offerings 
FOR SELECT 
TO public 
USING (is_active = true);

-- 10. JOB OPENINGS: Public can read active openings
CREATE POLICY "Public can read active job_openings" 
ON job_openings 
FOR SELECT 
TO public 
USING (is_active = true);

-- 11. INTERNSHIPS: Public can read active internships
CREATE POLICY "Public can read active internships" 
ON internships 
FOR SELECT 
TO public 
USING (is_active = true);

-- 12. BRAND CLIENTS: Public can read active clients
CREATE POLICY "Public can read active brand_clients" 
ON brand_clients 
FOR SELECT 
TO public 
USING (is_active = true);

-- 13. CASE STUDY MEDIA: Public can read media for published case studies
CREATE POLICY "Public can read case study media" 
ON case_study_media 
FOR SELECT 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM case_studies 
    WHERE case_studies.id = case_study_media.case_study_id 
    AND case_studies.is_published = true
  )
);

-- ============================================
-- ADMIN POLICIES (Full CRUD for authenticated users)
-- ============================================

-- Note: You'll need to set up auth.users table first
-- These policies assume you have authentication set up

-- Allow authenticated users to do everything on all tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename NOT LIKE 'pg_%'
    LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS "Admins can do everything on %s" ON %I;
            CREATE POLICY "Admins can do everything on %s" 
            ON %I 
            FOR ALL 
            TO authenticated 
            USING (true) 
            WITH CHECK (true);
        ', table_record.tablename, table_record.tablename, 
           table_record.tablename, table_record.tablename);
    END LOOP;
END $$;