/**
 * Variasi warna neubrutalism khas HMPSTI SWU.
 * Dipakai buat badge, border neon, dan highlight komponen.
 */
export type NeubrutalistVariant =
  | "spotify"
  | "yellow"
  | "purple"
  | "cyan"
  | "magenta"
  | "emerald"
  | "orange";

/**
 * Arah rotasi miring neubrutalism.
 */
export type NeubrutalistTilt = "left" | "right" | "none";

/**
 * Format standar opsi dropdown atau selector custom.
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: any;
}

/**
 * Wrapper seragam buat penanganan status asynchronous (loading, error, data).
 */
export interface AsyncState<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
}
