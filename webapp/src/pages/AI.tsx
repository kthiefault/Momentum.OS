import PageLayout from "@/components/landing/PageLayout";
import AIAssistant from "@/components/landing/AIAssistant";
import FinalCTA from "@/components/landing/FinalCTA";
import { SEO } from "@/components/SEO";

const AI = () => (
  <PageLayout>
    <SEO
      title="AI Integration for Business — AI Assistants That Work For You"
      description="Integrate AI into your business operations with Momentum.OS. AI assistants trained on your business handle emails, summaries, and decision support — no prompts needed."
      keywords="AI integration, AI assistant for business, business AI tools, AI-powered automation, artificial intelligence business, AI software integration"
      canonical="/ai"
    />
    <div className="pt-20">
      <AIAssistant />
      <FinalCTA />
    </div>
  </PageLayout>
);

export default AI;
