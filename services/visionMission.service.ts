import { supabase, withTimeout } from "@/lib/supabase";
import { VisionMissions, MissionItem } from "@/types";
import { fallbackVisionMissions } from "@/constants";

let memoryVisionMissionsStore: VisionMissions = { ...(fallbackVisionMissions as VisionMissions) };

/**
 * Mengambil visi dan butir misi organisasi HMPSTI SWU dari Supabase.
 */
export async function fetchVisionMissions(): Promise<VisionMissions> {
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("vision_missions")
          .select("*")
          .eq("id", "default")
          .maybeSingle(),
        2000
      );

      if (!error && data) {
        memoryVisionMissionsStore = data as VisionMissions;
        return data as VisionMissions;
      }
    } catch (e) {
      console.warn("fetchVisionMissions fallback used:", e);
    }
  }
  return memoryVisionMissionsStore;
}

/**
 * Menyimpan pembaruan teks visi dan poin misi kepengurusan.
 */
export async function updateVisionMissions(visionData: {
  vision: string;
  missions: MissionItem[];
}): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  memoryVisionMissionsStore = {
    ...memoryVisionMissionsStore,
    vision: visionData.vision,
    missions: visionData.missions,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from("vision_missions").upsert(
        [
          {
            id: "default",
            vision: visionData.vision,
            missions: visionData.missions,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "id" }
      );

      if (error) {
        console.warn("Supabase updateVisionMissions warning:", error.message);
      } else {
        return { success: true, data };
      }
    } catch (e) {
      console.warn("updateVisionMissions Exception handled:", e);
    }
  }
  return { success: true, isMock: true };
}
