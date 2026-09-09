-- ==============================================================================
-- TABEL: division_photos (Foto Bersama Seluruh Divisi HMPS-TI STMIK Widya Utama)
-- ==============================================================================

-- 1. Buat tabel division_photos jika belum ada
CREATE TABLE IF NOT EXISTS public.division_photos (
    division_slug TEXT PRIMARY KEY,
    division_name TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.division_photos ENABLE ROW LEVEL SECURITY;

-- 3. Policy Read Publik (Semua pengunjung dapat melihat foto bersama divisi)
DROP POLICY IF EXISTS "Public Read Division Photos" ON public.division_photos;
CREATE POLICY "Public Read Division Photos"
ON public.division_photos
FOR SELECT
TO public
USING (true);

-- 4. Policy Insert / Update Publik & Admin (Dapat diakses melalui API Anon & Service)
DROP POLICY IF EXISTS "Public Manage Division Photos" ON public.division_photos;
CREATE POLICY "Public Manage Division Photos"
ON public.division_photos
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 5. Seed Data Awal (Foto Bersama untuk 6 Divisi Resmi)
INSERT INTO public.division_photos (division_slug, division_name, photo_url)
VALUES
    (
        'bph',
        'Badan Pengurus Harian (BPH)',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop'
    ),
    (
        'psdm',
        'Pengembangan Sumber Daya Mahasiswa',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop'
    ),
    (
        'lpt',
        'Lembaga Pengembangan Teknologi (LPT)',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop'
    ),
    (
        'kwu',
        'Kewirausahaan & Bisnis Mandiri (KWU)',
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop'
    ),
    (
        'medkominfo',
        'Media Komunikasi & Informasi',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop'
    ),
    (
        'humas',
        'Hubungan Masyarakat & Kemitraan',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop'
    )
ON CONFLICT (division_slug) DO UPDATE
SET
    division_name = EXCLUDED.division_name,
    photo_url = EXCLUDED.photo_url,
    updated_at = timezone('utc'::text, now());
