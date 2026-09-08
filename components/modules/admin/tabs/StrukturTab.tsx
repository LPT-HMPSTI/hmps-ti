"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  MagnifyingGlass,
  Pencil,
  Trash,
  LinkSimple,
  UploadSimple,
  User,
} from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CyberSelect } from "@/components/ui/CyberSelect";
import { SocialLinksInput } from "@/components/ui/SocialIcon";
import { AdminPagination } from "../AdminPagination";
import {
  getDivisionBadgeProps,
  renderSocialIconsList,
} from "../adminUtils";

export interface NewDivMemberState {
  name: string;
  nim: string;
  division_slug: string;
  role: string;
  avatar: string;
  email: string;
  instagram_url: string;
  social_links: string[];
  order_index: number;
}

export interface StrukturTabProps {
  newDivMember: NewDivMemberState;
  onNewDivMemberChange: (member: NewDivMemberState) => void;
  avatarUploadMode: "url" | "file";
  onAvatarUploadModeChange: (mode: "url" | "file") => void;
  onDeviceFileUpload: (file: File, setter: (url: string) => void) => void;
  onCreateDivMember: (e: React.FormEvent) => void;
  divisionMembers: any[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onOpenEditModal: (member: any) => void;
  onDeleteMember: (member: any) => void;
}

/**
 * Tab Struktur Organisasi: Formulir penambahan anggota BPH dan divisi dengan opsi jabatan,
 * preview avatar, input tautan media sosial, serta grid kartu pengurus divisi aktif.
 */
export const StrukturTab: React.FC<StrukturTabProps> = ({
  newDivMember,
  onNewDivMemberChange,
  avatarUploadMode,
  onAvatarUploadModeChange,
  onDeviceFileUpload,
  onCreateDivMember,
  divisionMembers,
  searchQuery,
  onSearchChange,
  onOpenEditModal,
  onDeleteMember,
}) => {
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset ke halaman 1 saat pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(divisionMembers.length / ITEMS_PER_PAGE) || 1;

  // Pastikan currentPage tidak melebihi totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return divisionMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [divisionMembers, currentPage]);

  return (
    <div className="space-y-6">
      <GlassCard glowColor="yellow" className="p-6 sm:p-7 space-y-5 sm:space-y-6">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-3.5 mb-2">
          Tambah Pengurus BPH / Divisi
        </h3>
        <form onSubmit={onCreateDivMember} className="space-y-4 sm:space-y-4.5">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-4.5 items-center">
            <input
              type="text"
              required
              value={newDivMember.name}
              onChange={(e) =>
                onNewDivMemberChange({ ...newDivMember, name: e.target.value })
              }
              placeholder="Nama Lengkap *"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
            />
            <input
              type="text"
              required
              value={newDivMember.nim}
              onChange={(e) =>
                onNewDivMemberChange({ ...newDivMember, nim: e.target.value })
              }
              placeholder="NIM *"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
            />
            <CyberSelect
              value={newDivMember.division_slug}
              onChange={(val) =>
                onNewDivMemberChange({ ...newDivMember, division_slug: val })
              }
              options={[
                { label: "BPH", value: "bph" },
                { label: "PSDM", value: "psdm" },
                { label: "LPT", value: "lpt" },
                { label: "MEDKOMINFO", value: "medkominfo" },
                { label: "HUMAS", value: "humas" },
                { label: "KWU", value: "kwu" },
              ]}
              placeholder="Pilih Divisi..."
            />
            <input
              type="text"
              value={newDivMember.role}
              onChange={(e) =>
                onNewDivMemberChange({ ...newDivMember, role: e.target.value })
              }
              placeholder="Jabatan (e.g. Kadiv LPT)"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
            />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Urutan Tampil</label>
              <input
                type="number"
                min={1}
                max={999}
                value={newDivMember.order_index || ""}
                onChange={(e) =>
                  onNewDivMemberChange({ ...newDivMember, order_index: Number(e.target.value) })
                }
                placeholder="1, 2, 3..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono text-center"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Foto Avatar Pengurus
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Sneakpeek Preview Bulat */}
              {newDivMember.avatar ? (
                <div className="relative shrink-0 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={newDivMember.avatar}
                    alt="Sneakpeek Avatar"
                    className="h-12 w-12 rounded-full border-2 border-black bg-slate-900 object-cover shadow-[2px_2px_0px_0px_#000000]"
                  />
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[7px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                    PREVIEW
                  </span>
                  <button
                    type="button"
                    onClick={() => onNewDivMemberChange({ ...newDivMember, avatar: "" })}
                    title="Hapus Avatar"
                    className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-bold shadow hover:bg-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="relative shrink-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 text-slate-400">
                  {newDivMember.name ? (
                    <span className="font-mono text-sm font-bold text-[#1DB954]">
                      {newDivMember.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User size={18} className="text-slate-500" />
                  )}
                </div>
              )}

              <div className="flex-1 w-full">
                {avatarUploadMode === "url" ? (
                  <input
                    key="div-create-url-input"
                    type="text"
                    value={newDivMember.avatar || ""}
                    onChange={(e) =>
                      onNewDivMemberChange({ ...newDivMember, avatar: e.target.value })
                    }
                    placeholder="URL Foto Avatar (e.g. https://...)"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                  />
                ) : (
                  <input
                    key="div-create-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onDeviceFileUpload(file, (base64Url) => {
                          onNewDivMemberChange({ ...newDivMember, avatar: base64Url });
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                  />
                )}
              </div>

              {/* Mode Buttons Sejajar Kolom Gambar */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onAvatarUploadModeChange("url");
                    if (newDivMember.avatar?.startsWith("data:image")) {
                      onNewDivMemberChange({ ...newDivMember, avatar: "" });
                    }
                  }}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    avatarUploadMode === "url"
                      ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LinkSimple size={14} weight="bold" /> URL Gambar
                </button>
                <button
                  type="button"
                  onClick={() => onAvatarUploadModeChange("file")}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    avatarUploadMode === "file"
                      ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <UploadSimple size={14} weight="bold" /> Ambil Dari Device
                </button>
              </div>
            </div>
          </div>

          {/* Social Media Links Section */}
          <SocialLinksInput
            instagramUrl={newDivMember.instagram_url || ""}
            onInstagramChange={(val) =>
              onNewDivMemberChange({ ...newDivMember, instagram_url: val })
            }
            email={newDivMember.email || ""}
            onEmailChange={(val) =>
              onNewDivMemberChange({ ...newDivMember, email: val })
            }
            extraLinks={newDivMember.social_links || []}
            onExtraLinksChange={(links) =>
              onNewDivMemberChange({ ...newDivMember, social_links: links })
            }
          />

          {/* Dedicated Bottom Left Row for Submit Button */}
          <div className="flex justify-start pt-4 mt-5 border-t border-white/10">
            <Button
              variant="spotify"
              size="md"
              icon={<Plus size={16} weight="bold" className="shrink-0" />}
            >
              Tambah Pengurus
            </Button>
          </div>
        </form>
      </GlassCard>

      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white">
            Daftar Pengurus Divisi ({divisionMembers.length})
          </h3>

          {/* Search Bar Component */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari pengurus, NIM, atau jabatan..."
              className="w-full rounded-xl border-2 border-black bg-[#121520] py-2 pl-9.5 pr-8 text-xs text-white placeholder-slate-400 font-mono shadow-[2px_2px_0px_0px_#000000] focus:border-[#1DB954] focus:outline-none"
            />
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(29,185,84,0.4)]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {paginatedMembers.map((m) => (
            <GlassCard
              key={m.id}
              glowColor="yellow"
              className="p-5 sm:p-6 flex flex-col justify-between gap-4 sm:gap-4.5 min-h-[160px]"
            >
              {/* Row 1: Header Badge & Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={getDivisionBadgeProps(m.division_slug).variant}
                  tilt="left"
                  noDot
                  className="my-0 py-0.5 text-[10px]"
                >
                  {getDivisionBadgeProps(m.division_slug).label}
                </Badge>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenEditModal(m)}
                    title="Edit Pengurus"
                    className="p-2 rounded-md border-2 border-black bg-[#FFD700] text-black shadow-[2px_2px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Pencil size={14} weight="bold" />
                  </button>
                  <button
                    onClick={() => onDeleteMember(m)}
                    title="Hapus Pengurus"
                    className="p-2 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Trash size={14} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Row 2: Avatar + Name & Jabatan */}
              <div className="flex items-center gap-4 min-w-0 py-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/20 shrink-0 shadow-md"
                />
                <div className="min-w-0 space-y-1">
                  <h4 className="text-sm font-bold text-white truncate">{m.name}</h4>
                  <p className="text-xs text-[#1DB954] font-mono font-semibold truncate">
                    {m.role || "Anggota Pengurus"}
                  </p>
                  {renderSocialIconsList(m)}
                </div>
              </div>

              {/* Row 3: NIM & Status Footer Row */}
              <div className="text-[11px] font-mono text-slate-400 border-t border-white/10 pt-3 mt-1 flex items-center justify-between">
                <span>NIM: {m.nim || "-"}</span>
                <span className="text-[#1DB954] font-medium">Pengurus Aktif</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Neubrutalist Pagination Bar */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={divisionMembers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="pengurus divisi"
        />
      </div>
    </div>
  );
};
