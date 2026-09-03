import { NeubrutalistVariant } from "./common";

/**
 * Identifier unik divisi di bawah naungan HMPSTI STMIK Widya Utama.
 */
export type DivisionSlug =
  | "bph"
  | "psdm"
  | "lpt"
  | "medkominfo"
  | "humas"
  | "kwu"
  | string;

/**
 * Data anggota dan jajaran pengurus divisi organisasi.
 */
export interface DivisionMember {
  id: string;
  name: string;
  nim: string;
  role: string;
  division_slug: DivisionSlug;
  avatar: string;
  email?: string;
  instagram_url?: string;
  github_url?: string;
  linkedin_url?: string;
  social_links?: string[];
  likes_count?: number;
  is_bph?: boolean;
  order_index?: number;
  created_at?: string;
  [key: string]: any;
}

/**
 * Status keanggotaan mahasiswa di himpunan.
 */
export type MemberStatus = "Aktif" | "Alumni" | "Demisioner" | string;

/**
 * Data profil keanggotaan lengkap (mahasiswa aktif, pengurus, hingga jejaring alumni).
 */
export interface MemberDirectory {
  id: string;
  name: string;
  nim: string;
  cohort: string;
  status: MemberStatus;
  role: string;
  avatar: string;
  variant?: NeubrutalistVariant | string;
  email?: string;
  instagram_url?: string;
  github_url?: string;
  linkedin_url?: string;
  social_links?: string[];
  likes_count?: number;
  created_at?: string;
  [key: string]: any;
}

/**
 * Payload untuk input pengurus divisi baru.
 */
export type CreateDivisionMemberPayload = Omit<DivisionMember, "id" | "created_at">;

/**
 * Payload untuk input anggota/alumni baru di direktori.
 */
export type CreateMemberDirectoryPayload = Omit<MemberDirectory, "id" | "created_at">;
