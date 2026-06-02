import { Suspense, lazy } from "react";
import PageLayout from "@/components/landing/PageLayout";
import { SEO } from "@/components/SEO";

const Solution = lazy(() => import("@/components/landing/Solution"));
const Phases = lazy(() => import("@/components/landing/Phases"));
const DashboardPreview = lazy(() => import("../components/landing/DashboardPreview"));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA"));

const SectionFallback = () => <div className="min-h-64" aria-hidden />;

const Platform = () => (
  <PageLayout>
    <SEO
      title="Custom Software Platform — One System for Your Entire Business"
      description="Momentum.OS is a custom software platform that connects your tools, automates workflows, and gives you a real-time view of your business. Custom software design built for operators."
      keywords="custom software design, business software platform, custom business systems, integrated business software, all-in-one business platform"
      canonical="/platform"
    />
    <div className="pt-20">
      <Suspense fallback={<SectionFallback />}>
        <Solution />
        <Phases />
        <DashboardPreview />
        <FinalCTA />
      </Suspense>
    </div>
  </PageLayout>
);

export default Platform;
