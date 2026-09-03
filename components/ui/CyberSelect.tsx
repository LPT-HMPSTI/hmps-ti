"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, Check } from "@phosphor-icons/react";

export interface CyberSelectOption {
  label: string;
  value: string;
}

/**
 * Dropdown pilihan berdesain neubrutalis-cyber dengan animasi Framer Motion.
 * Dropdown-nya dirender via React Portal langsung ke document.body agar tidak
 * terpotong oleh overflow parent.
 *
 * @param options     - Array opsi; bisa berupa string saja atau objek { label, value }.
 *                      String secara otomatis dinormalisasi menjadi { label: str, value: str }.
 * @param placeholder - Teks yang tampil saat belum ada nilai terpilih.
 */
interface CyberSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: (string | CyberSelectOption)[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export const CyberSelect: React.FC<CyberSelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = "Pilih Kategori...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 200,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const normalizedOptions: CyberSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find(
    (opt) => opt.value?.toLowerCase() === value?.toLowerCase()
  ) || {
    label: value || placeholder,
    value: value || "",
  };

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleScrollOrResize() {
      if (isOpen) {
        updateCoords();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <div className={`space-y-1 w-full ${className}`}>
      {label && (
        <label className="block text-xs font-mono text-slate-400 mb-1">{label}</label>
      )}

      {/* Double-Bezel Trigger Container */}
      <div
        ref={triggerRef}
        className="rounded-xl border border-white/10 bg-white/[0.02] p-0.5 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-[#1DB954]/40"
      >
        <div
          onClick={handleToggle}
          className="flex items-center justify-between rounded-[calc(0.75rem-2px)] bg-[#121520] p-3 text-xs text-white cursor-pointer hover:bg-[#181B28] transition-all duration-300 border border-white/5 font-mono select-none"
        >
          <span className="truncate font-bold text-white">
            {selectedOption.label || placeholder}
          </span>
          <CaretDown
            size={14}
            className={`text-[#1DB954] transition-transform duration-300 shrink-0 ml-1 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown Options via React Portal Attached to document.body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "fixed",
                  top: `${coords.top}px`,
                  left: `${coords.left}px`,
                  width: `${coords.width}px`,
                  overscrollBehavior: "contain",
                }}
                data-lenis-prevent
                className="z-[99999] rounded-xl border border-white/15 bg-[#0B0D14]/98 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-3xl space-y-1 max-h-60 overflow-y-auto overscroll-contain"
              >
                {normalizedOptions.map((opt) => {
                  const isSelected = value === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-mono font-bold cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#1DB954] text-black shadow-md"
                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check size={14} weight="bold" className="text-black shrink-0 ml-1" />}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
