"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface TypewriterVisionTextProps {
  text: string;
}

/**
 * Efek teks mesin ketik (*typewriter*) berulang otomatis untuk pernyataan visi organisasi.
 */
export const TypewriterVisionText: React.FC<TypewriterVisionTextProps> = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!text) return;

    let index = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    function typeLoop() {
      if (!isDeleting) {
        // Mengetik maju
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
          timeoutId = setTimeout(typeLoop, 38);
        } else {
          // Berhenti 3 detik saat kalimat lengkap
          isDeleting = true;
          timeoutId = setTimeout(typeLoop, 3000);
        }
      } else {
        // Menghapus mundur
        if (index >= 0) {
          setDisplayText(text.slice(0, index));
          index--;
          timeoutId = setTimeout(typeLoop, 20);
        } else {
          // Jeda 0.5 detik saat kosong sebelum mengetik ulang
          isDeleting = false;
          index = 0;
          timeoutId = setTimeout(typeLoop, 500);
        }
      }
    }

    // Jalankan perulangan rekursif
    typeLoop();

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <h2 className="text-lg sm:text-2xl lg:text-[26px] font-extrabold text-white leading-relaxed sm:leading-[1.4] tracking-tight font-sans selection:bg-[#1DB954] selection:text-black relative z-10 min-h-[90px] sm:min-h-[120px] my-2 text-center max-w-2xl mx-auto">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        className="inline-block w-2 sm:w-2.5 h-5 sm:h-7 ml-1.5 bg-[#1DB954] align-middle shadow-[0_0_10px_#1DB954]"
      />
    </h2>
  );
};
