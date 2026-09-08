"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FloppyDisk,
  NewspaperClipping,
  Calendar,
  LinkSimple,
  UploadSimple,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CyberSelect } from "@/components/ui/CyberSelect";
import { CyberDateTimePicker } from "@/components/ui/CyberDateTimePicker";
import { SocialLinksInput } from "@/components/ui/SocialIcon";
import {
  divisionOptions,
  newsCategoryOptions,
  eventCategoryOptions,
  cleanDivisionName,
} from "./adminUtils";

export interface EditModalState {
  isOpen: boolean;
  type: "berita" | "struktur" | "keanggotaan" | "karya" | "galeri" | "proker" | null;
  item: any;
}

export interface AdminEditModalProps {
  editModal: EditModalState;
  setEditModal: React.Dispatch<React.SetStateAction<EditModalState>>;
  editImageUploadMode: "url" | "file";
  setEditImageUploadMode: (mode: "url" | "file") => void;
  editAvatarUploadMode: "url" | "file";
  setEditAvatarUploadMode: (mode: "url" | "file") => void;
  editProjectUploadMode: "url" | "file";
  setEditProjectUploadMode: (mode: "url" | "file") => void;
  editGalleryUploadMode: "url" | "file";
  setEditGalleryUploadMode: (mode: "url" | "file") => void;
  handleDeviceFileUpload: (file: File, setter: (url: string) => void) => void;
  handleUpdateNews: (e: React.FormEvent) => void;
  handleUpdateDivMember: (e: React.FormEvent) => void;
  handleUpdateMember: (e: React.FormEvent) => void;
  handleUpdateProject: (e: React.FormEvent) => void;
  handleUpdateGallery: (e: React.FormEvent) => void;
  handleUpdateProker: (e: React.FormEvent) => void;
}

/**
 * Universal Edit Modal: Modal dialog pengeditan data backoffice admin yang mendukung
 * 5 modul entitas: Berita/Event, Pengurus Struktur, Keanggotaan/Alumni, Karya, dan Galeri.
 */
