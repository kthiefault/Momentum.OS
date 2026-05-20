import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import PageLayout from "@/components/landing/PageLayout";
import { SEO } from "@/components/SEO";
import { PostCard, type BlogPost } from "@/components/blog/PostCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } },
};

export default function Blog() {
  const { data: posts, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: () => api.get<BlogPost[]>("/api/blog"),
  });

  return (
    <PageLayout>
      <SEO
        title="Blog — Insights & Automation Playbooks"
        description="Strategies, case studies, and AI tips to help you reclaim your time and scale your business."
        keywords="business automation, AI tips, workflow strategies, productivity playbooks"
        canonical="/blog"
      />

      <div className="pt-28 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="inline-flex items-center rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember mb-4 uppercase tracking-widest">
                The Momentum Blog
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
                <span className="bg-gradient-to-r from-ember to-ice bg-clip-text text-transparent">
                  Insights &amp; Automation
                </span>
                <br />
                <span className="text-foreground">Playbooks</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Strategies, case studies, and AI tips to help you reclaim your time and scale your business.
              </p>
            </motion.div>
          </div>

          {/* Posts grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl border border-border/40 bg-card overflow-hidden animate-pulse">
                  <div className="h-48 bg-secondary/30" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-16 rounded-full bg-secondary/50" />
                    <div className="h-5 w-4/5 rounded bg-secondary/40" />
                    <div className="h-4 w-full rounded bg-secondary/30" />
                    <div className="h-4 w-2/3 rounded bg-secondary/30" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-muted-foreground">
              Failed to load posts. Please try again later.
            </div>
          ) : posts && posts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={cardVariants}>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-ember/10 border border-ember/20 mb-5 shadow-[0_0_40px_0_hsl(221_79%_48%/0.15)]">
                <span className="text-2xl">✍️</span>
              </div>
              <p className="text-muted-foreground text-lg">No posts yet — check back soon.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">We're working on something great.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
