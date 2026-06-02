import { Suspense, lazy } from "react";
import PageLayout from "@/components/landing/PageLayout";
import Hero from "@/components/landing/Hero";
import { SEO } from "@/components/SEO";

const Problem = lazy(() => import("@/components/landing/Problem"));
const Outcomes = lazy(() => import("@/components/landing/Outcomes"));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA"));

const SectionFallback = () => <div className="min-h-64" aria-hidden />;

const Index = () => (
  <PageLayout>
    <SEO
      title="Business Automation & AI Integration Platform"
      description="Momentum.OS automates your business workflows, integrates AI into every process, and helps operators reclaim 41+ hours per week. The AI-powered operating system for modern business."
      keywords="business automation, AI integration, workflow automation, business process automation, AI-powered CRM, automated business systems"
      canonical="/"
    />
    <Hero />
    <Suspense fallback={<SectionFallback />}>
      <Problem />
      <Outcomes />
      <FinalCTA />
    </Suspense>
  </PageLayout>
);

export default Index;
