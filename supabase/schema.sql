-- ==============================================================================
-- MASTER DATABASE SCHEMA & INITIAL SEED DATA
-- HMPSTI STMIK WIDYA UTAMA (SUPABASE POSTGRESQL)
-- ==============================================================================
-- File ini mencakup seluruh tabel, kebijakan keamanan Row Level Security (RLS),
-- stored procedure (RPC), serta data awal (seed) yang dibutuhkan oleh sistem.
-- Silakan jalankan seluruh script ini di Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- EXTENSIONS & SETUP UTILITY
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ==============================================================================
-- 1. TABEL: site_settings (Pengaturan Kontak & Identitas Website)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    current_period TEXT NOT NULL DEFAULT '2026',
    email TEXT NOT NULL DEFAULT 'hmps-ti@stmik-widya-utama.ac.id',
    whatsapp TEXT NOT NULL DEFAULT '+62 812-3456-7890',
    address TEXT NOT NULL DEFAULT 'Gedung Kampus STMIK Widya Utama, Jl. Sunan Kalijaga No.26, Purwokerto, Jawa Tengah',
    map_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.402517855325!2d109.24712497499999!3d-7.420601992589712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655e783424d86b%3A0xb3556d787019f182!2sSTMIK%20Widya%20Utama!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage Site Settings" ON public.site_settings;
