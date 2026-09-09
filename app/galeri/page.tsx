"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Lightbox, LightboxImage } from "@/components/ui/Lightbox";
import { fetchGalleryItems } from "@/services";
import { fallbackGalleryItems as fallbackGallery } from "@/constants";
import { GalleryItem } from "@/types";
import { GalleryHero, GalleryGrid } from "@/components/modules/galeri";

/**
 * Halaman Galeri & Dokumentasi Foto Kegiatan HMPSTI STMIK Widya Utama.
 * Mengorkestrasi data foto dokumentasi, filter kategori dinamis, dan modal lightbox.
 */
export default function GaleriPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<LightboxImage | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([...(fallbackGallery as GalleryItem[])]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchGalleryItems();
        if (data && data.length > 0) {
          setGalleryItems(data as GalleryItem[]);
        }
      } catch (err) {
        console.warn("Gagal memuat galeri terbaru, fallback digunakan:", err);
      }
    }
    loadData();
  }, []);

  const dynamicCategories = useMemo(() => {
    return [
      "Semua",
      ...Array.from(
        new Set(
          galleryItems
            .map((item) => (item.category || "").trim())
            .filter(Boolean)
        )
      ),
    ];
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return galleryItems.filter((item) => {
      const matchCategory =
        activeCategory === "Semua" ||
        (item.category &&
          item.category.trim().toLowerCase() === activeCategory.trim().toLowerCase());
      const matchQuery =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }, [galleryItems, activeCategory, searchQuery]);

  const handleSelectItem = useCallback((item: GalleryItem) => {
    setSelectedImage({
      title: item.title,
      category: item.category,
      date: item.event_date || (item as any).date || "2026",
      url: item.url,
      description: item.description,
    });
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner & Dynamic Category Filter Pills */}
      <GalleryHero
        categories={dynamicCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Grid Foto Dokumentasi Kegiatan */}
      <GalleryGrid items={filteredItems} onSelectItem={handleSelectItem} />

      {/* Lightbox Viewer Modal */}
      <Lightbox
        isOpen={!!selectedImage}
        onClose={handleCloseLightbox}
        image={selectedImage}
      />
    </div>
  );
}
