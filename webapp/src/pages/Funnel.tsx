import React from "react";
import { TopBar } from "@/components/funnel/TopBar";
import { HeroSection } from "@/components/funnel/HeroSection";
import { TestimonialsSection } from "@/components/funnel/TestimonialsSection";
import { WhatYouGetSection } from "@/components/funnel/WhatYouGetSection";
import { StatsBar } from "@/components/funnel/StatsBar";
import { BottomCTA } from "@/components/funnel/BottomCTA";
import { BookingSection } from "@/components/funnel/BookingSection";

export default function Funnel() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main>
        <HeroSection />
        <StatsBar />
        <TestimonialsSection />
        <WhatYouGetSection />
        <BookingSection />
        <BottomCTA />
      </main>
    </div>
  );
}