CREATE POLICY "Public Manage Site Settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- Seed Initial Settings
INSERT INTO public.site_settings (id, current_period, email, whatsapp, address, map_embed_url)
VALUES (
    'default',
    '2026',
    'hmps-ti@stmik-widya-utama.ac.id',
    '+62 812-3456-7890',
    'Gedung Kampus STMIK Widya Utama, Jl. Sunan Kalijaga No.26, Purwokerto, Jawa Tengah',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.402517855325!2d109.24712497499999!3d-7.420601992589712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655e783424d86b%3A0xb3556d787019f182!2sSTMIK%20Widya%20Utama!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'
) ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- 2. TABEL: vision_missions (Visi & Butir Misi Kepengurusan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vision_missions (
    id TEXT PRIMARY KEY DEFAULT 'default',
    vision TEXT NOT NULL,
    missions JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.vision_missions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Vision Missions" ON public.vision_missions;
CREATE POLICY "Public Read Vision Missions" ON public.vision_missions FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage Vision Missions" ON public.vision_missions;
CREATE POLICY "Public Manage Vision Missions" ON public.vision_missions FOR ALL TO public USING (true) WITH CHECK (true);

-- Seed Initial Vision & Missions
INSERT INTO public.vision_missions (id, vision, missions)
VALUES (
    'default',
    'Menjadi Himpunan Mahasiswa Teknik Informatika yang Unggul, Inovatif, dan Berkarakter dalam Penguasaan Teknologi Digital serta Berkontribusi Aktif Bagi Kemajuan Kampus dan Masyarakat.',
    '[
        {
            "number": "01",
            "title": "Meningkatkan Kualitas Akademik & Kompetensi Teknologi",
            "desc": "Menyelenggarakan pelatihan rutin, riset terapan, dan sertifikasi keahlian dalam bidang pemrograman, AI, cloud computing, dan rekayasa perangkat lunak.",
            "indicator": "120+ Mahasiswa Bersertifikasi Per Periode"
        },
        {
            "number": "02",
            "title": "Membangun Ekosistem Karya & Inovasi Mahasiswa",
            "desc": "Wadah pendampingan dan publikasi produk software inovatif buatan mahasiswa prodi Teknik Informatika agar siap bersaing secara nasional.",
            "indicator": "40+ Karya Terpublikasi di Showcase"
        },
        {
            "number": "03",
            "title": "Mempererat Keakraban & Kaderisasi Berkelanjutan",
            "desc": "Mengembangkan potensi kepemimpinan, karakter etis, dan kebersamaan seluruh mahasiswa TI melalui program upgraded kaderisasi yang humanis.",
            "indicator": "100% Partisipasi Mahasiswa Baru"
        },
        {
            "number": "04",
            "title": "Meningkatkan Kemitraan Eksternal & Pengabdian",
            "desc": "Jejaring kolaborasi dengan industri teknologi, asosiasi mahasiswa TI nasional, dan pengabdian masyarakat berbasis edukasi teknologi digital.",
            "indicator": "10+ Kemitraan Industri & Instansi"
        },
        {
            "number": "05",
            "title": "Tata Kelola Organisasi yang Transparan & Adaptif",
            "desc": "Menjalankan roda organisasi HMPSTI SWU berbasis teknologi digital, akuntabilitas keuangan, serta komunikasi publik yang responsif.",
            "indicator": "Laporan Keuangan & Proker Terbuka"
        }
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- 3. TABEL: division_photos (Foto Bersama Divisi & Seluruh Anggota)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.division_photos (
    division_slug TEXT PRIMARY KEY,
    division_name TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.division_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Division Photos" ON public.division_photos;
CREATE POLICY "Public Read Division Photos" ON public.division_photos FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage Division Photos" ON public.division_photos;
CREATE POLICY "Public Manage Division Photos" ON public.division_photos FOR ALL TO public USING (true) WITH CHECK (true);

-- Seed Initial Division Photos
INSERT INTO public.division_photos (division_slug, division_name, photo_url)
VALUES
    ('bph', 'Badan Pengurus Harian (BPH)', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop'),
    ('psdm', 'Pengembangan Sumber Daya Mahasiswa', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop'),
    ('lpt', 'Lembaga Pengembangan Teknologi (LPT)', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop'),
    ('kwu', 'Kewirausahaan & Bisnis Mandiri (KWU)', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop'),
    ('medkominfo', 'Media Komunikasi & Informasi', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop'),
    ('humas', 'Hubungan Masyarakat & Kemitraan', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop'),
    ('all_members', 'Seluruh Anggota Himpunan (Kabinet HMPSTI SWU)', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop')
ON CONFLICT (division_slug) DO UPDATE
SET division_name = EXCLUDED.division_name, photo_url = EXCLUDED.photo_url, updated_at = timezone('utc'::text, now());


-- ==============================================================================
-- 4. TABEL: news (Warta Berita & Pengumuman Event)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Informasi',
    is_event BOOLEAN NOT NULL DEFAULT false,
    author_name TEXT DEFAULT 'LPT',
    event_date TIMESTAMP WITH TIME ZONE,
    reading_time TEXT DEFAULT '4 min read',
    likes_count INT NOT NULL DEFAULT 0,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read News" ON public.news;
CREATE POLICY "Public Read News" ON public.news FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage News" ON public.news;
CREATE POLICY "Public Manage News" ON public.news FOR ALL TO public USING (true) WITH CHECK (true);


-- ==============================================================================
-- 5. TABEL: student_projects (Showcase Portofolio Karya Mahasiswa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Web Application',
    description TEXT,
    content TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    author_name TEXT NOT NULL,
    author_role TEXT DEFAULT 'Mahasiswa TI',
    author_nim TEXT,
    author_avatar TEXT,
    cover_image TEXT,
    demo_url TEXT,
    github_url TEXT,
    likes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Projects" ON public.student_projects;
CREATE POLICY "Public Read Projects" ON public.student_projects FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage Projects" ON public.student_projects;
CREATE POLICY "Public Manage Projects" ON public.student_projects FOR ALL TO public USING (true) WITH CHECK (true);


-- ==============================================================================
-- 6. TABEL: division_members (Bagan Pengurus Organisasi BPH & 6 Divisi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.division_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    nim TEXT NOT NULL,
    role TEXT NOT NULL,
    division_slug TEXT NOT NULL,
    avatar TEXT,
    email TEXT,
    instagram_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    social_links TEXT[] DEFAULT '{}',
    likes_count INT NOT NULL DEFAULT 0,
    is_bph BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.division_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Division Members" ON public.division_members;
CREATE POLICY "Public Read Division Members" ON public.division_members FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage Division Members" ON public.division_members;
CREATE POLICY "Public Manage Division Members" ON public.division_members FOR ALL TO public USING (true) WITH CHECK (true);


-- ==============================================================================
-- 7. TABEL: members (Direktori Mahasiswa Aktif & Alumni HMPSTI)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    nim TEXT NOT NULL UNIQUE,
    cohort TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Aktif',
    role TEXT NOT NULL,
    avatar TEXT,
    variant TEXT DEFAULT 'yellow',
    email TEXT,
    instagram_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    social_links TEXT[] DEFAULT '{}',
    likes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Members" ON public.members;
CREATE POLICY "Public Read Members" ON public.members FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage Members" ON public.members;
CREATE POLICY "Public Manage Members" ON public.members FOR ALL TO public USING (true) WITH CHECK (true);


-- ==============================================================================
-- 8. TABEL: gallery_items (Dokumentasi Galeri Foto Kegiatan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'WORKSHOP & SEMINAR',
    event_date TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    likes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Gallery" ON public.gallery_items;
CREATE POLICY "Public Read Gallery" ON public.gallery_items FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage Gallery" ON public.gallery_items;
CREATE POLICY "Public Manage Gallery" ON public.gallery_items FOR ALL TO public USING (true) WITH CHECK (true);


-- ==============================================================================
-- 9. TABEL: work_programs (Program Kerja Divisi Organisasi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.work_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'MENDATANG',
    execution_date TEXT NOT NULL,
    description TEXT,
    pic TEXT NOT NULL,
    target_audience TEXT,
    budget TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.work_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Work Programs" ON public.work_programs;
CREATE POLICY "Public Read Work Programs" ON public.work_programs FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Manage Work Programs" ON public.work_programs;
CREATE POLICY "Public Manage Work Programs" ON public.work_programs FOR ALL TO public USING (true) WITH CHECK (true);


-- ==============================================================================
-- 10. TABEL: feedback (Kotak Masuk Aspirasi Mahasiswa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT DEFAULT 'Anonim',
    sender_email TEXT,
    subject TEXT DEFAULT 'Aspirasi Mahasiswa',
    message TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Feedback" ON public.feedback;
CREATE POLICY "Public Read Feedback" ON public.feedback FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Insert Feedback" ON public.feedback;
CREATE POLICY "Public Insert Feedback" ON public.feedback FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Public Manage Feedback" ON public.feedback;
CREATE POLICY "Public Manage Feedback" ON public.feedback FOR ALL TO public USING (true) WITH CHECK (true);


-- ==============================================================================
-- 11. STORED PROCEDURE (RPC): increment_like_atomic
-- ==============================================================================
-- Fungsi ini menangani mutasi jumlah like secara atomik dan aman dari race condition
-- untuk 4 tabel utama: news, student_projects, members, division_members.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.increment_like_atomic(
    table_name TEXT,
    row_id TEXT,
    delta_val INT
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count INT := 0;
BEGIN
    IF table_name = 'news' THEN
        UPDATE public.news 
        SET likes_count = GREATEST(0, COALESCE(likes_count, 0) + delta_val)
        WHERE id = row_id::uuid
        RETURNING likes_count INTO new_count;
        
    ELSIF table_name = 'student_projects' THEN
        UPDATE public.student_projects 
        SET likes_count = GREATEST(0, COALESCE(likes_count, 0) + delta_val)
        WHERE id = row_id::uuid
        RETURNING likes_count INTO new_count;

    ELSIF table_name = 'members' THEN
        UPDATE public.members 
        SET likes_count = GREATEST(0, COALESCE(likes_count, 0) + delta_val)
        WHERE id = row_id::uuid
        RETURNING likes_count INTO new_count;

    ELSIF table_name = 'division_members' THEN
        UPDATE public.division_members 
        SET likes_count = GREATEST(0, COALESCE(likes_count, 0) + delta_val)
        WHERE id = row_id::uuid
        RETURNING likes_count INTO new_count;
        
    END IF;

    RETURN COALESCE(new_count, 0);
END;
$$;


-- ==============================================================================
-- INDEXING UNTUK OPTIMASI PERFORMA KUERI
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_event ON public.news (is_event);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.student_projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_div_members_slug ON public.division_members (division_slug);
CREATE INDEX IF NOT EXISTS idx_members_nim ON public.members (nim);
CREATE INDEX IF NOT EXISTS idx_work_programs_slug ON public.work_programs (division_slug);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback (created_at DESC);
