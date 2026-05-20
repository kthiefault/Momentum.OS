import { Suspense, lazy } from "react";
import PageLayout from "@/components/landing/PageLayout";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const OrchestrationFlow = lazy(() => import("../components/landing/OrchestrationFlow"));
const AutomationEngine = lazy(() => import("../components/landing/AutomationEngine"));

const Automation = () => (
  <PageLayout>
    <SEO
      title="Business Process Automation — Workflows on Autopilot"
      description="Automate repetitive business processes with Momentum.OS. From email follow-ups to complex multi-step workflows, our automation engine handles the routine so you can focus on growth."
      keywords="business process automation, workflow automation, automated workflows, task automation, business automation software, process automation tools"
      canonical="/automation"
    />
    <div className="pt-20">
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-900/50 rounded-xl" />}>
        <OrchestrationFlow />
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-900/50 rounded-xl" />}>
        <AutomationEngine />
      </Suspense>
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Automation;
