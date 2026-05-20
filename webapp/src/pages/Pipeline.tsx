import PageLayout from "@/components/landing/PageLayout";
import CRMPipeline from "@/components/landing/CRMPipeline";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const Pipeline = () => (
  <PageLayout>
    <SEO
      title="AI-Powered CRM & Sales Pipeline Automation"
      description="Never lose a lead with Momentum.OS AI-powered CRM. Contacts auto-enriched, deals scored, and your pipeline managed automatically. Sales automation that actually works."
      keywords="CRM automation, sales pipeline automation, AI CRM, lead management automation, sales automation software, pipeline management"
      canonical="/pipeline"
    />
    <div className="pt-20">
      <CRMPipeline />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Pipeline;
