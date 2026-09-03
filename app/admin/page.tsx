"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleNotch } from "@phosphor-icons/react";
import { slugify } from "@/lib/utils";
import {
  fetchSiteSettings,
  updateSiteSettings,
  fetchVisionMissions,
  updateVisionMissions,
  fetchNewsList,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  fetchDivisionMembers,
  createDivisionMember,
  updateDivisionMember,
  deleteDivisionMember,
  fetchMembersList,
  createMember,
  updateMember,
  deleteMember,
  fetchProjectsList,
  createStudentProject,
  updateStudentProject,
  deleteStudentProject,
  fetchGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  fetchAspirasiList,
  toggleAspirasiReadStatus,
  deleteAspirasi,
} from "@/services";
import {
  AdminHeader,
  AdminTabNav,
  AdminModals,
  AdminEditModal,
  SettingsTab,
  AspirasiTab,
  BeritaTab,
  StrukturTab,
  KeanggotaanTab,
  VisiMisiTab,
  KaryaTab,
  GaleriTab,
  EditModalState,
  DeleteConfirmModalState,
  AdminTabType,
  divisionOptions,
  newsCategoryOptions,
  eventCategoryOptions,
  isEventArticle,
  cleanDivisionName,
  prepareAutoMemberFromPengurus,
  prepareDivMemberTablePayload,
  prepareMemberTablePayload,
  deriveCohortFromNim,
} from "@/components/modules/admin";

