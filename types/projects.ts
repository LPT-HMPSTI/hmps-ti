/**
 * Kategori karya inovasi software/hardware mahasiswa.
 */
export type ProjectCategory =
  | "Web Application"
  | "Mobile App"
  | "Artificial Intelligence"
  | "IoT & Hardware"
  | "UI/UX Design"
  | string;

/**
 * Data proyek karya inovasi mahasiswa TI yang ditampilkan pada halaman showcase.
 */
export interface StudentProject {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  tech_stack: string[];
  author_name: string;
  author_role?: string;
  author_nim?: string;
  author_avatar?: string;
  cover_image: string;
  demo_url?: string;
  github_url?: string;
  content?: string;
  likes_count?: number;
  created_at?: string;
  [key: string]: any;
}

/**
 * Payload form ketika menambahkan proyek karya inovasi baru di admin.
 */
export type CreateStudentProjectPayload = Omit<StudentProject, "id" | "created_at">;

/**
 * Payload form saat mengedit proyek karya mahasiswa.
 */
export type UpdateStudentProjectPayload = Partial<CreateStudentProjectPayload>;
