-- ================================================================
-- TABEL ADMIN USERS & INITIAL DATA FOR HMPSTI ADMIN AUTHENTICATION
-- Jalankan query SQL ini di Supabase Dashboard -> SQL Editor
-- ================================================================

-- 1. Buat Tabel admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    keterangan TEXT DEFAULT '-',
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin')) DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Policy RLS untuk Akses Publik / Anonim (Membaca data untuk verifikasi login & CRUD admin)
CREATE POLICY "Allow public read access to admin_users"
ON public.admin_users
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access to admin_users"
ON public.admin_users
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access to admin_users"
ON public.admin_users
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow public delete access to admin_users"
ON public.admin_users
FOR DELETE
TO public
USING (true);

-- 4. Tambahkan User Default (Super Admin & Admin Divisi)
-- Note: Password default adalah "admin123" (sudah di-hash sha256: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918)
INSERT INTO public.admin_users (username, password_hash, keterangan, role, is_active)
VALUES 
  (
    'superadmin', 
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 
    'Super Admin Utama HMPSTI', 
    'superadmin', 
    true
  ),
  (
    'admin_hmpsti', 
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 
    'Pengurus HMPSTI', 
    'admin', 
    true
  )
ON CONFLICT (username) DO NOTHING;
