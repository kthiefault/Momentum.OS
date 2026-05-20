import PageLayout from "@/components/landing/PageLayout";
import OrchestrationFlow from "@/components/landing/OrchestrationFlow";
import AutomationEngine from "@/components/landing/AutomationEngine";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const Automation = () => (
  <PageLayout>
    <SEO
      title="Business Process Automation — Workflows on Autopilot"
      description="Automate repetitive business processes with Momentum.OS. From email follow-ups to complex multi-step workflows, our automation engine handles the routine so you can focus on growth."
      keywords="business process automation, workflow automation, automated workflows, task automation, business automation software, process automation tools"
      canonical="/automation"
    />
    <div className="pt-20">
      <OrchestrationFlow />
      <AutomationEngine />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Automation;
