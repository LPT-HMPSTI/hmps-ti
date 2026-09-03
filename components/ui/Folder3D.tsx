"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SocialIcon } from "@/components/ui/SocialIcon";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DivisionMember {
  id: string;
  name: string;
  role: string;
  nim: string;
  avatar: string;
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  email?: string;
  social_links?: string[];
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

// --- MEMBER CARD INSIDE 3D FOLDER ---

interface MemberCardProps {
  image: string;
  title: string;
  role: string;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
}

const MemberCard = forwardRef<HTMLDivElement, MemberCardProps>(
  ({ image, title, role, delay, isVisible, index, totalCount, onClick, isSelected }, ref) => {
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
    
    const rotation = factor * 26; 
    const translationX = factor * 85; 
    const translationY = Math.abs(factor) * 12;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-20 h-28 cursor-pointer group/card",
          isSelected && "opacity-0",
        )}
        style={{
          transform: isVisible
            ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 10 + index,
          left: "-40px",
          top: "-56px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div className={cn(
          "w-full h-full rounded-xl overflow-hidden shadow-2xl bg-slate-900 border border-white/20 relative",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover/card:-translate-y-6 group-hover/card:shadow-2xl group-hover/card:shadow-[#1DB954]/50 group-hover/card:ring-2 group-hover/card:ring-[#1DB954] group-hover/card:scale-125"
        )}>
          <img 
            src={image || PLACEHOLDER_IMAGE} 
            alt={title} 
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-1.5 left-1.5 right-1.5">
            <p className="text-[9px] font-black uppercase tracking-tighter text-white truncate drop-shadow-md leading-none">
              {title}
            </p>
            <p className="text-[7.5px] font-mono font-bold text-[#1DB954] truncate mt-0.5">
              {role}
            </p>
          </div>
        </div>
      </div>
    );
  }
);
MemberCard.displayName = "MemberCard";

// --- LIGHTBOX MODAL FOR MEMBER DETAILS ---

