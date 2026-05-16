import PageLayout from "@/components/landing/PageLayout";
import AIAssistant from "@/components/landing/AIAssistant";
import FinalCTA from "@/components/landing/FinalCTA";

const AI = () => (
  <PageLayout>
    <div className="pt-20">
      <AIAssistant />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default AI;
