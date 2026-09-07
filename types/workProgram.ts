import { DivisionSlug } from "./members";

/**
 * Status pelaksanaan program kerja himpunan.
 */
export type WorkProgramStatus = "MENDATANG" | "BERJALAN" | "SELESAI" | string;

/**
 * Entitas data program kerja per divisi yang terdaftar di sistem.
 */
export interface WorkProgram {
  id: string;
  division_slug: DivisionSlug;
  title: string;
  description?: string;
  status: WorkProgramStatus;
  execution_date: string;
  pic?: string;
  target_audience?: string;
  budget?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

/**
 * Payload form ketika menambahkan program kerja baru di admin CMS.
 */
export type CreateWorkProgramPayload = Omit<
  WorkProgram,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
};

/**
 * Payload form saat memperbarui data program kerja.
 */
export type UpdateWorkProgramPayload = Partial<CreateWorkProgramPayload>;
