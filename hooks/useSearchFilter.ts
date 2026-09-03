"use client";

import { useState, useMemo } from "react";

export interface UseSearchFilterConfig<T> {
  /**
   * Field-field properti objek yang akan dicocokkan dengan teks pencarian pengguna.
   */
  searchFields: (keyof T)[];
  /**
   * Field kategori utama untuk penyaringan berdasarkan tab atau pill filter.
   */
  categoryField?: keyof T;
  /**
   * Kategori default saat inisialisasi (biasanya "SEMUA" atau "Semua").
   */
  defaultCategory?: string;
  /**
   * Value kategori yang menandakan tidak ada filter kategori yang aktif (menampilkan semua).
   * Default: "SEMUA".
   */
  allCategoryValue?: string;
}

export interface UseSearchFilterReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredItems: T[];
  totalCount: number;
  filteredCount: number;
  resetFilters: () => void;
}

/**
 * Hook serbaguna untuk penyaringan data (kategori dan pencarian kata kunci).
 * Digunakan pada halaman Berita, Showcase Karya, Galeri Kegiatan, dan Direktori Keanggotaan.
 *
 * @param items Array data mentah yang ingin difilter
 * @param config Konfigurasi field pencarian dan kategori
 */
export function useSearchFilter<T>(
  items: T[],
  config: UseSearchFilterConfig<T>
): UseSearchFilterReturn<T> {
  const {
    searchFields,
    categoryField,
    defaultCategory = "SEMUA",
    allCategoryValue = "SEMUA",
  } = config;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];

    return items.filter((item) => {
      // 1. Penyaringan Kategori
      if (categoryField && selectedCategory) {
        const isAll =
          selectedCategory.toUpperCase() === allCategoryValue.toUpperCase() ||
          selectedCategory === "ALL" ||
          selectedCategory === "Semua";

        if (!isAll) {
          const itemCat = String(item[categoryField] || "").trim().toLowerCase();
          const targetCat = selectedCategory.trim().toLowerCase();
          if (itemCat !== targetCat) {
            return false;
          }
        }
      }

      // 2. Penyaringan Pencarian Teks
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesAnyField = searchFields.some((field) => {
          const val = item[field];
          if (val === undefined || val === null) return false;

          // Jika field berupa array (seperti tech_stack: string[])
          if (Array.isArray(val)) {
            return val.some((subVal) =>
              String(subVal).toLowerCase().includes(query)
            );
          }

          return String(val).toLowerCase().includes(query);
        });

        if (!matchesAnyField) return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedCategory, categoryField, allCategoryValue, searchFields]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(defaultCategory);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredItems,
    totalCount: Array.isArray(items) ? items.length : 0,
    filteredCount: filteredItems.length,
    resetFilters,
  };
}
