import { Suspense, lazy } from "react";
import PageLayout from "@/components/landing/PageLayout";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const CRMPipeline = lazy(() => import("../components/landing/CRMPipeline"));

const Pipeline = () => (
  <PageLayout>
    <SEO
      title="AI-Powered CRM & Sales Pipeline Automation"
      description="Never lose a lead with Momentum.OS AI-powered CRM. Contacts auto-enriched, deals scored, and your pipeline managed automatically. Sales automation that actually works."
      keywords="CRM automation, sales pipeline automation, AI CRM, lead management automation, sales automation software, pipeline management"
      canonical="/pipeline"
    />
    <div className="pt-20">
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-900/50 rounded-xl" />}>
        <CRMPipeline />
      </Suspense>
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Pipeline;
