"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Pencil,
  Trash,
  ShieldStar,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import {
  AdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/services/adminUsers.service";

export interface AdminUsersTabProps {
  adminUsersList: AdminUser[];
  currentUserId?: string;
  onRefresh: () => void;
  onNotify: (msg: string) => void;
}

const EMPTY_FORM = {
  username: "",
  password: "",
  keterangan: "",
  role: "admin" as "superadmin" | "admin",
};

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  adminUsersList,
  currentUserId,
  onRefresh,
  onNotify,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    keterangan: string;
    role: "superadmin" | "admin";
    is_active: boolean;
    password: string;
  }>({ keterangan: "", role: "admin", is_active: true, password: "" });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      onNotify("Username dan kata sandi wajib diisi.");
      return;
    }
    setIsCreating(true);
    const result = await createAdminUser(form);
    setIsCreating(false);
    if (result.success) {
      onNotify("User admin berhasil ditambahkan.");
      setForm(EMPTY_FORM);
      onRefresh();
    } else {
      onNotify(`Gagal: ${result.error}`);
    }
  };

  const openEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setEditForm({
      keterangan: user.keterangan || "",
      role: user.role,
      is_active: user.is_active,
      password: "",
    });
    setShowEditPassword(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setIsSavingEdit(true);
    const result = await updateAdminUser(editingId, {
      keterangan: editForm.keterangan,
      role: editForm.role,
      is_active: editForm.is_active,
      password: editForm.password || undefined,
    });
    setIsSavingEdit(false);
    if (result.success) {
      onNotify("User berhasil diperbarui.");
      setEditingId(null);
      onRefresh();
    } else {
      onNotify(`Gagal: ${result.error}`);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.role === "superadmin") {
      onNotify("Super Admin tidak bisa dihapus.");
      return;
    }
    if (user.id === currentUserId) {
      onNotify("Tidak bisa menghapus akun yang sedang aktif.");
      return;
    }
    setDeletingId(user.id);
    const result = await deleteAdminUser(user.id);
    setDeletingId(null);
    if (result.success) {
      onNotify("User berhasil dihapus.");
      onRefresh();
    } else {
      onNotify(`Gagal: ${result.error}`);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-[#1DB954] focus:outline-none font-mono";

  const labelClass = "text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <Badge variant="spotify" tilt="left">
            MANAJEMEN AKSES
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola User Admin
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Tambah, edit, atau nonaktifkan akun admin. Super Admin tidak dapat dihapus.
          </p>
        </div>
        <Badge variant="yellow" tilt="right">
          {adminUsersList.length} USER TERDAFTAR
        </Badge>
      </div>

      {/* FORM TAMBAH USER BARU */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-[#121520] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center gap-2 mb-5">
          <UserPlus size={18} className="text-[#1DB954]" />
          <span className="text-sm font-black text-white tracking-tight">Tambah Admin Baru</span>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="space-y-1.5">
            <label className={labelClass}>Username</label>
            <input
              className={inputClass}
              placeholder="contoh: budi.psdm"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Kata Sandi</label>
            <div className="relative">
              <input
                className={`${inputClass} pr-10`}
                type={showNewPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showNewPassword ? <EyeSlash size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Keterangan Admin</label>
            <input
              className={inputClass}
              placeholder="contoh: Admin Divisi PSDM"
              value={form.keterangan}
              onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Role</label>
            <div className="flex items-end gap-2">
              <select
                className={`${inputClass} flex-1`}
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "superadmin" }))}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
              <button
                type="submit"
                disabled={isCreating}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1DB954] text-black text-xs font-mono font-black hover:bg-[#1ed760] transition-colors disabled:opacity-60 cursor-pointer"
              >
                <UserPlus size={14} weight="bold" />
                <span>{isCreating ? "Menyimpan..." : "Tambah"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* DAFTAR USER */}
      <div className="space-y-3">
        {adminUsersList.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            Belum ada user admin terdaftar.
          </div>
        ) : (
          adminUsersList.map((user) => {
            const isEditing = editingId === user.id;
            const isCurrentUser = user.id === currentUserId;
            const isSuperAdmin = user.role === "superadmin";

            return (
              <div
                key={user.id}
                className={`relative overflow-hidden rounded-2xl border-2 bg-[#121520] transition-all duration-200 ${
                  isEditing
                    ? "border-[#1DB954] shadow-[4px_4px_0px_0px_#1DB954]"
                    : "border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#1DB954]/50"
                }`}
              >
                {/* USER INFO ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-2xl border-2 border-black flex items-center justify-center shrink-0 ${
                        isSuperAdmin ? "bg-[#FFD700]" : "bg-[#1DB954]"
                      }`}
                    >
                      {isSuperAdmin ? (
                        <ShieldStar size={20} weight="fill" className="text-black" />
                      ) : (
                        <Shield size={20} weight="fill" className="text-black" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-white font-mono">
                          @{user.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-mono font-bold text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded-full">
                            AKUN ANDA
                          </span>
                        )}
                        <Badge
                          variant={isSuperAdmin ? "yellow" : "spotify"}
                          noDot
                        >
                          {isSuperAdmin ? "SUPER ADMIN" : "ADMIN"}
                        </Badge>
                        {user.is_active ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                            <CheckCircle size={12} weight="fill" /> Aktif
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-red-400">
                            <XCircle size={12} weight="fill" /> Nonaktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        {user.keterangan || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => openEdit(user)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:border-[#1DB954]/50 transition-all text-xs font-mono font-bold cursor-pointer"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </button>
                        {!isSuperAdmin && !isCurrentUser && (
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={deletingId === user.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15 hover:border-red-400 transition-all text-xs font-mono font-bold cursor-pointer disabled:opacity-50"
                          >
                            <Trash size={13} />
                            <span>{deletingId === user.id ? "..." : "Hapus"}</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={isSavingEdit}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1DB954] text-black text-xs font-mono font-black hover:bg-[#1ed760] transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {isSavingEdit ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white transition-all text-xs font-mono font-bold cursor-pointer"
                        >
                          Batal
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* EDIT FORM EXPANDED */}
                {isEditing && (
                  <div className="border-t border-white/10 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 bg-white/[0.02]">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Keterangan Admin</label>
                      <input
                        className={inputClass}
                        placeholder="Divisi / jabatan admin"
                        value={editForm.keterangan}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, keterangan: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Role</label>
                      <select
                        className={inputClass}
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, role: e.target.value as "admin" | "superadmin" }))
                        }
                        disabled={isSuperAdmin}
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Ganti Kata Sandi</label>
                      <div className="relative">
                        <input
                          className={`${inputClass} pr-10`}
                          type={showEditPassword ? "text" : "password"}
                          placeholder="Kosongkan jika tidak diganti"
                          value={editForm.password}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, password: e.target.value }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowEditPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showEditPassword ? <EyeSlash size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Status Akun</label>
                      <select
                        className={inputClass}
                        value={editForm.is_active ? "1" : "0"}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, is_active: e.target.value === "1" }))
                        }
                        disabled={isCurrentUser}
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