/**
 * Halaman Backoffice Control Center Admin HMPSTI STMIK Widya Utama.
 * Mengorkestrasi autentikasi sesi pengurus dan modul manajemen konten website.
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("hmpsti_admin_session") === "authenticated";
    }
    return false;
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("hmpsti_admin_session") !== "authenticated";
    }
    return true;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("Memproses Data...");

  const [activeTab, setActiveTab] = useState<
    "settings" | "aspirasi" | "berita" | "struktur" | "keanggotaan" | "visi-misi" | "karya" | "galeri"
  >("settings");

  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Confirmation Modal State for Delete
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", onConfirm: () => {} });

  // Edit Modal State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    type: "berita" | "struktur" | "keanggotaan" | "karya" | "galeri" | null;
    item: any;
  }>({ isOpen: false, type: null, item: null });

  // Settings State
  const [settings, setSettings] = useState({
    current_period: "2026",
    email: "hmpsti@gmail.com",
    whatsapp: "+62 838-6952-0998",
    address: "Gedung Kampus STMIK Widya Utama, Jl. Sunan Kalijaga No.26, Purwokerto, Jawa Tengah",
    map_embed_url: "",
  });

  // Aspirasi State
  const [aspirasiList, setAspirasiList] = useState<any[]>([]);

  // Berita & Event Form State
  const [newsList, setNewsList] = useState<any[]>([]);
  const [imageUploadMode, setImageUploadMode] = useState<"url" | "file">("url");
  const [newArticle, setNewArticle] = useState({
    title: "",
    slug: "",
    is_event: false, // false = Berita, true = Event
    category: "Informasi", // Default: News Category
    author_name: "LPT",
    reading_time: "4 min read",
    excerpt: "",
    content: "",
    cover_image: "",
    event_date: "", // Custom Date-Time Picker for Event
  });

  // Edit Image Upload Mode State
  const [editImageUploadMode, setEditImageUploadMode] = useState<"url" | "file">("url");
  const [avatarUploadMode, setAvatarUploadMode] = useState<"url" | "file">("url");
  const [editAvatarUploadMode, setEditAvatarUploadMode] = useState<"url" | "file">("url");
  const [projectUploadMode, setProjectUploadMode] = useState<"url" | "file">("url");
  const [editProjectUploadMode, setEditProjectUploadMode] = useState<"url" | "file">("url");
  const [galleryUploadMode, setGalleryUploadMode] = useState<"url" | "file">("url");
  const [editGalleryUploadMode, setEditGalleryUploadMode] = useState<"url" | "file">("url");

  // Division Options for Publishers
  const divisionOptions = [
    "LPT",
    "PSDM",
    "HUMAS",
    "KWU",
    "MEDKOMINFO",
    "BPH",
  ];

  const getDivisionName = (slug: string) => {
    const s = (slug || "").toLowerCase().trim();
    switch (s) {
      case "bph":
      case "bph-core":
      case "bph-staff":
        return "BPH";
      case "psdm":
        return "PSDM";
      case "lpt":
        return "LPT";
      case "medkominfo":
      case "medkom":
        return "MEDKOMINFO";
      case "humas":
        return "HUMAS";
      case "kwu":
      case "kewirausahaan":
        return "KWU";
      default:
        return "BPH";
    }
  };

  const getDivisionBadgeProps = (slug: string) => {
    const s = (slug || "").toLowerCase().trim();
    switch (s) {
      case "bph":
      case "bph-core":
      case "bph-staff":
        return { variant: "spotify" as const, label: "BPH" };
      case "psdm":
        return { variant: "cyan" as const, label: "PSDM" };
      case "lpt":
        return { variant: "yellow" as const, label: "LPT" };
      case "kwu":
      case "kewirausahaan":
        return { variant: "orange" as const, label: "KWU" };
      case "medkominfo":
      case "medkom":
        return { variant: "purple" as const, label: "MEDKOMINFO" };
      case "humas":
        return { variant: "magenta" as const, label: "HUMAS" };
      default:
        return { variant: "spotify" as const, label: "BPH" };
    }
  };

  const getMemberBadgeVariant = (status: string) => {
    const s = (status || "").toLowerCase().trim();
    if (s.includes("pengurus aktif") || s.includes("pengurus")) {
      return "spotify" as const;
    }
    if (s.includes("alumni")) {
      return "yellow" as const;
    }
    if (s.includes("dosen") || s.includes("pembina") || s.includes("penanggung jawab")) {
      return "cyan" as const;
    }
    return "magenta" as const;
  };

  // Category Options separated for Berita/News vs Event/Agenda
  const newsCategoryOptions = ["Informasi", "Akademik", "Prestasi", "Pengumuman", "Teknologi"];
  const eventCategoryOptions = ["Workshop", "Event", "Webinar", "Kompetisi", "Makrab"];

  const isEventArticle = (article: any) => {
    if (!article) return false;
    if (article.is_event === true || article.is_event === "true") return true;
    const cat = (article.category || "").trim().toLowerCase();
    const eventCats = ["event", "workshop", "webinar", "kompetisi", "makrab"];
    return eventCats.includes(cat);
  };

  const cleanDivisionName = (name: string) => {
    if (!name) return "LPT";
    let clean = name.replace(/^Divisi\s+/i, "").trim();
    const upper = clean.toUpperCase();
    if (upper === "MEDKOM") return "MEDKOMINFO";
    if (upper === "KEWIRAUSAHAAN") return "KWU";
    return clean;
  };

  const openEditNewsModal = (n: any) => {
    const isEvt = isEventArticle(n);
    let cat = n.category || "";
    if (isEvt && !eventCategoryOptions.includes(cat)) {
      cat = "Workshop";
    } else if (!isEvt && !newsCategoryOptions.includes(cat)) {
      cat = "Informasi";
    }
    setEditModal({
      isOpen: true,
      type: "berita",
      item: {
        ...n,
        is_event: isEvt,
        category: cat,
        author_name: cleanDivisionName(n.author_name),
      },
    });
  };

  // Struktur Divisi State
  const [divisionMembers, setDivisionMembers] = useState<any[]>([]);
  const [newDivMember, setNewDivMember] = useState({
    name: "",
    nim: "",
    division_slug: "bph",
    role: "Staff Divisi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    email: "",
    instagram_url: "",
    social_links: [] as string[],
  });

  // Keanggotaan State
  const [membersList, setMembersList] = useState<any[]>([]);
  const [newMember, setNewMember] = useState({
    name: "",
    nim: "",
    cohort: "2024",
    status: "Alumni HMPS-TI",
    role: "Alumni Mahasiswa",
    avatar: "",
    variant: "yellow",
    email: "",
    instagram_url: "",
    social_links: [] as string[],
  });

  // Visi Misi State
  const [visionText, setVisionText] = useState("");
  const [missionsList, setMissionsList] = useState<any[]>([]);

  // Karya State
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [newProject, setNewProject] = useState<{
    title: string;
    category: string;
    description: string;
    content: string;
    author_name: string;
    author_nim: string;
    tech_stack: string | string[];
    github_url: string;
    demo_url: string;
    cover_image: string;
  }>({
    title: "",
    category: "WEB APP",
    description: "",
    content: "",
    author_name: "",
    author_nim: "",
    tech_stack: "Next.js, TypeScript, Tailwind",
    github_url: "https://github.com",
    demo_url: "https://demo.example.com",
    cover_image: "",
  });

  // Galeri State
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    category: "Makrab & Pelantikan",
    event_date: "18 Oktober 2026",
    url: "",
    description: "",
  });

  // Auth Guard Check: Strictly validates active browser session
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clean up legacy localStorage session so browser close forces re-login
      localStorage.removeItem("hmpsti_admin_session");

      const session = sessionStorage.getItem("hmpsti_admin_session");
      if (session === "authenticated") {
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        loadAllData();
      } else {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        router.replace("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hmpsti_admin_session");
      localStorage.removeItem("hmpsti_admin_session");
    }
    setIsAuthenticated(false);
    router.replace("/login");
  };

  // Lock body scrolling when Modals are active
  useEffect(() => {
    if (editModal.isOpen || deleteConfirmModal.isOpen || isProcessing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [editModal.isOpen, deleteConfirmModal.isOpen, isProcessing]);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const startProcessing = (text: string) => {
    setProcessingText(text);
    setIsProcessing(true);
  };

  const stopProcessing = () => {
    setTimeout(() => {
      setIsProcessing(false);
    }, 800);
  };

  async function loadAllData() {
    const sData = await fetchSiteSettings();
    if (sData) setSettings(sData);

    const vData = await fetchVisionMissions();
    if (vData) {
      setVisionText(vData.vision || "");
      setMissionsList(vData.missions || []);
    }

    const nData = await fetchNewsList();
    setNewsList(nData || []);

    const dData = await fetchDivisionMembers();
    setDivisionMembers(dData || []);

    const mData = await fetchMembersList();
    setMembersList(mData || []);

    const pData = await fetchProjectsList();
    setProjectsList(pData || []);

    const gData = await fetchGalleryItems();
    setGalleryList(gData || []);

    const aData = await fetchAspirasiList();
    setAspirasiList(aData || []);
  }

  // File Reader Helper for Device Image Upload (with Canvas Compression)
  const handleDeviceFileUpload = (file: File, callback: (base64Url: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        callback(compressedBase64);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    startProcessing("Menyimpan Pengaturan...");
    await updateSiteSettings(settings);
    stopProcessing();
    showNotify("Pengaturan informasi website berhasil disimpan!");
  };

  // Misi Dynamic Handlers
  const handleAddMisiItem = () => {
    setMissionsList((prev: any[]) => [...prev, { title: "", desc: "", indicator: "" }]);
  };

  const handleRemoveMisiItem = (index: number) => {
    if (missionsList.length <= 3) {
      showNotify("Diwajibkan mempertahankan minimal 3 Poin Misi!");
      return;
    }
    setMissionsList((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const handleMisiChange = (index: number, field: string, value: string) => {
    setMissionsList((prev: any[]) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle Save Vision Mission
  const handleSaveVisionMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visionText.trim()) {
      showNotify("Teks Visi Utama wajib diisi!");
      return;
    }

    const filledMissions = missionsList.filter((m: any) => m.title && m.title.trim() !== "");
    if (filledMissions.length < 3) {
      showNotify("Diwajibkan mengisi minimal 3 Poin Misi dengan judul yang jelas!");
      return;
    }

    const formattedMissions = filledMissions.map((m: any, idx: number) => ({
      number: String(idx + 1).padStart(2, "0"),
      title: m.title.trim(),
      desc: (m.desc || "").trim(),
      indicator: (m.indicator || "").trim(),
    }));

    startProcessing("Menyimpan Visi & Misi...");
    await updateVisionMissions({ vision: visionText.trim(), missions: formattedMissions });
    stopProcessing();
    showNotify("1 Visi Utama & " + formattedMissions.length + " Poin Misi berhasil disimpan!");
    await loadAllData();
  };

  // CRUD Berita & Event Operations
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) {
      showNotify("Harap isi Judul dan Konten Berita!");
      return;
    }

    const isEvt = newArticle.is_event || eventCategoryOptions.includes(newArticle.category);
    startProcessing(isEvt ? "Menerbitkan Event Baru..." : "Menerbitkan Berita Baru...");
    const generatedSlug = newArticle.slug || newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uploadTimestamp = new Date().toISOString();

    const payload = {
      title: newArticle.title,
      slug: generatedSlug,
      is_event: isEvt,
      category: newArticle.category || (isEvt ? "Workshop" : "Informasi"),
      author_name: newArticle.author_name || "LPT",
      excerpt: newArticle.excerpt || newArticle.content.substring(0, 140),
      content: newArticle.content,
      cover_image: newArticle.cover_image || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop",
      created_at: uploadTimestamp,
      event_date: isEvt ? (newArticle.event_date ? new Date(newArticle.event_date).toISOString() : uploadTimestamp) : null,
      reading_time: newArticle.reading_time || "4 min read",
    };

    const res = await createNewsArticle(payload);
    stopProcessing();

    if (res.success) {
      showNotify(isEvt ? "Event baru berhasil diterbitkan!" : "Berita baru berhasil diterbitkan!");
      setNewArticle({
        title: "",
        slug: "",
        is_event: false,
        category: "Informasi",
        author_name: "LPT",
        reading_time: "4 min read",
        excerpt: "",
        content: "",
        cover_image: "",
        event_date: "",
      });
      await loadAllData();
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.item?.title) return;
    startProcessing("Memperbarui Data Berita...");
    const item = editModal.item;
    const isEvt = item.is_event || eventCategoryOptions.includes(item.category);

    const payload = {
      ...item,
      is_event: isEvt,
      category: item.category || (isEvt ? "Workshop" : "Informasi"),
      event_date: isEvt ? (item.event_date ? new Date(item.event_date).toISOString() : item.created_at) : null,
    };

    await updateNewsArticle(item.id, payload);
    setEditModal({ isOpen: false, type: null, item: null });
    stopProcessing();
    showNotify("Data berita/event berhasil diperbarui!");
    await loadAllData();
  };

  // Helper Derive Cohort Year from Campus NIM (e.g. STI202303494 -> 2023)
  const deriveCohortFromNim = (nim: string) => {
    const clean = (nim || "").trim().toUpperCase();

    // 1. Kampus Format: 3 huruf (e.g. STI) + 4 digit tahun angkatan (e.g. 2023) + digit (STI202303494 -> 2023)
    const campusMatch = clean.match(/^[A-Z]{3}(\d{4})/);
    if (campusMatch && campusMatch[1]) {
      return campusMatch[1];
    }

    // 2. Fallback: 4 digit tahun di awal NIM (e.g. 202301010 -> 2023)
    const yearMatch = clean.match(/^(\d{4})/);
    if (yearMatch && yearMatch[1]) {
      return yearMatch[1];
    }

    // 3. Fallback: 2 digit tahun di awal NIM (e.g. 220101010 -> 2022)
    const shortYearMatch = clean.match(/^(\d{2})/);
    if (shortYearMatch && shortYearMatch[1]) {
      return `20${shortYearMatch[1]}`;
    }

    return "2024";
  };

  // Helper Auto-Sync Pengurus -> Keanggotaan & Alumni Payload
  const prepareAutoMemberFromPengurus = (divMember: any) => {
    const socialLinks = Array.isArray(divMember.social_links) ? divMember.social_links.filter(Boolean) : [];
    const githubLink = socialLinks.find((l: string) => l.includes("github.com")) || divMember.github_url || "";
    const linkedinLink = socialLinks.find((l: string) => l.includes("linkedin.com")) || divMember.linkedin_url || "";

    return {
      name: divMember.name || "",
      nim: divMember.nim || "",
      cohort: deriveCohortFromNim(divMember.nim),
      status: "Pengurus Aktif",
      role: divMember.role || "Staff Divisi",
      avatar: divMember.avatar || divMember.image_url || "",
      variant: "spotify",
      email: divMember.email || "",
      instagram_url: divMember.instagram_url || "",
      github_url: githubLink,
      linkedin_url: linkedinLink,
      social_links: socialLinks,
    };
  };

  // Payload Sanitizer for Division Members (division_members table)
  const prepareDivMemberTablePayload = (data: any) => {
    const socialLinks = Array.isArray(data.social_links)
      ? data.social_links.map((s: string) => (s || "").trim()).filter(Boolean)
      : [];
    const githubLink =
      socialLinks.find((l: string) => l.includes("github.com")) ||
      (data.github_url && data.github_url.trim() !== "https://github.com" ? data.github_url.trim() : "");
    const linkedinLink =
      socialLinks.find((l: string) => l.includes("linkedin.com")) ||
      (data.linkedin_url && data.linkedin_url.trim() !== "https://linkedin.com" ? data.linkedin_url.trim() : "");

    const payload: any = {
      name: data.name || "",
      nim: data.nim || "",
      division_slug: data.division_slug || "bph",
      role: data.role || "Staff Divisi",
      avatar: data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      email: (data.email || "").trim(),
      instagram_url: (data.instagram_url || "").trim(),
      github_url: githubLink,
      linkedin_url: linkedinLink,
      social_links: socialLinks,
    };

    if (data.id) {
      payload.id = data.id;
    }

    return payload;
  };

  // Payload Sanitizer for Keanggotaan & Alumni (members table)
  const prepareMemberTablePayload = (data: any) => {
    const socialLinks = Array.isArray(data.social_links)
      ? data.social_links.map((s: string) => (s || "").trim()).filter(Boolean)
      : [];
    const githubLink =
      socialLinks.find((l: string) => l.includes("github.com")) ||
      (data.github_url && data.github_url.trim() !== "https://github.com" ? data.github_url.trim() : "");
    const linkedinLink =
      socialLinks.find((l: string) => l.includes("linkedin.com")) ||
      (data.linkedin_url && data.linkedin_url.trim() !== "https://linkedin.com" ? data.linkedin_url.trim() : "");

    const payload: any = {
      name: data.name || "",
      nim: data.nim || "",
      cohort: data.cohort || deriveCohortFromNim(data.nim),
      status: data.status || "Alumni HMPS-TI",
      role: data.role || "Alumni Mahasiswa",
      avatar: data.avatar || data.image_url || data.avatar_url || "",
      variant: getMemberBadgeVariant(data.status || "Alumni HMPS-TI"),
      email: (data.email || "").trim(),
      instagram_url: (data.instagram_url || "").trim(),
      github_url: githubLink,
      linkedin_url: linkedinLink,
      social_links: socialLinks,
    };

    if (data.id) {
      payload.id = data.id;
    }

    return payload;
  };

  const handleCreateDivMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDivMember.name || !newDivMember.nim) {
      showNotify("Harap isi Nama Lengkap dan NIM!");
      return;
    }
    startProcessing("Menambahkan Pengurus & Sinkronisasi Keanggotaan...");
    const payload = prepareDivMemberTablePayload(newDivMember);
    const res = await createDivisionMember(payload);

    if (res.success) {
      // Otomatis tambahkan juga ke tabel Keanggotaan & Alumni (Status: Pengurus Aktif)
      const autoMemberPayload = prepareAutoMemberFromPengurus(res.data || payload);
      await createMember(autoMemberPayload);

      stopProcessing();
      showNotify("Pengurus divisi & data keanggotaan berhasil ditambahkan!");
      setNewDivMember({
        name: "",
        nim: "",
        division_slug: "bph",
        role: "Staff Divisi",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        email: "",
        instagram_url: "",
        social_links: [],
      });
      await loadAllData();
    } else {
      stopProcessing();
      showNotify("Gagal menambahkan pengurus: " + (res.error || "Terjadi kesalahan database"));
    }
  };

  const handleUpdateDivMember = async (e: React.FormEvent) => {
    e.preventDefault();
    startProcessing("Memperbarui Data Pengurus & Keanggotaan...");
    const item = prepareDivMemberTablePayload(editModal.item);
    const res = await updateDivisionMember(item.id, item);
    setEditModal({ isOpen: false, type: null, item: null });

    if (res.success) {
      // Otomatis perbarui data yang cocok di Keanggotaan & Alumni
      const autoMemberPayload = prepareAutoMemberFromPengurus(item);
      const existingMember = membersList.find((m) => m.nim === item.nim || m.name === item.name);
      if (existingMember) {
        await updateMember(existingMember.id, { ...existingMember, ...autoMemberPayload });
      } else {
        await createMember(autoMemberPayload);
      }

      stopProcessing();
      showNotify("Data pengurus divisi & keanggotaan berhasil diperbarui!");
      await loadAllData();
    } else {
      stopProcessing();
      showNotify("Gagal memperbarui pengurus: " + (res.error || "Terjadi kesalahan database"));
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.nim) {
      showNotify("Harap isi Nama Lengkap dan NIM!");
      return;
    }
    startProcessing("Menambahkan Anggota...");
    const payload = prepareMemberTablePayload(newMember);
    const res = await createMember(payload);
    stopProcessing();

    if (res.success) {
      showNotify("Anggota/Alumni baru berhasil ditambahkan!");
      setNewMember({
        name: "",
        nim: "",
        cohort: "2024",
        status: "Alumni HMPS-TI",
        role: "Alumni Mahasiswa",
        avatar: "",
        variant: "yellow",
        email: "",
        instagram_url: "",
        social_links: [],
      });
      await loadAllData();
    } else {
      showNotify("Gagal menambahkan anggota: " + (res.error || "Terjadi kesalahan database"));
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    startProcessing("Memperbarui Data Anggota...");
    const item = prepareMemberTablePayload(editModal.item);
    const res = await updateMember(item.id, item);
    setEditModal({ isOpen: false, type: null, item: null });
    stopProcessing();
    if (res.success) {
      showNotify("Data anggota berhasil diperbarui!");
      await loadAllData();
    } else {
      showNotify("Gagal memperbarui anggota: " + (res.error || "Terjadi kesalahan database"));
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) {
      showNotify("Judul karya wajib diisi!");
      return;
    }
    startProcessing("Menambahkan Showcase Karya...");
    try {
      const stackArray =
        typeof newProject.tech_stack === "string"
          ? newProject.tech_stack.split(",").map((s) => s.trim())
          : newProject.tech_stack;
      const slug = slugify(newProject.title);
      await createStudentProject({ ...newProject, slug, tech_stack: stackArray });
      showNotify("Showcase karya mahasiswa berhasil ditambahkan!");
      setNewProject({
        title: "",
        category: "WEB APP",
        description: "",
        content: "",
        author_name: "",
        author_nim: "",
        tech_stack: "Next.js, TypeScript, Tailwind",
        github_url: "https://github.com",
        demo_url: "https://demo.example.com",
        cover_image: "",
      });
      await loadAllData();
    } catch (err) {
      console.error("handleCreateProject Error:", err);
      showNotify("Gagal menambahkan showcase karya.");
    } finally {
      stopProcessing();
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    startProcessing("Memperbarui Karya...");
    try {
      const item = editModal.item;
      const stackArray =
        typeof item.tech_stack === "string"
          ? item.tech_stack.split(",").map((s: string) => s.trim())
          : item.tech_stack;
      const slug = item.slug || slugify(item.title);
      await updateStudentProject(item.id, { ...item, slug, tech_stack: stackArray });
      setEditModal({ isOpen: false, type: null, item: null });
      showNotify("Karya mahasiswa berhasil diperbarui!");
      await loadAllData();
    } catch (err) {
      console.error("handleUpdateProject Error:", err);
      showNotify("Gagal memperbarui karya.");
    } finally {
      stopProcessing();
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.url) {
      showNotify("Judul dan Foto Galeri wajib diisi!");
      return;
    }
    startProcessing("Menambahkan Foto Galeri...");
    try {
      await createGalleryItem(newGalleryItem);
      showNotify("Dokumentasi galeri berhasil ditambahkan!");
      setNewGalleryItem({
        title: "",
        category: "MAKRAB & INAUGURASI",
        event_date: new Date().toISOString(),
        url: "",
        description: "",
      });
      await loadAllData();
    } catch (err) {
      console.error("handleCreateGallery Error:", err);
      showNotify("Gagal menyimpan galeri.");
    } finally {
      stopProcessing();
    }
  };

  const handleUpdateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    startProcessing("Memperbarui Foto Galeri...");
    try {
      const item = editModal.item;
      await updateGalleryItem(item.id, item);
      setEditModal({ isOpen: false, type: null, item: null });
      showNotify("Foto galeri berhasil diperbarui!");
      await loadAllData();
    } catch (err) {
      console.error("handleUpdateGallery Error:", err);
      showNotify("Gagal memperbarui galeri.");
    } finally {
      stopProcessing();
    }
  };

  const promptDelete = (title: string, action: () => Promise<any>) => {
    setDeleteConfirmModal({
      isOpen: true,
      title,
      onConfirm: async () => {
        setDeleteConfirmModal({ isOpen: false, title: "", onConfirm: () => {} });
        startProcessing(`Menghapus "${title}"...`);
        await action();
        await loadAllData();
        stopProcessing();
        showNotify(`Data "${title}" berhasil dihapus!`);
      },
    });
  };

  // Auth verified

  // Filtered lists for search feature
    const q = (searchQuery || "").toLowerCase();

  const filteredAspirasi = (aspirasiList || []).filter(
    (a) =>
      ((a && a.subject) || "").toLowerCase().includes(q) ||
      ((a && a.message) || "").toLowerCase().includes(q) ||
      ((a && a.sender_name) || "").toLowerCase().includes(q)
  );

  const filteredNews = (newsList || []).filter(
    (n) =>
      ((n && n.title) || "").toLowerCase().includes(q) ||
      ((n && n.category) || "").toLowerCase().includes(q) ||
      ((n && n.author_name) || "").toLowerCase().includes(q)
  );

  const filteredDivMembers = (divisionMembers || []).filter(
    (d) =>
      ((d && d.name) || "").toLowerCase().includes(q) ||
      ((d && d.nim) || "").toLowerCase().includes(q) ||
      ((d && d.role) || "").toLowerCase().includes(q)
  );

  const filteredMembers = (membersList || []).filter(
    (m) =>
      ((m && m.name) || "").toLowerCase().includes(q) ||
      ((m && m.nim) || "").toLowerCase().includes(q) ||
      ((m && m.role) || "").toLowerCase().includes(q)
  );

  const filteredProjects = (projectsList || []).filter(
    (p) =>
      ((p && p.title) || "").toLowerCase().includes(q) ||
      ((p && p.category) || "").toLowerCase().includes(q) ||
      ((p && p.author_name) || "").toLowerCase().includes(q)
  );

  const filteredGallery = (galleryList || []).filter(
    (g) =>
      ((g && g.title) || "").toLowerCase().includes(q) ||
      ((g && g.category) || "").toLowerCase().includes(q) ||
      ((g && g.description) || "").toLowerCase().includes(q)
  );

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-2.5 font-mono text-xs text-slate-400">
          <div className="h-4 w-4 rounded-full border-2 border-[#1DB954] border-t-transparent animate-spin" />
          <span>Memuat console admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Modal Dialogs (Processing, Toast, Delete Confirmation) */}
      <AdminModals
        isProcessing={isProcessing}
        processingText={processingText}
        notification={notification}
        deleteConfirmModal={deleteConfirmModal}
        onCloseDeleteModal={() =>
          setDeleteConfirmModal({ isOpen: false, title: "", onConfirm: () => {} })
        }
      />

      {/* 2. Universal Edit Modal */}
      <AdminEditModal
        editModal={editModal}
        setEditModal={setEditModal}
        editImageUploadMode={editImageUploadMode}
        setEditImageUploadMode={setEditImageUploadMode}
        editAvatarUploadMode={editAvatarUploadMode}
        setEditAvatarUploadMode={setEditAvatarUploadMode}
        editProjectUploadMode={editProjectUploadMode}
        setEditProjectUploadMode={setEditProjectUploadMode}
        editGalleryUploadMode={editGalleryUploadMode}
        setEditGalleryUploadMode={setEditGalleryUploadMode}
        handleDeviceFileUpload={handleDeviceFileUpload}
        handleUpdateNews={handleUpdateNews}
        handleUpdateDivMember={handleUpdateDivMember}
        handleUpdateMember={handleUpdateMember}
        handleUpdateProject={handleUpdateProject}
        handleUpdateGallery={handleUpdateGallery}
      />

      {/* 3. Header Banner Console */}
      <AdminHeader onLogout={handleLogout} />

      {/* 4. Tab Navigation Bar */}
      <AdminTabNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery("");
        }}
        unreadAspirasiCount={(aspirasiList || []).filter((a) => a && !a.is_read).length}
      />

      {/* 5. Tab Panels */}
      {activeTab === "settings" && (
        <SettingsTab
          settings={settings}
          onSettingsChange={setSettings}
          onSaveSettings={handleSaveSettings}
        />
      )}

      {activeTab === "aspirasi" && (
        <AspirasiTab
          aspirasiList={filteredAspirasi}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleReadStatus={(id, isRead) =>
            toggleAspirasiReadStatus(id, isRead).then(() => loadAllData())
          }
          onDeleteAspirasi={(asp) =>
            promptDelete(asp.sender_name || "Aspirasi", () => deleteAspirasi(asp.id))
          }
        />
      )}

      {activeTab === "berita" && (
        <BeritaTab
          newArticle={newArticle}
          onNewArticleChange={setNewArticle}
          imageUploadMode={imageUploadMode}
          onImageUploadModeChange={setImageUploadMode}
          onDeviceFileUpload={(e, setter) => {
            const file = e.target.files?.[0];
            if (file) handleDeviceFileUpload(file, setter);
          }}
          onCreateNews={handleCreateNews}
          newsList={filteredNews}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenEditModal={openEditNewsModal}
          onDeleteArticle={(n) =>
            promptDelete(n.title, () => deleteNewsArticle(n.id))
          }
        />
      )}

      {activeTab === "struktur" && (
        <StrukturTab
          newDivMember={newDivMember}
          onNewDivMemberChange={setNewDivMember}
          avatarUploadMode={avatarUploadMode}
          onAvatarUploadModeChange={setAvatarUploadMode}
          onDeviceFileUpload={handleDeviceFileUpload}
          onCreateDivMember={handleCreateDivMember}
          divisionMembers={filteredDivMembers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenEditModal={(m) =>
            setEditModal({ isOpen: true, type: "struktur", item: m })
          }
          onDeleteMember={(m) =>
            promptDelete(m.name, () => deleteDivisionMember(m.id))
          }
        />
      )}

      {activeTab === "keanggotaan" && (
        <KeanggotaanTab
          newMember={newMember}
          onNewMemberChange={setNewMember}
          avatarUploadMode={avatarUploadMode}
          onAvatarUploadModeChange={setAvatarUploadMode}
          onDeviceFileUpload={handleDeviceFileUpload}
          onCreateMember={handleCreateMember}
          membersList={filteredMembers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenEditModal={(m) =>
            setEditModal({ isOpen: true, type: "keanggotaan", item: m })
          }
          onDeleteMember={(m) =>
            promptDelete(m.name, () => deleteMember(m.id))
          }
        />
      )}

      {activeTab === "visi-misi" && (
        <VisiMisiTab
          visionText={visionText}
          onVisionTextChange={setVisionText}
          missionsList={missionsList}
          onAddMisiItem={handleAddMisiItem}
          onRemoveMisiItem={handleRemoveMisiItem}
          onMisiChange={handleMisiChange}
          onSaveVisionMission={handleSaveVisionMission}
        />
      )}

      {activeTab === "karya" && (
        <KaryaTab
          newProject={newProject}
          onNewProjectChange={setNewProject}
          projectUploadMode={projectUploadMode}
          onProjectUploadModeChange={setProjectUploadMode}
          onDeviceFileUpload={handleDeviceFileUpload}
          onCreateProject={handleCreateProject}
          projectsList={filteredProjects}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenEditModal={(p) =>
            setEditModal({ isOpen: true, type: "karya", item: p })
          }
          onDeleteProject={(p) =>
            promptDelete(p.title, () => deleteStudentProject(p.id))
          }
        />
      )}

      {activeTab === "galeri" && (
        <GaleriTab
          newGalleryItem={newGalleryItem}
          onNewGalleryItemChange={setNewGalleryItem}
          galleryUploadMode={galleryUploadMode}
          onGalleryUploadModeChange={setGalleryUploadMode}
          onDeviceFileUpload={handleDeviceFileUpload}
          onCreateGallery={handleCreateGallery}
          galleryList={filteredGallery}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenEditModal={(g) =>
            setEditModal({ isOpen: true, type: "galeri", item: g })
          }
          onDeleteGallery={(g) =>
            promptDelete(g.title, () => deleteGalleryItem(g.id))
          }
        />
      )}
    </div>
  );
}
