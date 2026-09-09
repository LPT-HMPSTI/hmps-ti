import { supabase, withTimeout } from "@/lib/supabase";
import {
  DivisionMember,
  MemberDirectory,
  CreateDivisionMemberPayload,
  CreateMemberDirectoryPayload,
} from "@/types";
import { fallbackDivisionMembers, fallbackMembers } from "@/constants";

let memoryDivisionStore: DivisionMember[] = [
  ...(fallbackDivisionMembers as DivisionMember[]),
];
let memoryMembersStore: MemberDirectory[] = [
  ...(fallbackMembers as MemberDirectory[]),
];

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ==========================================
// PENGURUS DIVISI SERVICES
// ==========================================

/**
 * Mengambil daftar pengurus dan anggota divisi dari database Supabase.
 */
export async function fetchDivisionMembers(): Promise<DivisionMember[]> {
  // Cek cache localStorage terlebih dahulu untuk rendering instan
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("hmpsti_cached_division_members");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryDivisionStore = parsed as DivisionMember[];
        }
      }
    } catch {}
  }

  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("division_members")
          .select("*")
          .order("created_at", { ascending: true }),
        8000
      );

      if (!error && data && data.length > 0) {
        memoryDivisionStore = data as DivisionMember[];
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("hmpsti_cached_division_members", JSON.stringify(data));
          } catch {}
        }
        return data as DivisionMember[];
      }
    } catch (e) {
      console.warn("fetchDivisionMembers fallback used:", e);
    }
  }
  return memoryDivisionStore;
}

/**
 * Menambahkan pengurus divisi baru ke dalam tabel division_members.
 */
export async function createDivisionMember(
  member: CreateDivisionMemberPayload & { id?: string }
): Promise<{ success: boolean; data?: DivisionMember; error?: string; isMock?: boolean }> {
  const payload = { ...member };
  if (!payload.id) {
    payload.id = generateUUID();
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("division_members")
        .insert([payload])
        .select();

      if (!error && data && data.length > 0) {
        memoryDivisionStore.unshift(data[0] as DivisionMember);
        return { success: true, data: data[0] as DivisionMember };
      }

      if (error) {
        console.warn("createDivisionMember Supabase error, retrying without explicit ID:", error);
        const { id, ...withoutId } = payload;
        const { data: data2, error: error2 } = await supabase
          .from("division_members")
          .insert([withoutId])
          .select();

        if (!error2 && data2 && data2.length > 0) {
          memoryDivisionStore.unshift(data2[0] as DivisionMember);
          return { success: true, data: data2[0] as DivisionMember };
        }
        if (error2) {
          console.error("createDivisionMember Retry Error:", error2);
          return { success: false, error: error2.message || error.message };
        }
      }
    } catch (e: any) {
      console.error("createDivisionMember Exception:", e);
      return { success: false, error: e?.message || "Internal Exception" };
    }
  }

  memoryDivisionStore.unshift(payload as DivisionMember);
  return { success: true, data: payload as DivisionMember, isMock: true };
}

/**
 * Memperbarui data profil pengurus divisi berdasarkan ID.
 */
export async function updateDivisionMember(
  id: string,
  member: Partial<DivisionMember>
): Promise<{ success: boolean; data?: any; error?: string; isMock?: boolean }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("division_members")
        .update(member)
        .eq("id", id)
        .select();

      if (!error) {
        const idx = memoryDivisionStore.findIndex((m) => m.id === id);
        if (idx !== -1)
          memoryDivisionStore[idx] = { ...memoryDivisionStore[idx], ...member };
        return { success: true, data };
      } else {
        console.error("updateDivisionMember Error:", error);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error("updateDivisionMember Exception:", e);
      return { success: false, error: e?.message || "Internal Exception" };
    }
  }
  const idx = memoryDivisionStore.findIndex((m) => m.id === id);
  if (idx !== -1)
    memoryDivisionStore[idx] = { ...memoryDivisionStore[idx], ...member };
  return { success: true, isMock: true };
}

/**
 * Menghapus profil pengurus divisi dari database.
 */
