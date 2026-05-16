import PageLayout from "@/components/landing/PageLayout";
import PricingSection from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";

const Pricing = () => (
  <PageLayout>
    <div className="pt-20">
      <PricingSection />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Pricing;
