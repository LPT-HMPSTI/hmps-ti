"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, CaretRight, X, Plus, Minus } from "@phosphor-icons/react";
import { formatDateIndonesian, parseAnyDate } from "@/lib/utils/dateParser";
import { Badge } from "@/components/ui/Badge";

interface CyberDateTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  dateOnly?: boolean;
}

export const CyberDateTimePicker: React.FC<CyberDateTimePickerProps> = ({
  value,
  onChange,
  label = "Tanggal & Waktu Event *",
  dateOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const parsedInitialDate = value ? parseAnyDate(value) || new Date() : new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(parsedInitialDate);
  const [viewMonth, setViewMonth] = useState<number>(parsedInitialDate.getMonth());
  const [viewYear, setViewYear] = useState<number>(parsedInitialDate.getFullYear());
  const [selectedHour, setSelectedHour] = useState<number>(parsedInitialDate.getHours());
  const [selectedMinute, setSelectedMinute] = useState<number>(parsedInitialDate.getMinutes());

  useEffect(() => {
    if (value) {
      const d = parseAnyDate(value);
      if (d && !isNaN(d.getTime())) {
        setSelectedDate(d);
        setViewMonth(d.getMonth());
        setViewYear(d.getFullYear());
        setSelectedHour(d.getHours());
        setSelectedMinute(d.getMinutes());
      }
    }
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const monthNamesID = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const daysOfWeekID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const presetTimes = [
    { label: "08:00", h: 8, m: 0 },
    { label: "10:00", h: 10, m: 0 },
    { label: "13:00", h: 13, m: 0 },
    { label: "15:30", h: 15, m: 30 },
    { label: "19:00", h: 19, m: 0 },
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    const newDate = new Date(viewYear, viewMonth, dayNum, selectedHour, selectedMinute);
    setSelectedDate(newDate);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    const finalDate = dateOnly
      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      : new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedHour,
          selectedMinute
        );
    onChange(finalDate.toISOString());
    setIsOpen(false);
  };

  const handleSetToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date();
    setSelectedDate(now);
    setViewMonth(now.getMonth());
    setViewYear(now.getFullYear());
    setSelectedHour(now.getHours());
    setSelectedMinute(now.getMinutes());
  };

  const formattedDisplay = value
    ? dateOnly
      ? formatDateIndonesian(value)
      : `${formatDateIndonesian(value)} • ${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")} WIB`
    : dateOnly
    ? "Pilih Tanggal Kegiatan..."
    : "Pilih Tanggal & Waktu Event...";

  return (
    <div className="space-y-1 w-full">
      {/* Normal Form Input Label */}
      {label && (
        <label className="block text-xs font-mono text-slate-400 mb-1">
          {label}
        </label>
      )}

      {/* Double-Bezel Trigger Container (Event Yellow Cyber Theme) */}
      <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/[0.03] p-0.5 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-yellow-400/60">
        <div
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between rounded-[calc(0.75rem-2px)] bg-[#121520] p-3 text-xs text-white cursor-pointer hover:bg-[#181B28] transition-all duration-300 border border-white/5 font-mono select-none group"
        >
          <span className="truncate font-bold text-white min-w-0">
            {formattedDisplay}
          </span>
          <span className="text-[10px] font-mono font-bold text-yellow-400 shrink-0 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30 ml-2">
            PILIH ▼
          </span>
        </div>
      </div>

      {/* Screen Centered Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
              className="relative w-full max-w-sm rounded-3xl border border-yellow-400/30 bg-[#0B0D14]/98 p-2 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl space-y-3 overscroll-contain"
            >
              {/* Header Close with Animated Neobrutalism Badge & Close Button */}
              <div className="flex items-center justify-between px-3 pt-2">
                <Badge variant="yellow" tilt="left" className="my-0 py-0.5 text-[10px]">
                  {dateOnly ? "KALENDER TANGGAL GALERI" : "CALENDAR AGENDA EVENT"}
                </Badge>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
                  title="Tutup Kalender"
                >
                  <X size={14} weight="bold" />
                </button>
              </div>

              {/* Inner Core Container */}
              <div className="rounded-[calc(1.5rem-4px)] bg-[#121520] p-4 space-y-3.5 border border-white/5">
                {/* Header: Month & Year Selector + Animated Neobrutalism Buttons */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">
                    {monthNamesID[viewMonth]} {viewYear}
                  </h4>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="h-7 w-7 rounded-md border-2 border-black bg-[#FFD700] text-black shadow-[2px_2px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer flex items-center justify-center font-black shrink-0"
                      title="Bulan Sebelumnya"
                    >
                      <CaretLeft size={14} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="h-7 w-7 rounded-md border-2 border-black bg-[#FFD700] text-black shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer flex items-center justify-center font-black shrink-0"
                      title="Bulan Selanjutnya"
                    >
                      <CaretRight size={14} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Day Header Row */}
                <div className="grid grid-cols-7 text-center font-mono text-[11px] font-bold text-slate-400">
                  {daysOfWeekID.map((day) => (
                    <div key={day} className="py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 w-8" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const isSelected =
                      selectedDate.getDate() === dayNum &&
                      selectedDate.getMonth() === viewMonth &&
                      selectedDate.getFullYear() === viewYear;

                    const isToday =
                      new Date().getDate() === dayNum &&
                      new Date().getMonth() === viewMonth &&
                      new Date().getFullYear() === viewYear;

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => handleSelectDay(dayNum)}
                        className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer mx-auto ${
                          isSelected
                            ? "bg-yellow-400 text-black font-black shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105"
                            : isToday
                            ? "border border-yellow-400/60 text-yellow-400 bg-yellow-400/10"
                            : "text-slate-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Cyber Time Picker Controls (Hidden when dateOnly is true) */}
                {!dateOnly && (
                  <div className="border-t border-white/10 pt-3 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <Badge variant="yellow" tilt="left" noDot className="my-0 py-0.5 text-[10px]">
                        WAKTU PELAKSANAAN
                      </Badge>

                      {/* Quick Preset Time Pills */}
                      <div className="flex items-center gap-1">
                        {presetTimes.map((pt) => {
                          const isActive = selectedHour === pt.h && selectedMinute === pt.m;
                          return (
                            <button
                              key={pt.label}
                              type="button"
                              onClick={() => {
                                setSelectedHour(pt.h);
                                setSelectedMinute(pt.m);
                              }}
                              className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#FFD700] text-black font-black shadow-sm"
                                  : "bg-white/[0.05] text-slate-300 hover:bg-white/15 border border-white/10"
                              }`}
                            >
                              {pt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Compact Cyber Time Stepper Display */}
                    <div className="flex items-center justify-center gap-3 p-2.5 rounded-2xl bg-[#0B0D14] border border-yellow-400/20 shadow-inner">
                      {/* Jam Stepper */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedHour((prev) => (prev === 0 ? 23 : prev - 1))}
                          className="h-7 w-7 rounded-lg border border-white/10 bg-white/[0.05] text-white hover:bg-yellow-400 hover:text-black font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Kurangi Jam"
                        >
                          <Minus size={12} weight="bold" />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-mono text-yellow-400 font-extrabold uppercase">JAM</span>
                          <span className="text-sm font-mono font-black text-white px-2 py-0.5 bg-white/[0.06] rounded-md border border-white/10 min-w-[34px] text-center">
                            {String(selectedHour).padStart(2, "0")}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedHour((prev) => (prev === 23 ? 0 : prev + 1))}
                          className="h-7 w-7 rounded-lg border border-white/10 bg-white/[0.05] text-white hover:bg-yellow-400 hover:text-black font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Tambah Jam"
                        >
                          <Plus size={12} weight="bold" />
                        </button>
                      </div>

                      <span className="text-base font-mono font-black text-yellow-400 animate-pulse">:</span>

                      {/* Menit Stepper */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedMinute((prev) => (prev === 0 ? 55 : (prev - 5 + 60) % 60))}
                          className="h-7 w-7 rounded-lg border border-white/10 bg-white/[0.05] text-white hover:bg-cyan-400 hover:text-black font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Kurangi Menit"
                        >
                          <Minus size={12} weight="bold" />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-mono text-cyan-400 font-extrabold uppercase">MENIT</span>
                          <span className="text-sm font-mono font-black text-white px-2 py-0.5 bg-white/[0.06] rounded-md border border-white/10 min-w-[34px] text-center">
                            {String(selectedMinute).padStart(2, "0")}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedMinute((prev) => (prev === 55 ? 0 : (prev + 5) % 60))}
                          className="h-7 w-7 rounded-lg border border-white/10 bg-white/[0.05] text-white hover:bg-cyan-400 hover:text-black font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Tambah Menit"
                        >
                          <Plus size={12} weight="bold" />
                        </button>
                      </div>

                      {/* WIB Label styled as Neobrutalism Badge without dot */}
                      <Badge variant="spotify" tilt="right" noDot className="my-0 py-0.5 text-[9px] font-mono ml-1">
                        WIB
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Footer Action Buttons with Full Neobrutalism Motion (No Dot on Simpan) */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={handleSetToday}
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono font-black uppercase tracking-wider bg-[#00F2FE] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-black shrink-0 animate-ping" />
                    Hari Ini
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-md px-3.5 py-1.5 text-xs font-mono font-black uppercase tracking-wider bg-[#2A2F45] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] rotate-1 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="rounded-md px-4 py-1.5 text-xs font-mono font-black uppercase tracking-wider bg-[#FFD700] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