export const AdminEditModal: React.FC<AdminEditModalProps> = ({
  editModal,
  setEditModal,
  editImageUploadMode,
  setEditImageUploadMode,
  editAvatarUploadMode,
  setEditAvatarUploadMode,
  editProjectUploadMode,
  setEditProjectUploadMode,
  editGalleryUploadMode,
  setEditGalleryUploadMode,
  handleDeviceFileUpload,
  handleUpdateNews,
  handleUpdateDivMember,
  handleUpdateMember,
  handleUpdateProject,
  handleUpdateGallery,
  handleUpdateProker,
}) => {
  return (
    <AnimatePresence>
      {editModal.isOpen && editModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            data-lenis-prevent
            className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#121520] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <Badge
                variant={
                  editModal.type === "berita"
                    ? "spotify"
                    : editModal.type === "struktur"
                    ? "cyan"
                    : editModal.type === "keanggotaan"
                    ? "yellow"
                    : editModal.type === "karya"
                    ? "emerald"
                    : editModal.type === "proker"
                    ? "cyan"
                    : "purple"
                }
                tilt="left"
                className="my-0 text-xs font-black"
              >
                EDIT DATA {editModal.type?.toUpperCase()}
              </Badge>
                <button
                  onClick={() => setEditModal({ isOpen: false, type: null, item: null })}
                  className="p-1.5 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] hover:rotate-0 rotate-2 transition-all cursor-pointer"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* Edit Berita & Event Form */}
              {editModal.type === "berita" && (
                <form onSubmit={handleUpdateNews} className="space-y-4">
                  {/* Jenis Berita Toggle */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Jenis Konten</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentCat = editModal.item.category;
                          const nextCat = newsCategoryOptions.includes(currentCat) ? currentCat : "Informasi";
                          setEditModal({ ...editModal, item: { ...editModal.item, is_event: false, category: nextCat } });
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                          !editModal.item.is_event
                            ? "bg-[#1DB954] text-black border-[#1DB954] shadow-md"
                            : "bg-white/[0.04] text-slate-300 border-white/10"
                        }`}
                      >
                        <NewspaperClipping size={16} /> Berita / News
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentCat = editModal.item.category;
                          const nextCat = eventCategoryOptions.includes(currentCat) ? currentCat : "Workshop";
                          setEditModal({ ...editModal, item: { ...editModal.item, is_event: true, category: nextCat } });
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                          editModal.item.is_event
                            ? "bg-yellow-400 text-black border-yellow-400 shadow-md"
                            : "bg-white/[0.04] text-slate-300 border-white/10"
                        }`}
                      >
                        <Calendar size={16} /> Event / Agenda
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Judul Berita / Event *</label>
                    <input
                      type="text"
                      required
                      value={editModal.item.title}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, title: e.target.value } })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                    <div>
                      <CyberSelect
                        label="Divisi Penerbit *"
                        value={editModal.item.author_name}
                        onChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, author_name: val } })}
                        options={divisionOptions}
                      />
                    </div>

                    <div>
                      <CyberSelect
                        label={`Kategori ${editModal.item.is_event ? "(Event)" : "(News)"} *`}
                        value={editModal.item.category}
                        onChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, category: val } })}
                        options={editModal.item.is_event ? eventCategoryOptions : newsCategoryOptions}
                      />
                    </div>

                    <div>
                      {editModal.item.is_event ? (
                        <CyberDateTimePicker
                          value={editModal.item.event_date || ""}
                          onChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, event_date: val } })}
                          label="Tanggal Event *"
                        />
                      ) : (
                        <div className="space-y-1">
                          <label className="block text-xs font-mono text-slate-400">Tanggal Terbit</label>
                          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs font-mono font-bold text-center">
                            Hari Ini
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Menit Baca</label>
                      <input
                        type="text"
                        value={editModal.item.reading_time || "4 min read"}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, reading_time: e.target.value } })}
                        placeholder="e.g. 4 min read"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Cover Image Upload (Dual Mode: Sejajar secara Horizontal & Sneakpeek Preview) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Gambar Cover</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Sneakpeek Preview Persegi Panjang */}
                      {editModal.item?.cover_image && (
                        <div className="relative shrink-0 group">
                          <img
                            src={editModal.item.cover_image}
                            alt="Sneakpeek Cover"
                            className="h-12 w-24 rounded-xl border-2 border-black bg-slate-900 object-cover shadow-[2px_2px_0px_0px_#000000]"
                          />
                          <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 text-[7px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                            PREVIEW
                          </span>
                        </div>
                      )}

                      <div className="flex-1 w-full">
                        {editImageUploadMode === "url" ? (
                          <input
                            key="news-edit-url-input"
                            type="text"
                            value={editModal.item?.cover_image || ""}
                            onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, cover_image: e.target.value } })}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                          />
                        ) : (
                          <input
                            key="news-edit-file-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleDeviceFileUpload(file, (base64Url) => {
                                  setEditModal({ ...editModal, item: { ...editModal.item, cover_image: base64Url } });
                                });
                              }
                            }}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditImageUploadMode("url");
                            if (editModal.item?.cover_image?.startsWith("data:image")) {
                              setEditModal({ ...editModal, item: { ...editModal.item, cover_image: "" } });
                            }
                          }}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editImageUploadMode === "url"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <LinkSimple size={14} weight="bold" /> URL Gambar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditImageUploadMode("file")}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editImageUploadMode === "file"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <UploadSimple size={14} weight="bold" /> Upload Device
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Ringkasan Singkat (Excerpt)</label>
                    <textarea
                      rows={2}
                      value={editModal.item.excerpt}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, excerpt: e.target.value } })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Konten Berita / Event Lengkap *
                    </label>
                    <textarea
                      rows={10}
                      required
                      value={editModal.item.content}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, content: e.target.value } })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans min-h-[220px]"
                    />
                  </div>

                  <Button variant="spotify" size="md" className="w-full" icon={<FloppyDisk size={16} weight="bold" />}>
                    Simpan Perubahan Berita / Event
                  </Button>
                </form>
              )}

              {/* Edit Form for Other Entities */}
              {editModal.type === "struktur" && (
                <form onSubmit={handleUpdateDivMember} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={editModal.item.name || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, name: e.target.value } })}
                        placeholder="Nama Lengkap"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">NIM Pengurus *</label>
                      <input
                        type="text"
                        required
                        value={editModal.item.nim || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, nim: e.target.value } })}
                        placeholder="NIM Pengurus"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Divisi *</label>
                      <CyberSelect
                        options={[
                          { value: "bph", label: "BPH" },
                          { value: "psdm", label: "PSDM" },
                          { value: "lpt", label: "LPT" },
                          { value: "medkominfo", label: "MEDKOMINFO" },
                          { value: "humas", label: "HUMAS" },
                          { value: "kwu", label: "KWU" },
                        ]}
                        value={editModal.item.division_slug || "bph"}
                        onChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, division_slug: val } })}
                        placeholder="Pilih Divisi..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Jabatan *</label>
                      <input
                        type="text"
                        value={editModal.item.role || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, role: e.target.value } })}
                        placeholder="e.g. Kadiv LPT / Staff"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Foto Avatar Upload (Dual Mode: Sejajar secara Horizontal & Sneakpeek Profil Bulat) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Foto Avatar Pengurus</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Sneakpeek Preview Bulat */}
                      {editModal.item?.avatar && (
                        <div className="relative shrink-0 group">
                          <img
                            src={editModal.item.avatar}
                            alt="Sneakpeek Avatar"
                            className="h-12 w-12 rounded-full border-2 border-black bg-slate-900 object-cover shadow-[2px_2px_0px_0px_#000000]"
                          />
                          <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[7px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                            PREVIEW
                          </span>
                        </div>
                      )}

                      <div className="flex-1 w-full">
                        {editAvatarUploadMode === "url" ? (
                          <input
                            key="div-edit-url-input"
                            type="text"
                            value={editModal.item?.avatar || ""}
                            onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, avatar: e.target.value } })}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                          />
                        ) : (
                          <input
                            key="div-edit-file-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleDeviceFileUpload(file, (base64Url) => {
                                  setEditModal({ ...editModal, item: { ...editModal.item, avatar: base64Url } });
                                });
                              }
                            }}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                          />
                        )}
                      </div>

                      {/* Mode Buttons Sejajar di Kanan Field */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditAvatarUploadMode("url");
                            if (editModal.item?.avatar?.startsWith("data:image")) {
                              setEditModal({ ...editModal, item: { ...editModal.item, avatar: "" } });
                            }
                          }}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editAvatarUploadMode === "url"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <LinkSimple size={14} weight="bold" /> URL Gambar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditAvatarUploadMode("file")}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editAvatarUploadMode === "file"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <UploadSimple size={14} weight="bold" /> Upload Device
                        </button>
                      </div>
                    </div>
                  </div>

                  <SocialLinksInput
                    instagramUrl={editModal.item.instagram_url || ""}
                    onInstagramChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, instagram_url: val } })}
                    email={editModal.item.email || ""}
                    onEmailChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, email: val } })}
                    extraLinks={editModal.item.social_links || []}
                    onExtraLinksChange={(links) => setEditModal({ ...editModal, item: { ...editModal.item, social_links: links } })}
                  />

                  <Button variant="spotify" size="md" className="w-full" icon={<FloppyDisk size={16} weight="bold" />}>
                    Simpan Perubahan Pengurus
                  </Button>
                </form>
              )}

              {editModal.type === "keanggotaan" && (
                <form onSubmit={handleUpdateMember} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={editModal.item.name}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, name: e.target.value } })}
                        placeholder="Nama Lengkap"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">NIM *</label>
                      <input
                        type="text"
                        value={editModal.item.nim || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, nim: e.target.value } })}
                        placeholder="NIM"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Tahun Angkatan</label>
                      <input
                        type="text"
                        value={editModal.item.cohort || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, cohort: e.target.value } })}
                        placeholder="e.g. 2024"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                      />
                    </div>
                    <CyberSelect
                      label="Status Keanggotaan"
                      value={editModal.item.status || "Alumni HMPS-TI"}
                      onChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, status: val } })}
                      options={["Alumni HMPS-TI", "Pengurus Aktif", "Dosen Penanggung jawab"]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Peran Spesifik</label>
                    <input
                      type="text"
                      value={editModal.item.role || ""}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, role: e.target.value } })}
                      placeholder="Peran spesifik..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
                    />
                  </div>

                  {/* Foto Profil / Avatar */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">Foto Avatar Anggota / Alumni</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Sneakpeek Preview Bulat */}
                      {editModal.item?.avatar ? (
                        <div className="relative shrink-0 group">
                          <img
                            src={editModal.item.avatar}
                            alt="Sneakpeek Avatar"
                            className="h-12 w-12 rounded-full border-2 border-black bg-slate-900 object-cover shadow-[2px_2px_0px_0px_#000000]"
                          />
                          <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[7px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                            PREVIEW
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditModal({ ...editModal, item: { ...editModal.item, avatar: "" } })}
                            title="Hapus Avatar"
                            className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-bold shadow hover:bg-red-500 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="relative shrink-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 text-slate-400 font-mono text-xs">
                          {editModal.item?.name ? editModal.item.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}

                      <div className="flex-1 w-full">
                        {editAvatarUploadMode === "url" ? (
                          <input
                            key="member-edit-url-input"
                            type="text"
                            value={editModal.item?.avatar || ""}
                            onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, avatar: e.target.value } })}
                            placeholder="URL Foto Avatar (https://...)"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                          />
                        ) : (
                          <input
                            key="member-edit-file-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleDeviceFileUpload(file, (base64Url) => {
                                  setEditModal({ ...editModal, item: { ...editModal.item, avatar: base64Url } });
                                });
                              }
                            }}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                          />
                        )}
                      </div>

                      {/* Mode Buttons Sejajar di Kanan Field */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditAvatarUploadMode("url");
                            if (editModal.item?.avatar?.startsWith("data:image")) {
                              setEditModal({ ...editModal, item: { ...editModal.item, avatar: "" } });
                            }
                          }}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editAvatarUploadMode === "url"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <LinkSimple size={14} weight="bold" /> URL Gambar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditAvatarUploadMode("file")}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editAvatarUploadMode === "file"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <UploadSimple size={14} weight="bold" /> Upload Device
                        </button>
                      </div>
                    </div>
                  </div>

                  <SocialLinksInput
                    instagramUrl={editModal.item.instagram_url || ""}
                    onInstagramChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, instagram_url: val } })}
                    email={editModal.item.email || ""}
                    onEmailChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, email: val } })}
                    extraLinks={editModal.item.social_links || []}
                    onExtraLinksChange={(links) => setEditModal({ ...editModal, item: { ...editModal.item, social_links: links } })}
                  />

                  <Button variant="spotify" size="md" className="w-full" icon={<FloppyDisk size={16} weight="bold" />}>
                    Simpan Perubahan Anggota
                  </Button>
                </form>
              )}

              {editModal.type === "karya" && (
                <form onSubmit={handleUpdateProject} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Judul Proyek *</label>
                    <input
                      type="text"
                      required
                      value={editModal.item.title || ""}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, title: e.target.value } })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <CyberSelect
                        label="Kategori Karya"
                        value={editModal.item.category || "WEB APP"}
                        onChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, category: val } })}
                        options={["WEB APP", "MOBILE APP", "AI & ML", "IOT & EMBEDDED"]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Nama Pembuat *</label>
                      <input
                        type="text"
                        required
                        value={editModal.item.author_name || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, author_name: e.target.value } })}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">NIM Pembuat (Opsional)</label>
                      <input
                        type="text"
                        value={editModal.item.author_nim || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, author_nim: e.target.value } })}
                        placeholder="e.g. 220101010"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Dual Mode Gambar Cover & Sneakpeek Preview */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Gambar Cover Proyek</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Sneakpeek Preview Persegi Panjang */}
                      {editModal.item?.cover_image && (
                        <div className="relative shrink-0 group">
                          <img
                            src={editModal.item.cover_image}
                            alt="Sneakpeek Proyek"
                            className="h-12 w-24 rounded-xl border-2 border-black bg-slate-900 object-cover shadow-[2px_2px_0px_0px_#000000]"
                          />
                          <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 text-[7px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                            PREVIEW
                          </span>
                        </div>
                      )}

                      <div className="flex-1 w-full">
                        {editProjectUploadMode === "url" ? (
                          <input
                            key="project-edit-url-input"
                            type="text"
                            value={editModal.item.cover_image || ""}
                            onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, cover_image: e.target.value } })}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                          />
                        ) : (
                          <input
                            key="project-edit-file-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleDeviceFileUpload(file, (base64Url) => {
                                  setEditModal({ ...editModal, item: { ...editModal.item, cover_image: base64Url } });
                                });
                              }
                            }}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditProjectUploadMode("url");
                            if (editModal.item?.cover_image?.startsWith("data:image")) {
                              setEditModal({ ...editModal, item: { ...editModal.item, cover_image: "" } });
                            }
                          }}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editProjectUploadMode === "url"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <LinkSimple size={14} weight="bold" /> URL Gambar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditProjectUploadMode("file")}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editProjectUploadMode === "file"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <UploadSimple size={14} weight="bold" /> Upload Device
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Tech Stack (Dipisah Koma)</label>
                      <input
                        type="text"
                        value={
                          typeof editModal.item?.tech_stack === "string"
                            ? editModal.item.tech_stack
                            : Array.isArray(editModal.item?.tech_stack)
                            ? editModal.item.tech_stack.join(", ")
                            : ""
                        }
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, tech_stack: e.target.value } })}
                        placeholder="e.g. Next.js, Python, Tailwind"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Link</label>
                      <input
                        type="text"
                        value={editModal.item.github_url || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, github_url: e.target.value } })}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Demo Link</label>
                      <input
                        type="text"
                        value={editModal.item.demo_url || ""}
                        onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, demo_url: e.target.value } })}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Ringkasan Singkat Karya (untuk Card Katalog) */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Ringkasan Singkat Karya (Card) *</label>
                    <textarea
                      rows={3}
                      required
                      value={editModal.item.description || ""}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, description: e.target.value } })}
                      placeholder="Ringkasan singkat karya yang akan tampil pada kartu di katalog karya..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans"
                    />
                  </div>

                  {/* Isi Lengkap Penjelasan Karya (Format Blog) */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Isi Lengkap Penjelasan Karya (Format Blog) *</label>
                    <textarea
                      rows={12}
                      required
                      value={editModal.item.content || editModal.item.description || ""}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, content: e.target.value } })}
                      placeholder="Penjelasan lengkap inovasi, latar belakang, cara kerja, dan solusi yang dibangun ala blog..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans min-h-[260px]"
                    />
                  </div>

                  <Button variant="spotify" size="md" className="w-full" icon={<FloppyDisk size={16} weight="bold" />}>
                    Simpan Perubahan Karya
                  </Button>
                </form>
              )}

              {editModal.type === "galeri" && (
                <form onSubmit={handleUpdateGallery} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Judul Kegiatan *</label>
                    <input
                      type="text"
                      required
                      value={editModal.item.title || ""}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, title: e.target.value } })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <CyberSelect
                      label="Kategori Galeri"
                      value={editModal.item.category || "Makrab & Pelantikan"}
                      onChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, category: val } })}
                      options={["Makrab & Pelantikan", "Rapat Wajib", "Pertemuan", "Workshop", "Kompetisi", "Pengabdian"]}
                    />

                    <CyberDateTimePicker
                      label="Tanggal Kegiatan *"
                      value={editModal.item.event_date || ""}
                      onChange={(val) => setEditModal({ ...editModal, item: { ...editModal.item, event_date: val } })}
                      dateOnly
                    />
                  </div>

                  {/* Dual Mode Foto Galeri & Sneakpeek Preview */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Foto Galeri (URL / Device)</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Sneakpeek Preview Persegi Panjang */}
                      {editModal.item?.url && (
                        <div className="relative shrink-0 group">
                          <img
                            src={editModal.item.url}
                            alt="Sneakpeek Galeri"
                            className="h-12 w-24 rounded-xl border-2 border-black bg-slate-900 object-cover shadow-[2px_2px_0px_0px_#000000]"
                          />
                          <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 text-[7px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                            PREVIEW
                          </span>
                        </div>
                      )}

                      <div className="flex-1 w-full">
                        {editGalleryUploadMode === "url" ? (
                          <input
                            key="gallery-edit-url-input"
                            type="text"
                            value={editModal.item.url || ""}
                            onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, url: e.target.value } })}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
                          />
                        ) : (
                          <input
                            key="gallery-edit-file-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleDeviceFileUpload(file, (base64Url) => {
                                  setEditModal({ ...editModal, item: { ...editModal.item, url: base64Url } });
                                });
                              }
                            }}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditGalleryUploadMode("url");
                            if (editModal.item?.url?.startsWith("data:image")) {
                              setEditModal({ ...editModal, item: { ...editModal.item, url: "" } });
                            }
                          }}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editGalleryUploadMode === "url"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <LinkSimple size={14} weight="bold" /> URL Gambar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGalleryUploadMode("file")}
                          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            editGalleryUploadMode === "file"
                              ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                              : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <UploadSimple size={14} weight="bold" /> Upload Device
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">Deskripsi / Catatan Kegiatan *</label>
                    <textarea
                      rows={14}
                      value={editModal.item.description || ""}
                      onChange={(e) => setEditModal({ ...editModal, item: { ...editModal.item, description: e.target.value } })}
                      placeholder="Keterangan lengkap dokumentasi kegiatan..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans min-h-[320px]"
                    />
                  </div>

                  <Button variant="spotify" size="md" className="w-full" icon={<FloppyDisk size={16} weight="bold" />}>
                    Simpan Perubahan Galeri
                  </Button>
                </form>
              )}

              {/* Edit Program Kerja Form */}
              {editModal.type === "proker" && (
                <form onSubmit={handleUpdateProker} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Nama / Judul Program Kerja *
                    </label>
                    <input
                      type="text"
                      required
                      value={editModal.item.title || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, title: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <CyberSelect
                        label="Divisi Terkait *"
                        value={editModal.item.division_slug || "lpt"}
                        onChange={(val) =>
                          setEditModal({
                            ...editModal,
                            item: { ...editModal.item, division_slug: val },
                          })
                        }
                        options={[
                          { value: "bph", label: "BPH" },
                          { value: "psdm", label: "PSDM" },
                          { value: "lpt", label: "LPT" },
                          { value: "kwu", label: "KWU" },
                          { value: "medkominfo", label: "MEDKOMINFO" },
                          { value: "humas", label: "HUMAS" },
                        ]}
                        placeholder="Pilih Divisi..."
                      />
                    </div>

                    <div>
                      <CyberSelect
                        label="Status Pelaksanaan *"
                        value={editModal.item.status || "MENDATANG"}
                        onChange={(val) =>
                          setEditModal({
                            ...editModal,
                            item: { ...editModal.item, status: val },
                          })
                        }
                        options={[
                          { value: "MENDATANG", label: "Mendatang" },
                          { value: "BERJALAN", label: "Sedang Berjalan" },
                          { value: "SELESAI", label: "Selesai" },
                        ]}
                        placeholder="Pilih Status..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <CyberDateTimePicker
                        value={editModal.item.execution_date || ""}
                        onChange={(val) =>
                          setEditModal({
                            ...editModal,
                            item: { ...editModal.item, execution_date: val },
                          })
                        }
                        label="Jadwal Pelaksanaan *"
                        dateOnly={true}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Penanggung Jawab (PIC)
                      </label>
                      <input
                        type="text"
                        value={editModal.item.pic || ""}
                        onChange={(e) =>
                          setEditModal({
                            ...editModal,
                            item: { ...editModal.item, pic: e.target.value },
                          })
                        }
                        placeholder="e.g. Aditya Pratama"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Target Sasaran / Peserta
                      </label>
                      <input
                        type="text"
                        value={editModal.item.target_audience || ""}
                        onChange={(e) =>
                          setEditModal({
                            ...editModal,
                            item: { ...editModal.item, target_audience: e.target.value },
                          })
                        }
                        placeholder="e.g. Mahasiswa Baru TI 2026"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Anggaran / Estimasi Dana
                      </label>
                      <input
                        type="text"
                        value={editModal.item.budget || ""}
                        onChange={(e) =>
                          setEditModal({
                            ...editModal,
                            item: { ...editModal.item, budget: e.target.value },
                          })
                        }
                        placeholder="e.g. Rp 1.500.000"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Deskripsi & Tujuan Program Kerja *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={editModal.item.description || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          item: { ...editModal.item, description: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none leading-relaxed"
                    />
                  </div>

                  <Button
                    variant="spotify"
                    size="md"
                    className="w-full"
                    icon={<FloppyDisk size={16} weight="bold" />}
                  >
                    Simpan Perubahan Program Kerja
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

  );
};