interface MemberLightboxProps {
  members: DivisionMember[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
  divisionName: string;
}

const MemberLightbox: React.FC<MemberLightboxProps> = ({
  members,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
  divisionName,
}) => {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isSliding, setIsSliding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalMembers = members.length;
  const hasNext = internalIndex < totalMembers - 1;
  const hasPrev = internalIndex > 0;
  const currentMember = members[internalIndex];

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true);
      const timer = setTimeout(() => {
        setInternalIndex(currentIndex);
        setIsSliding(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex);
      setIsSliding(false);
    }
  }, [isOpen, currentIndex]);

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalMembers - 1 || isSliding) return;
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalMembers, isSliding, onNavigate]);

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) return;
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setAnimationPhase("initial");
      onCloseComplete?.();
    }, 500);
  }, [onClose, onCloseComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "ArrowLeft") navigatePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      setShouldRender(true);
      setAnimationPhase("initial");
      setIsClosing(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating");
        });
      });
      const timer = setTimeout(() => {
        setAnimationPhase("complete");
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, sourceRect]);

  const handleDotClick = (idx: number) => {
    if (isSliding || idx === internalIndex) return;
    onNavigate(idx);
  };

  if (!shouldRender || !currentMember) return null;

  const renderSocials = (m: DivisionMember) => {
    const links: string[] = [];
    if (m.instagram_url && m.instagram_url.trim()) links.push(m.instagram_url.trim());
    if (m.email && m.email.trim()) links.push(`mailto:${m.email.trim()}`);
    if (m.github_url && m.github_url.trim() && m.github_url.trim() !== "https://github.com") {
      links.push(m.github_url.trim());
    }
    if (m.linkedin_url && m.linkedin_url.trim() && m.linkedin_url.trim() !== "https://linkedin.com") {
      links.push(m.linkedin_url.trim());
    }
    if (Array.isArray(m.social_links)) {
      m.social_links.forEach((l) => {
        if (l && typeof l === "string" && l.trim() && !links.includes(l.trim())) {
          links.push(l.trim());
        }
      });
    }

    const uniqueLinks = Array.from(new Set(links)).filter(Boolean);

    return (
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        {uniqueLinks.length > 0 ? (
          uniqueLinks.slice(0, 4).map((url, i) => (
            <a
              key={i}
              href={url.startsWith("mailto:") || url.startsWith("http") ? url : `https://${url}`}
              target={url.startsWith("mailto:") ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] border border-white/15 text-slate-200 hover:bg-[#1DB954] hover:text-black hover:border-black transition-all shadow-md cursor-pointer"
              title={url}
            >
              <SocialIcon url={url} size={16} />
            </a>
          ))
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <CheckCircle size={14} className="text-[#1DB954]" /> Pengurus Aktif HMPSTI SWU
          </div>
        )}
      </div>
    );
  };

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {};
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetWidth = Math.min(760, viewportWidth - 64);
    const targetHeight = Math.min(viewportHeight * 0.85, 540);
    const targetX = (viewportWidth - targetWidth) / 2;
    const targetY = (viewportHeight - targetHeight) / 2;
    const scaleX = sourceRect.width / targetWidth;
    const scaleY = sourceRect.height / targetHeight;
    const scale = Math.max(scaleX, scaleY);
    const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2) + window.scrollX;
    const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2) + window.scrollY;
    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      opacity: 0.5,
      borderRadius: "16px",
    };
  };

  const getFinalStyles = (): React.CSSProperties => ({
    transform: "translate(0, 0) scale(1)",
    opacity: 1,
    borderRadius: "24px",
  });

  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles();

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8")}
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="absolute inset-0 bg-[#0B0D14]/90 backdrop-blur-2xl"
        style={{
          opacity: (animationPhase === "initial" && !isClosing) ? 0 : 1,
          transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      
      {/* Close Button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl text-white hover:bg-[#1DB954] hover:text-black transition-all duration-300 cursor-pointer"
        style={{
          opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-30px)",
          transition: "opacity 400ms ease-out 400ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms",
        }}
      >
        <X className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {/* Prev / Next Nav Buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
        disabled={!hasPrev || isSliding}
        className="absolute left-4 md:left-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none shadow-2xl cursor-pointer"
        style={{
          opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-40px)",
          transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
        }}
      >
        <ChevronLeft className="w-6 h-6" strokeWidth={3} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); navigateNext(); }}
        disabled={!hasNext || isSliding}
        className="absolute right-4 md:right-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none shadow-2xl cursor-pointer"
        style={{
          opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(40px)",
          transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
        }}
      >
        <ChevronRight className="w-6 h-6" strokeWidth={3} />
      </button>

      {/* Main Lightbox Content Card */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          transform: isClosing ? "translate(0, 0) scale(0.92)" : currentStyles.transform,
          transition: animationPhase === "initial" && !isClosing ? "none" : "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out, border-radius 700ms ease",
          transformOrigin: "center center",
        }}
      >
        <div className="relative overflow-hidden rounded-[inherit] bg-[#121520] border border-white/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
            
            {/* Photo Section (3:4 ratio) */}
            <div className="md:col-span-5 relative aspect-[3/4] overflow-hidden bg-slate-950">
              <img
                src={currentMember?.avatar || PLACEHOLDER_IMAGE}
                alt={currentMember?.name}
                className="w-full h-full object-cover object-top select-none"
                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[9px] font-mono font-extrabold text-[#1DB954] block uppercase tracking-widest">
                  // {divisionName}
                </span>
                <h4 className="text-lg font-black text-white leading-tight">
                  {currentMember?.name}
                </h4>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#121520]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-bold text-[#1DB954] uppercase tracking-wider">
                    {currentMember?.role}
                  </span>
                  <span className="text-[10px] font-mono text-black font-extrabold bg-[#FFD700] px-2 py-0.5 rounded border border-black shadow-[2px_2px_0px_0px_#000]">
                    VERIFIED ANGGOTA
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {currentMember?.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    NIM: <strong className="text-white">{currentMember?.nim}</strong>
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Pengurus aktif HMPSTI STMIK Widya Utama Purwokerto yang berperan dalam pengembangan program kerja dan inovasi {divisionName}.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                {renderSocials(currentMember)}

                {/* Lightbox Pagination Dots */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] rounded-full border border-white/10">
                    {members.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-500 cursor-pointer",
                          idx === internalIndex ? "bg-[#1DB954] scale-150" : "bg-white/20 hover:bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    {internalIndex + 1} / {totalMembers} ANGGOTA
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- ANIMATED 3D FOLDER COMPONENT ---

interface Folder3DProps {
  title: string;
  members: DivisionMember[];
  className?: string;
  gradient?: string;
}

export function Folder3D({ title, members, className, gradient }: Folder3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const previewMembers = members.slice(0, 5);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotX = (mouseY / (rect.height / 2)) * -12;
    const rotY = (mouseX / (rect.width / 2)) * 12;
    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleMemberClick = (member: DivisionMember, index: number) => {
    const cardEl = cardRefs.current[index];
    if (cardEl) setSourceRect(cardEl.getBoundingClientRect());
    setSelectedIndex(index);
    setHiddenCardId(member.id);
  };

  const handleCloseLightbox = () => { setSelectedIndex(null); setSourceRect(null); };
  const handleCloseComplete = () => { setHiddenCardId(null); };
  const handleNavigate = (newIndex: number) => { setSelectedIndex(newIndex); setHiddenCardId(members[newIndex]?.id || null); };

  const backBg = gradient || "linear-gradient(135deg, #121520 0%, #1DB954 100%)";
  const tabBg = gradient || "#1DB954";
  const frontBg = gradient || "linear-gradient(135deg, #0B0D14 0%, #121520 100%)";

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative flex flex-col items-center justify-center p-8 rounded-3xl cursor-pointer bg-[#0A0C13] border border-white/15 transition-all duration-300 ease-out hover:border-[#1DB954]/60 group select-none shadow-[0_20px_50px_rgba(0,0,0,0.8)]",
          className
        )}
        style={{
          minWidth: "290px",
          minHeight: "330px",
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.05)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (members.length > 0 && selectedIndex === null) {
            handleMemberClick(members[0], 0);
          }
        }}
      >
        {/* Glow backdrop on hover */}
        <div
          className="absolute inset-0 rounded-3xl transition-opacity duration-700 pointer-events-none"
          style={{
            background: gradient
              ? `radial-gradient(circle at 50% 60%, ${gradient.match(/#[a-fA-F0-9]{3,6}/)?.[0] || '#1DB954'} 0%, transparent 70%)`
              : "radial-gradient(circle at 50% 60%, #1DB954 0%, transparent 70%)",
            opacity: isHovered ? 0.25 : 0,
          }}
        />

        {/* 3D Realistic Drop Shadow on Floor */}
        <div
          className="absolute bottom-5 w-44 h-6 rounded-[100%] bg-black/90 blur-md pointer-events-none transition-all duration-500"
          style={{
            transform: isHovered ? "scale(1.25) translateY(10px) opacity(0.85)" : "scale(1) translateY(0px) opacity(0.5)",
          }}
        />

        {/* 3D FOLDER STRUCTURE CONTAINER */}
        <div
          className="relative flex items-end justify-center mb-3 pointer-events-auto"
          style={{
            height: "145px",
            width: "200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* FOLDER BACK PLATE WITH INTEGRATED ASYMMETRIC TOP TAB */}
          <div
            className="absolute bottom-0 w-44 h-32 rounded-2xl shadow-xl overflow-visible border border-white/20"
            style={{
              background: backBg,
              boxShadow: "inset 0 1.5px 2px rgba(255,255,255,0.3), 0 10px 25px rgba(0,0,0,0.7)",
              filter: gradient ? "brightness(0.92)" : "none",
              transformOrigin: "bottom center",
              transform: isHovered
                ? "rotateX(-14deg) translateZ(-10px)"
                : "rotateX(0deg) translateZ(-5px)",
              transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 10,
            }}
          >
            {/* Integrated Top Left Folder Tab Extension */}
            <div
              className="absolute -top-4 left-3 w-20 h-6 rounded-t-xl border-t border-x border-white/30 flex items-center justify-between px-2"
              style={{
                background: tabBg,
                boxShadow: "inset 0 1px 1.5px rgba(255,255,255,0.4)",
                filter: gradient ? "brightness(0.95)" : "none",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
              <span className="text-[7.5px] font-mono font-black text-black/70 uppercase tracking-tighter">
                {title.replace("Divisi ", "")}
              </span>
            </div>

            {/* Subtle Inner Pocket Line */}
            <div className="absolute inset-x-0 bottom-0 top-6 bg-black/10 rounded-b-2xl border-t border-white/10" />
          </div>

          {/* MEMBER CARDS FAN-OUT CONTAINER */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
            style={{
              transform: isHovered ? "translate(-50%, -48px) translateZ(10px)" : "translate(-50%, 0px) translateZ(0px)",
              transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 20,
            }}
          >
            {previewMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                image={member.avatar}
                title={member.name}
                role={member.role}
                delay={index * 50}
                isVisible={isHovered}
                index={index}
                totalCount={previewMembers.length}
                onClick={() => handleMemberClick(member, index)}
                isSelected={hiddenCardId === member.id}
              />
            ))}
          </div>

          {/* FRONT COVER FLAP (SHORTER HEIGHT, ANCHORED EXACTLY AT BOTTOM) */}
          <div
            className="absolute bottom-0 w-44 h-26 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/25 overflow-hidden flex flex-col justify-between p-3"
            style={{
              background: frontBg,
              boxShadow: "inset 0 1.5px 2px rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.85)",
              transformOrigin: "bottom center",
              transform: isHovered
                ? "rotateX(36deg) translateZ(20px)"
                : "rotateX(0deg) translateZ(5px)",
              transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 30,
            }}
          >
            {/* Top Lip Specular Light Highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-white/40 via-white/20 to-transparent" />

            {/* Centered Embossed Label Plate */}
            <div className="self-center w-full px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-between mt-1">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles size={11} className="text-[#1DB954] shrink-0" />
                <span className="text-[9.5px] font-mono font-black text-white uppercase tracking-wider truncate">
                  {title}
                </span>
              </div>
              <div className="h-2 w-2 rounded-full bg-[#1DB954] shadow-[0_0_6px_#1DB954] shrink-0" />
            </div>

            {/* Bottom Folder Crease Detail */}
            <div className="w-full border-b border-dashed border-white/20 pb-0.5 flex justify-between items-center px-1">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">
                // HMPSTI
              </span>
              <span className="text-[8px] font-mono text-[#1DB954] font-bold">
                {members.length} ITEMS
              </span>
            </div>
          </div>

          {/* Front Flap Glass Reflection Overlayer */}
          <div
            className="absolute bottom-0 w-44 h-26 rounded-2xl overflow-hidden pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)",
              transformOrigin: "bottom center",
              transform: isHovered
                ? "rotateX(36deg) translateZ(21px)"
                : "rotateX(0deg) translateZ(6px)",
              transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 31,
            }}
          />
        </div>

        {/* Title & Member Count */}
        <div className="text-center space-y-0.5 pt-1">
          <h3
            className="text-lg font-black text-white transition-all duration-500 uppercase tracking-tight"
            style={{
              transform: isHovered ? "translateY(2px)" : "translateY(0)",
            }}
          >
            {title}
          </h3>
          <p className={cn(
            "text-xs font-mono font-bold transition-all duration-500",
            members.length > 0 ? "text-[#1DB954]" : "text-slate-500"
          )}>
            {members.length > 0
              ? `${members.length} ${members.length === 1 ? 'Anggota' : 'Anggota Terdaftar'}`
              : "0 Anggota Terdaftar"}
          </p>
        </div>

        {/* Hover / Click Hint Pill */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400 transition-all duration-500"
          style={{ opacity: isHovered ? 0.9 : 0.6, transform: isHovered ? "translateY(0px)" : "translateY(2px)" }}
        >
          <span>{members.length > 0 ? "💡 Hover / Klik Folder" : "📂 Folder Kosong"}</span>
        </div>
      </div>

      <MemberLightbox
        members={members}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        sourceRect={sourceRect}
        onCloseComplete={handleCloseComplete}
        onNavigate={handleNavigate}
        divisionName={title}
      />
    </>
  );
}
