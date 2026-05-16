import PageLayout from "@/components/landing/PageLayout";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Outcomes from "@/components/landing/Outcomes";
import FinalCTA from "@/components/landing/FinalCTA";

const Index = () => (
  <PageLayout>
    <Hero />
    <Problem />
    <Outcomes />
    <FinalCTA />
  </PageLayout>
);

export default Index;
