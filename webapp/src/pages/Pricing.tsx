import PageLayout from "@/components/landing/PageLayout";
import PricingSection from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const Pricing = () => (
  <PageLayout>
    <SEO
      title="Pricing — Business Automation Plans for Every Stage"
      description="Flexible pricing for business automation and AI integration. From solo founders to advisory firms — Momentum.OS scales with your business."
      keywords="business automation pricing, AI integration plans, workflow automation cost, business software pricing"
      canonical="/pricing"
    />
    <div className="pt-20">
      <PricingSection />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default Pricing;
