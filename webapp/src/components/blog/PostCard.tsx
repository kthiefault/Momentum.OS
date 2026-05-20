import { Link } from "react-router-dom";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  author: string;
  tags: string; // JSON array string like '["ai","automation"]'
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

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

function truncate(str: string | null, max: number): string {
  if (!str) return "";
  return str.length > max ? str.slice(0, max).trimEnd() + "…" : str;
}

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  const tags = parseTags(post.tags);
  const displayDate = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <article className="group flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-border transition-all duration-300 hover:shadow-[0_0_32px_0_hsl(221_79%_48%/0.08)]">
      {/* Cover image or gradient placeholder */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ember/20 via-ember-deep/10 to-ice/20 flex items-center justify-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-ember to-ember-deep opacity-40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tags */}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
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
        <Link
          to={`/blog/${post.slug}`}
          className="text-foreground font-semibold text-lg leading-snug hover:text-ember transition-colors line-clamp-2"
        >
          {post.title}
        </Link>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          {truncate(post.excerpt, 120)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-ember to-ember-deep flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[9px] font-bold">
                {post.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{post.author}</p>
              {displayDate ? <p className="text-[11px] text-muted-foreground/60">{displayDate}</p> : null}
            </div>
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="text-xs text-ember hover:text-ember-deep transition-colors font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
