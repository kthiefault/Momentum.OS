import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { api } from "@/lib/api";
import PageLayout from "@/components/landing/PageLayout";
import { SEO } from "@/components/SEO";
import { type BlogPost as BlogPostType } from "@/components/blog/PostCard";
import { motion } from "framer-motion";

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery<BlogPostType>({
    queryKey: ["blog-post", slug],
    queryFn: () => api.get<BlogPostType>(`/api/blog/${slug}`),
    enabled: Boolean(slug),
    retry: false,
  });

  const tags = post ? parseTags(post.tags) : [];
  const displayDate = post ? formatDate(post.publishedAt ?? post.createdAt) : "";

  return (
    <PageLayout>
      {post ? (
        <SEO
          title={post.title}
          description={post.excerpt ?? post.title}
          canonical={`/blog/${post.slug}`}
          ogImage={post.coverImage ?? undefined}
        />
      ) : (
        <SEO title="Blog Post" description="Read our latest insights and automation playbooks." />
      )}

      <div className="pt-28 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← All Posts
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-72 rounded-2xl bg-secondary/30" />
              <div className="h-6 w-2/3 rounded bg-secondary/40" />
              <div className="h-10 w-full rounded bg-secondary/40" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 rounded bg-secondary/30" />
                ))}
              </div>
            </div>
          ) : isError || !post ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Post not found</h2>
              <p className="text-muted-foreground mb-6">
                This post may have been removed or the URL is incorrect.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-ember hover:text-ember-deep font-medium transition-colors"
              >
                ← Back to all posts
              </Link>
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Cover image */}
              {post.coverImage ? (
                <div className="relative rounded-2xl overflow-hidden mb-8" style={{ maxHeight: 400 }}>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full object-cover"
                    style={{ maxHeight: 400 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                </div>
              ) : null}

              {/* Tags */}
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-ember/10 text-ember border border-ember/20 uppercase tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-ember to-ice bg-clip-text text-transparent">
                {post.title}
              </h1>

              {/* Author + date */}
              <div className="flex items-center gap-3 mb-10 pb-8 border-b border-border/40">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-ember to-ember-deep flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.author}</p>
                  {displayDate ? (
                    <p className="text-xs text-muted-foreground">{displayDate}</p>
                  ) : null}
                </div>
              </div>

              {/* Markdown content */}
              <div className="prose-content">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-foreground mt-8 mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold text-foreground mt-7 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-muted-foreground">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1 pl-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-1 pl-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    code: ({ children, className }) => {
                      const isBlock = className?.includes("language-");
                      return isBlock ? (
                        <code className="block bg-card border border-border/60 rounded-lg px-4 py-3 font-mono text-sm text-foreground mb-4 overflow-x-auto whitespace-pre">
                          {children}
                        </code>
                      ) : (
                        <code className="bg-card px-1.5 py-0.5 rounded font-mono text-sm text-ember border border-border/40">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-card border border-border/60 rounded-xl p-4 mb-4 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-ember pl-4 italic text-muted-foreground my-4">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-ember hover:text-ember-deep underline underline-offset-2 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    hr: () => <hr className="border-border/40 my-8" />,
                    img: ({ src, alt }) => (
                      <img
                        src={src}
                        alt={alt}
                        className="rounded-xl w-full object-cover my-6 border border-border/40"
                      />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Bottom back link */}
              <div className="mt-12 pt-8 border-t border-border/40">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ember transition-colors"
                >
                  ← Back to all posts
                </Link>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
