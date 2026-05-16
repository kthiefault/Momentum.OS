import PageLayout from "@/components/landing/PageLayout";
import OrchestrationFlow from "@/components/landing/OrchestrationFlow";
import AutomationEngine from "@/components/landing/AutomationEngine";
import FinalCTA from "@/components/landing/FinalCTA";

const Automation = () => (
  <PageLayout>
    <div className="pt-20">
      <OrchestrationFlow />
      <AutomationEngine />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Automation;
