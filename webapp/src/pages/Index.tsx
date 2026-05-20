import PageLayout from "@/components/landing/PageLayout";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Outcomes from "@/components/landing/Outcomes";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const Index = () => (
  <PageLayout>
    <SEO
      title="Business Automation & AI Integration Platform"
      description="Momentum.OS automates your business workflows, integrates AI into every process, and helps operators reclaim 41+ hours per week. The AI-powered operating system for modern business."
      keywords="business automation, AI integration, workflow automation, business process automation, AI-powered CRM, automated business systems"
      canonical="/"
    />
    <Hero />
    <Problem />
    <Outcomes />
    <FinalCTA />
  </PageLayout>
);

export default Index;
