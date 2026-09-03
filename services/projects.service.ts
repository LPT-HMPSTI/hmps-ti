import { supabase, withTimeout } from "@/lib/supabase";
import {
  StudentProject,
  CreateStudentProjectPayload,
  UpdateStudentProjectPayload,
} from "@/types";
import { fallbackProjects } from "@/constants";

let memoryProjectsStore: StudentProject[] = [
  ...(fallbackProjects as StudentProject[]),
];

/**
 * Mengambil seluruh daftar proyek karya inovasi mahasiswa dari database Supabase.
 */
export async function fetchProjectsList(): Promise<StudentProject[]> {
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("student_projects")
          .select("*")
          .order("created_at", { ascending: false }),
        2500
      );

      if (!error && data && data.length > 0) {
        memoryProjectsStore = data as StudentProject[];
        return data as StudentProject[];
      }
    } catch (e) {
      console.warn("fetchProjectsList fallback used:", e);
    }
  }
  return memoryProjectsStore;
}

/**
 * Menambahkan proyek karya inovasi baru ke dalam showcase.
 */
export async function createStudentProject(
  project: CreateStudentProjectPayload
): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  const newId = `p-${Date.now()}`;
  const newItem: StudentProject = {
    id: newId,
    created_at: new Date().toISOString(),
    ...project,
  } as StudentProject;

  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase.from("student_projects").insert([project]),
        2500
      );
      if (!error) {
        memoryProjectsStore = [newItem, ...memoryProjectsStore];
        return { success: true, data };
      }
    } catch (e) {
      console.warn("createStudentProject Exception handled:", e);
    }
  }

  memoryProjectsStore = [newItem, ...memoryProjectsStore];
  return { success: true, isMock: true, data: newItem };
}

/**
 * Memperbarui data proyek karya mahasiswa berdasarkan ID.
 */
export async function updateStudentProject(
  id: string,
  project: UpdateStudentProjectPayload
): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase.from("student_projects").update(project).eq("id", id),
        2500
      );
      if (!error) {
        memoryProjectsStore = memoryProjectsStore.map((p) =>
          p.id === id ? { ...p, ...project } : p
        );
        return { success: true, data };
      }
    } catch (e) {
      console.warn("updateStudentProject Exception handled:", e);
    }
  }

  memoryProjectsStore = memoryProjectsStore.map((p) =>
    p.id === id ? { ...p, ...project } : p
  );
  return { success: true, isMock: true };
}

/**
 * Menghapus proyek karya inovasi dari database.
 */
export async function deleteStudentProject(
  id: string
): Promise<{ success: boolean; isMock?: boolean }> {
  if (supabase) {
    try {
      const { error }: any = await withTimeout(
        supabase.from("student_projects").delete().eq("id", id),
        2500
      );
      if (!error) {
        memoryProjectsStore = memoryProjectsStore.filter((p) => p.id !== id);
        return { success: true };
      }
    } catch (e) {
      console.warn("deleteStudentProject Exception handled:", e);
    }
  }

  memoryProjectsStore = memoryProjectsStore.filter((p) => p.id !== id);
  return { success: true, isMock: true };
}
