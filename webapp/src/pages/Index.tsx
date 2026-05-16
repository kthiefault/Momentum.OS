import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import DashboardPreview from "@/components/landing/DashboardPreview";
import AutomationEngine from "@/components/landing/AutomationEngine";
import AIAssistant from "@/components/landing/AIAssistant";
import CRMPipeline from "@/components/landing/CRMPipeline";
import Outcomes from "@/components/landing/Outcomes";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import NoiseOverlay from "@/components/landing/effects/NoiseOverlay";
import CustomCursor from "@/components/landing/effects/CustomCursor";
import GradientMesh from "@/components/landing/effects/GradientMesh";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <CustomCursor />
      <GradientMesh />
      <NoiseOverlay />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <DashboardPreview />
        <AutomationEngine />
        <AIAssistant />
        <CRMPipeline />
        <Outcomes />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
