import { HeroSection } from "@/components/modules/home/HeroSection";
import { DivisiPreviewSection } from "@/components/modules/home/DivisiPreviewSection";
import { BentoHighlightsSection } from "@/components/modules/home/BentoHighlightsSection";
import { KaryaPreviewSection } from "@/components/modules/home/KaryaPreviewSection";

export default function Home() {
  return (
    <div className="space-y-6 pb-12">
      <HeroSection />
      <DivisiPreviewSection />
      <BentoHighlightsSection />
      <KaryaPreviewSection />
    </div>
  );
}
