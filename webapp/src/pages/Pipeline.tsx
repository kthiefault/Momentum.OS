import PageLayout from "@/components/landing/PageLayout";
import CRMPipeline from "@/components/landing/CRMPipeline";
import FinalCTA from "@/components/landing/FinalCTA";

const Pipeline = () => (
  <PageLayout>
    <div className="pt-20">
      <CRMPipeline />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Pipeline;
