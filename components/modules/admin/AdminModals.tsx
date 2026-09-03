"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleNotch, CheckCircle, WarningCircle, X, Trash } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";

export interface DeleteConfirmModalState {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
}

export interface AdminModalsProps {
  isProcessing: boolean;
  processingText: string;
  notification: string | null;
  deleteConfirmModal: DeleteConfirmModalState;
  onCloseDeleteModal: () => void;
}

/**
 * Kumpulan modal sistem backoffice admin:
 * - Loading overlay saat proses asynchronous (Supabase) berlangsung
 * - Floating notification toast saat data berhasil disimpan/dihapus
 * - Dialog konfirmasi hapus permanen bergaya neubrutalisme
 */
export const AdminModals: React.FC<AdminModalsProps> = ({
  isProcessing,
  processingText,
  notification,
  deleteConfirmModal,
  onCloseDeleteModal,
}) => {
  return (
    <>
      {/* Processing Loading Modal Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/15 bg-[#121520] space-y-4 shadow-2xl min-w-[280px]"
            >
              <CircleNotch size={44} className="text-[#1DB954] animate-spin" />
              <p className="text-xs font-mono font-extrabold text-white uppercase tracking-wider text-center">
                {processingText}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 rounded-lg border-2 border-black bg-[#1DB954] px-4 py-3 text-xs font-mono font-black text-black shadow-[4px_4px_0px_0px_#000000] -rotate-1 flex items-center gap-2.5"
          >
            <span className="h-2 w-2 rounded-full bg-black shrink-0" />
            <CheckCircle size={18} weight="bold" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal (Full Neubrutalism Style) */}
      <AnimatePresence>
        {deleteConfirmModal.isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              data-lenis-prevent
              className="w-full max-w-md rounded-2xl border-2 border-black bg-[#121520] p-6 space-y-5 shadow-[8px_8px_0px_0px_#000000]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <Badge variant="magenta" tilt="left" className="my-0 text-xs font-black">
                  PERINGATAN HAPUS DATA
                </Badge>
                <button
                  type="button"
                  onClick={onCloseDeleteModal}
                  className="p-1.5 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] hover:rotate-0 rotate-2 transition-all cursor-pointer"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              <div className="rounded-xl border-2 border-black bg-[#FF007F]/10 p-4 shadow-[3px_3px_0px_0px_#000000] flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#FF007F] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] shrink-0 -rotate-3">
                  <WarningCircle size={22} weight="bold" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                    Apakah Anda Yakin?
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Data{" "}
                    <strong className="text-[#FF007F] font-mono font-black">
                      &quot;{deleteConfirmModal.title}&quot;
                    </strong>{" "}
                    akan dihapus secara permanen dari sistem.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={onCloseDeleteModal}
                  className="rounded-md px-4 py-2 text-xs font-mono font-black uppercase tracking-wider bg-[#2A2F45] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] rotate-1 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={deleteConfirmModal.onConfirm}
                  className="rounded-md px-4.5 py-2 text-xs font-mono font-black uppercase tracking-wider bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash size={15} weight="bold" />
                  <span>Hapus Permanen</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
