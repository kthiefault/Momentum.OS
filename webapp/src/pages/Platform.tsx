import PageLayout from "@/components/landing/PageLayout";
import Solution from "@/components/landing/Solution";
import Phases from "@/components/landing/Phases";
import DashboardPreview from "@/components/landing/DashboardPreview";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const Platform = () => (
  <PageLayout>
    <SEO
      title="Custom Software Platform — One System for Your Entire Business"
      description="Momentum.OS is a custom software platform that connects your tools, automates workflows, and gives you a real-time view of your business. Custom software design built for operators."
      keywords="custom software design, business software platform, custom business systems, integrated business software, all-in-one business platform"
      canonical="/platform"
    />
    <div className="pt-20">
      <Solution />
      <Phases />
      <DashboardPreview />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Platform;
