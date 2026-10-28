"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface LinkifiedTextProps {
  text: string;
  className?: string;
  showIcon?: boolean;
}

interface TextPart {
  type: "text" | "link";
  content?: string;
  label?: string;
  href?: string;
}

/**
 * Memecah string teks menjadi token teks dan link (URL langsung maupun format markdown [teks](url)).
 * Secara cerdas membersihkan tanda baca di ujung URL agar link tidak rusak.
 */
function parseLinks(text: string): TextPart[] {
  if (!text) return [];

  // Regex menangani:
  // 1. Markdown link: [Teks Tautan](https://...)
  // 2. Raw URL: http://..., https://..., atau www....
  const regex =
    /\[([^\]]+)\]\(((?:https?:\/\/|www\.)[^\s)]+)\)|((?:https?:\/\/|www\.)[^\s]+)/gi;

  const parts: TextPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Tambahkan teks biasa sebelum link
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    if (match[1] && match[2]) {
      // 1. Kasus Markdown Link: [label](url)
      let href = match[2].trim();
      if (href.toLowerCase().startsWith("www.")) {
        href = "https://" + href;
      }
      parts.push({
        type: "link",
        label: match[1],
        href,
      });
    } else if (match[3]) {
      // 2. Kasus Raw URL
      let rawUrl = match[3];
      let trailing = "";

      // Bersihkan tanda baca trailing yang sering tidak sengaja ikut terketik (misal: "kunjungi https://swu.ac.id.")
      const trailingPunctuation = rawUrl.match(/[.,;:!?)]+$/);
      if (trailingPunctuation) {
        trailing = trailingPunctuation[0];
        rawUrl = rawUrl.slice(0, -trailing.length);
      }

      let href = rawUrl;
      if (href.toLowerCase().startsWith("www.")) {
        href = "https://" + href;
      }

      parts.push({
        type: "link",
        label: rawUrl,
        href,
      });

      if (trailing) {
        parts.push({
          type: "text",
          content: trailing,
        });
      }
    }

    lastIndex = regex.lastIndex;
  }

  // Sisa teks setelah match terakhir
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return parts;
}

/**
 * Komponen untuk merender teks dengan auto-hyperlink yang aman dan interaktif.
 */
export const LinkifiedText: React.FC<LinkifiedTextProps> = ({
  text,
  className = "",
  showIcon = true,
}) => {
  if (!text) return null;

  const parts = parseLinks(text);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.type === "link" && part.href) {
          return (
            <a
              key={idx}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#1DB954] underline decoration-[#1DB954]/50 underline-offset-4 transition-all hover:text-[#1ed760] hover:decoration-[#1DB954] hover:brightness-110 break-all cursor-pointer"
              onClick={(e) => e.stopPropagation()}
              title={`Buka tautan: ${part.href}`}
            >
              <span>{part.label}</span>
              {showIcon && (
                <ExternalLink
                  size={12}
                  className="inline-block shrink-0 opacity-80"
                  aria-hidden="true"
                />
              )}
            </a>
          );
        }
        return <React.Fragment key={idx}>{part.content}</React.Fragment>;
      })}
    </span>
  );
};
