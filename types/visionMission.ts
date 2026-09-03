/**
 * Struktur tiap butir misi organisasi beserta nomor urut dan target capaiannya.
 */
export interface MissionItem {
  number: string;
  title: string;
  desc: string;
  indicator: string;
}

/**
 * Data visi dan kumpulan butir misi kepengurusan HMPSTI SWU.
 */
export interface VisionMissions {
  id?: string;
  vision: string;
  missions: MissionItem[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Payload form saat admin mengubah isi visi dan misi.
 */
export type UpdateVisionMissionsPayload = Partial<Omit<VisionMissions, "id" | "created_at" | "updated_at">>;
