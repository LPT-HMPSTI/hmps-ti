/**
 * Robust date parser supporting ISO strings and Indonesian date formats
 * e.g., "18 Oktober 2026", "30 Agustus 2026", "15 September 2026", "26 Agustus 2026"
 */
export const parseAnyDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;

  // 1. Try standard JS Date parse first
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  // 2. Parse Indonesian text format e.g. "Minggu, 18 Oktober 2026"
  const monthMap: Record<string, number> = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11,
  };

  const parts = dateStr.trim().toLowerCase().split(/\s+/);
  let dayNum: number | null = null;
  let monthNum: number | null = null;
  let yearNum: number | null = null;

  for (const part of parts) {
    const cleanPart = part.replace(",", "").trim();
    if (/^\d{1,2}$/.test(cleanPart)) {
      dayNum = parseInt(cleanPart, 10);
    } else if (monthMap[cleanPart] !== undefined) {
      monthNum = monthMap[cleanPart];
    } else if (/^\d{4}$/.test(cleanPart)) {
      yearNum = parseInt(cleanPart, 10);
    }
  }

  if (dayNum !== null && monthNum !== null && yearNum !== null) {
    return new Date(yearNum, monthNum, dayNum);
  }

  return null;
};

/**
 * Returns reference TODAY date for the portal (defaulting to 30 August 2026 if system clock year is not 2026)
 */
export const getPortalToday = (): Date => {
  const now = new Date();
  if (now.getFullYear() === 2026) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  // Baseline date for HMPSTI SWU 2026 Portal
  return new Date(2026, 7, 30); // 30 August 2026
};

/**
 * Returns number of days difference relative to portal today
 * 0 = today, positive = future, negative = past
 */
export const getDaysFromToday = (targetDate: Date | null): number => {
  if (!targetDate) return 999;
  const todayStart = getPortalToday();
  const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const diffMs = targetStart.getTime() - todayStart.getTime();
  return Math.round(diffMs / (1000 * 3600 * 24));
};

/**
 * Checks if target date is exact today
 */
export const isTodayDate = (targetDate: Date | null): boolean => {
  return getDaysFromToday(targetDate) === 0;
};

/**
 * Checks if a news publication date is HOTNEWS (published today or within last 5 days)
 */
export const isHotNewsDate = (targetDate: Date | null): boolean => {
  const diff = getDaysFromToday(targetDate);
  return diff <= 0 && diff >= -5;
};

/**
 * Formats date into standard Indonesian format "Hari, Tanggal Bulan Tahun"
 */
export const formatDateIndonesian = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return "Minggu, 30 Agustus 2026";
  const d = typeof dateInput === "string" ? parseAnyDate(dateInput) : dateInput;
  if (!d) return String(dateInput);

  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
