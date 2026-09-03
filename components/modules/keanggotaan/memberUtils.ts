/**
 * Helper dan fungsi kalkulasi normalisasi status, prioritas pengurutan hierarkis,
 * dan gaya tombol media sosial neubrutalism pada direktori keanggotaan.
 */

// Normalisasi status anggota menjadi 3 kategori bersih
export function normalizeMemberStatus(status: string, role: string) {
  const combined = `${status || ""} ${role || ""}`.toLowerCase();
  if (
    combined.includes("dosen") ||
    combined.includes("pembina") ||
    combined.includes("penanggung jawab") ||
    combined.includes("kaprodi") ||
    combined.includes("pembimbing")
  ) {
    return {
      label: "DOSEN PENANGGUNG JAWAB",
      variant: "cyan" as const,
      tilt: "left" as const,
    };
  }
  if (combined.includes("alumni")) {
    return {
      label: "ALUMNI",
      variant: "yellow" as const,
      tilt: "right" as const,
    };
  }
  return {
    label: "PENGURUS AKTIF",
    variant: "spotify" as const,
    tilt: "left" as const,
  };
}

// Prioritas pengurutan hierarkis anggota:
// 1. Pengurus Aktif & BPH (Ketua, Wakil, Sekretaris, Bendahara)
// 2. Pengurus Aktif Divisi (LPT, Medkom, PSDM, Humas, KWU, dll -> Kadiv dulu baru Staff)
// 3. Alumni HMPS-TI (Tahun Angkatan Terbaru ke Lama)
// 4. Dosen Penanggung Jawab
export function getMemberSortPriority(m: any) {
  const role = (m.role || "").toLowerCase();
  const status = (m.status || "").toLowerCase();
  const div = (m.division || m.division_slug || "").toLowerCase();

  // Kategori 1: BPH Inti (Ketua Umum/Himpunan, Wakil Ketua, Sekretaris, Bendahara)
  const isBph =
    div === "bph" ||
    status.includes("bph") ||
    role.includes("ketua umum") ||
    role.includes("ketua himpunan") ||
    role.includes("wakil ketua") ||
    role.includes("sekretaris") ||
    role.includes("bendahara");

  if (isBph && !status.includes("alumni") && !role.includes("ex-") && !role.includes("dosen")) {
    let bphRoleRank = 10;
    if (role.includes("ketua umum") || (role.includes("ketua") && !role.includes("wakil") && !role.includes("divisi"))) bphRoleRank = 1;
    else if (role.includes("wakil")) bphRoleRank = 2;
    else if (role.includes("sekretaris 1") || role === "sekretaris") bphRoleRank = 3;
    else if (role.includes("sekretaris")) bphRoleRank = 4;
    else if (role.includes("bendahara 1") || role === "bendahara") bphRoleRank = 5;
    else if (role.includes("bendahara")) bphRoleRank = 6;
    return { categoryRank: 1, divisionRank: 1, roleRank: bphRoleRank, name: m.name || "" };
  }

  // Kategori 2: Pengurus Aktif Divisi (LPT, Medkom, PSDM, Humas, KWU, dll)
  const isPengurus =
    status.includes("pengurus") ||
    role.includes("kadiv") ||
    role.includes("kepala") ||
    role.includes("koordinator") ||
    role.includes("staff") ||
    role.includes("anggota divisi");

  if (isPengurus && !status.includes("alumni") && !role.includes("ex-") && !role.includes("dosen") && !role.includes("pembina")) {
    let divRank = 50;
    if (div.includes("lpt") || div.includes("litbang")) divRank = 10;
    else if (div.includes("medkom") || div.includes("media")) divRank = 20;
    else if (div.includes("psdm")) divRank = 30;
    else if (div.includes("humas") || div.includes("dinas")) divRank = 40;
    else if (div.includes("kwu") || div.includes("kewirausahaan")) divRank = 50;

    let roleRank = 20;
    if (role.includes("kadiv") || role.includes("kepala") || role.includes("koordinator")) roleRank = 1;
    else if (role.includes("sekretaris")) roleRank = 2;
    else if (role.includes("staff") || role.includes("anggota")) roleRank = 10;

    return { categoryRank: 2, divisionRank: divRank, roleRank, name: m.name || "" };
  }

  // Kategori 3: Alumni HMPS-TI (Diurutkan angkatan terbaru dulu)
  const isAlumni = status.includes("alumni") || role.includes("alumni") || role.includes("ex-");
  if (isAlumni) {
    const cohortNum = parseInt(m.cohort || "2020", 10) || 2020;
    return { categoryRank: 3, divisionRank: 1000 - cohortNum, roleRank: 1, name: m.name || "" };
  }

  // Kategori 4: Dosen Penanggung Jawab / Pembina
  const isDosen =
    status.includes("dosen") ||
    role.includes("dosen") ||
    role.includes("pembina") ||
    role.includes("penanggung jawab") ||
    role.includes("kaprodi") ||
    role.includes("pembimbing");

  if (isDosen) {
    return { categoryRank: 4, divisionRank: 1, roleRank: 1, name: m.name || "" };
  }

  // Fallback
  return { categoryRank: 2, divisionRank: 99, roleRank: 99, name: m.name || "" };
}

// Crisp Neubrutalist Social Button Helper
export const getNeubrutalistSocialStyle = (url: string, index: number) => {
  const u = (url || "").toLowerCase();
  const tiltClass = index % 2 === 0 ? "-rotate-2" : "rotate-2";

  let brandColors = "bg-[#FFD700] text-black"; // Yellow default (Website)
  if (u.includes("instagram.com") || u.includes("instagr.am")) {
    brandColors = "bg-[#FF007F] text-white"; // Hot Magenta
  } else if (u.includes("mailto:") || u.includes("gmail") || u.includes("email") || u.includes("@")) {
    brandColors = "bg-[#B31412] text-white"; // Maroon Gmail
  } else if (u.includes("github.com")) {
    brandColors = "bg-[#24292E] text-white"; // GitHub Black
  } else if (u.includes("linkedin.com")) {
    brandColors = "bg-[#0A66C2] text-white"; // LinkedIn Blue
  } else if (u.includes("wa.me") || u.includes("whatsapp")) {
    brandColors = "bg-[#25D366] text-black"; // WhatsApp Green
  }

  return `flex h-7 w-7 items-center justify-center rounded-md border-2 border-black ${brandColors} shadow-[2px_2px_0px_0px_#000000] ${tiltClass} hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer shrink-0`;
};
