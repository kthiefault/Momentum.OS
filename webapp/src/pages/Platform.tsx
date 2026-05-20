import { Suspense, lazy } from "react";
import PageLayout from "@/components/landing/PageLayout";
import Solution from "@/components/landing/Solution";
import Phases from "@/components/landing/Phases";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const DashboardPreview = lazy(() => import("../components/landing/DashboardPreview"));

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
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-900/50 rounded-xl" />}>
        <DashboardPreview />
      </Suspense>
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Platform;