export async function deleteDivisionMember(
  id: string
): Promise<{ success: boolean; error?: string; isMock?: boolean }> {
  if (supabase) {
    try {
      const { error } = await supabase.from("division_members").delete().eq("id", id);
      if (!error) {
        memoryDivisionStore = memoryDivisionStore.filter((m) => m.id !== id);
        return { success: true };
      } else {
        console.error("deleteDivisionMember Error:", error);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error("deleteDivisionMember Exception:", e);
      return { success: false, error: e?.message || "Internal Exception" };
    }
  }
  memoryDivisionStore = memoryDivisionStore.filter((m) => m.id !== id);
  return { success: true, isMock: true };
}

// ==========================================
// DIREKTORI KEANGGOTAAN SERVICES
// ==========================================

/**
 * Mengambil daftar seluruh anggota aktif dan alumni dari database.
 */
export async function fetchMembersList(): Promise<MemberDirectory[]> {
  // Cek cache localStorage terlebih dahulu untuk rendering instan
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("hmpsti_cached_members_list");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryMembersStore = parsed as MemberDirectory[];
        }
      }
    } catch {}
  }

  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("members")
          .select("*")
          .order("cohort", { ascending: false }),
        8000
      );

      if (!error && data && data.length > 0) {
        memoryMembersStore = data as MemberDirectory[];
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("hmpsti_cached_members_list", JSON.stringify(data));
          } catch {}
        }
        return data as MemberDirectory[];
      }
    } catch (e) {
      console.warn("fetchMembersList fallback used:", e);
    }
  }
  return memoryMembersStore;
}

/**
 * Menambahkan data anggota baru ke dalam direktori keanggotaan.
 */
export async function createMember(
  member: CreateMemberDirectoryPayload & { id?: string }
): Promise<{ success: boolean; data?: MemberDirectory; error?: string; isMock?: boolean }> {
  const payload = { ...member };
  if (!payload.id) {
    payload.id = generateUUID();
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from("members").insert([payload]).select();
      if (!error && data && data.length > 0) {
        memoryMembersStore.unshift(data[0] as MemberDirectory);
        return { success: true, data: data[0] as MemberDirectory };
      }
      if (error) {
        console.warn("createMember Supabase error, retrying without explicit ID:", error);
        const { id, ...withoutId } = payload;
        const { data: data2, error: error2 } = await supabase
          .from("members")
          .insert([withoutId])
          .select();

        if (!error2 && data2 && data2.length > 0) {
          memoryMembersStore.unshift(data2[0] as MemberDirectory);
          return { success: true, data: data2[0] as MemberDirectory };
        }
        if (error2) {
          console.error("createMember Retry Error:", error2);
          return { success: false, error: error2.message || error.message };
        }
      }
    } catch (e: any) {
      console.error("createMember Exception:", e);
      return { success: false, error: e?.message || "Internal Exception" };
    }
  }

  memoryMembersStore.unshift(payload as MemberDirectory);
  return { success: true, data: payload as MemberDirectory, isMock: true };
}

/**
 * Memperbarui data keanggotaan mahasiswa atau alumni.
 */
export async function updateMember(
  id: string,
  member: Partial<MemberDirectory>
): Promise<{ success: boolean; data?: any; error?: string; isMock?: boolean }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("members").update(member).eq("id", id);
      if (!error) {
        const idx = memoryMembersStore.findIndex((m) => m.id === id);
        if (idx !== -1)
          memoryMembersStore[idx] = { ...memoryMembersStore[idx], ...member };
        return { success: true, data };
      } else {
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.warn("updateMember Exception handled:", e);
      return { success: false, error: e?.message || "Internal Exception" };
    }
  }
  const idx = memoryMembersStore.findIndex((m) => m.id === id);
  if (idx !== -1)
    memoryMembersStore[idx] = { ...memoryMembersStore[idx], ...member };
  return { success: true, isMock: true };
}

/**
 * Menghapus data anggota dari direktori keanggotaan.
 */
export async function deleteMember(
  id: string
): Promise<{ success: boolean; error?: string; isMock?: boolean }> {
  if (supabase) {
    try {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (!error) {
        memoryMembersStore = memoryMembersStore.filter((m) => m.id !== id);
        return { success: true };
      } else {
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.warn("deleteMember Exception handled:", e);
      return { success: false, error: e?.message || "Internal Exception" };
    }
  }
  memoryMembersStore = memoryMembersStore.filter((m) => m.id !== id);
  return { success: true, isMock: true };
}
