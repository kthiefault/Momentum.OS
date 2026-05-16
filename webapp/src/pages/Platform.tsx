import PageLayout from "@/components/landing/PageLayout";
import Solution from "@/components/landing/Solution";
import Phases from "@/components/landing/Phases";
import DashboardPreview from "@/components/landing/DashboardPreview";
import FinalCTA from "@/components/landing/FinalCTA";

const Platform = () => (
  <PageLayout>
    <div className="pt-20">
      <Solution />
      <Phases />
      <DashboardPreview />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Platform;
