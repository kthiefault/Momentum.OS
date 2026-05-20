import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, BookOpen } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type BlogPost } from "@/components/blog/PostCard";

// ─── helpers ──────────────────────────────────────────────────────────────────

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function tagsToInput(tags: string): string {
  return parseTags(tags).join(", ");
}

function inputToTags(input: string): string {
  const arr = input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return JSON.stringify(arr);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── types ────────────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  tagsInput: string;
  status: "draft" | "published";
  content: string;
}

const emptyForm = (): FormState => ({
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  author: "Momentum.OS Team",
  tagsInput: "",
  status: "draft",
  content: "",
});

function postToForm(post: BlogPost): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    coverImage: post.coverImage ?? "",
    author: post.author,
    tagsInput: tagsToInput(post.tags),
    status: post.status === "published" ? "published" : "draft",
    content: post.content,
  };
}

// ─── status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "published";
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium border",
        isPublished
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
          : "bg-amber-500/15 text-amber-400 border-amber-500/20"
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

// ─── editor view ──────────────────────────────────────────────────────────────

interface EditorProps {
  editingPost: BlogPost | null;
  onBack: () => void;
}

function BlogEditor({ editingPost, onBack }: EditorProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(
    editingPost ? postToForm(editingPost) : emptyForm()
  );
  const [slugEdited, setSlugEdited] = useState<boolean>(Boolean(editingPost));

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // auto-update slug from title unless user manually edited slug
      if (key === "title" && !slugEdited) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "publishedAt">) =>
      api.post<BlogPost>("/api/blog/admin", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Post created successfully");
      onBack();
    },
    onError: () => toast.error("Failed to create post"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<BlogPost>) =>
      api.put<BlogPost>(`/api/blog/admin/${editingPost!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", editingPost?.slug] });
      toast.success("Post updated successfully");
      onBack();
    },
    onError: () => toast.error("Failed to update post"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSave = (publishOverride?: "published" | "draft") => {
    const statusToSave = publishOverride ?? form.status;
    const payload = {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      author: form.author,
      tags: inputToTags(form.tagsInput),
      status: statusToSave,
      content: form.content,
    };

    if (editingPost) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload as Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "publishedAt">);
    }
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to posts
          </button>
          <h2 className="text-xl font-semibold text-white">
            {editingPost ? "Edit Post" : "New Post"}
          </h2>
          {editingPost ? (
            <p className="text-xs text-gray-500 mt-0.5">
              Last updated: {formatDate(editingPost.updatedAt)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Your post title"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelClass}>Slug</label>
          <input
            type="text"
            className={inputClass}
            placeholder="your-post-slug"
            value={form.slug}
            onChange={(e) => {
              setSlugEdited(true);
              setField("slug", e.target.value);
            }}
          />
          <p className="text-[11px] text-gray-600 mt-1">
            URL: /blog/<span className="text-gray-500">{form.slug || toSlug(form.title) || "your-post-slug"}</span>
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea
            className={cn(inputClass, "resize-none")}
            rows={3}
            placeholder="Short description for previews..."
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
          />
        </div>

        {/* Two columns: Author + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Author</label>
            <input
              type="text"
              className={inputClass}
              value={form.author}
              onChange={(e) => setField("author", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setField("status", e.target.value as "draft" | "published")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>Tags</label>
          <input
            type="text"
            className={inputClass}
            placeholder="automation, ai, productivity"
            value={form.tagsInput}
            onChange={(e) => setField("tagsInput", e.target.value)}
          />
          <p className="text-[11px] text-gray-600 mt-1">Comma-separated</p>
        </div>

        {/* Cover Image */}
        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input
            type="text"
            className={inputClass}
            placeholder="https://images.unsplash.com/..."
            value={form.coverImage}
            onChange={(e) => setField("coverImage", e.target.value)}
          />
          {form.coverImage ? (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-700" style={{ maxHeight: 160 }}>
              <img
                src={form.coverImage}
                alt="Preview"
                className="w-full object-cover"
                style={{ maxHeight: 160 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass + " mb-0"}>Content *</label>
            <span className="text-[11px] text-gray-600 italic">Supports Markdown</span>
          </div>
          <textarea
            className={cn(inputClass, "resize-y font-mono text-xs leading-relaxed")}
            rows={20}
            placeholder="Write your post content in Markdown..."
            value={form.content}
            onChange={(e) => setField("content", e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={isPending || !form.title}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isPending && form.status === "draft" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Save as Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isPending || !form.title}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Publish
          </button>
          <button
            onClick={onBack}
            disabled={isPending}
            className="ml-auto text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── list view ────────────────────────────────────────────────────────────────

interface ListProps {
  onNew: () => void;
  onEdit: (post: BlogPost) => void;
}

function BlogList({ onNew, onEdit }: ListProps) {
  const queryClient = useQueryClient();
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);

  const { data: posts, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    queryFn: () => api.get<BlogPost[]>("/api/blog/admin/all"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/blog/admin/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Post deleted");
      setDeletingPost(null);
    },
    onError: () => toast.error("Failed to delete post"),
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {posts ? `${posts.length} post${posts.length !== 1 ? "s" : ""}` : ""}
          </p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium text-white transition-all"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-gray-500">
          Failed to load posts. Check your admin token.
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <span>Title</span>
            <span>Status</span>
            <span className="hidden sm:block">Date</span>
            <span>Actions</span>
          </div>
          {/* Rows */}
          {posts.map((post) => (
            <div
              key={post.id}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3.5 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{post.title}</p>
                <p className="text-xs text-gray-600 truncate">/blog/{post.slug}</p>
              </div>
              <StatusBadge status={post.status} />
              <span className="hidden sm:block text-xs text-gray-500">
                {formatDate(post.publishedAt ?? post.createdAt)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(post)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  title="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeletingPost(post)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
          <BookOpen className="h-10 w-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No posts yet</p>
          <p className="text-gray-700 text-xs mt-1">Create your first post to get started</p>
          <button
            onClick={onNew}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium text-white transition-all mx-auto"
          >
            <Plus className="h-4 w-4" />
            New Post
          </button>
        </div>
      )}

      {/* Delete confirm dialog */}
      <AlertDialog open={Boolean(deletingPost)} onOpenChange={(open) => { if (!open) setDeletingPost(null); }}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete &ldquo;{deletingPost?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deletingPost) deleteMutation.mutate(deletingPost.id); }}
              className="bg-red-600 hover:bg-red-500 text-white border-0"
            >
              {deleteMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

type View =
  | { mode: "list" }
  | { mode: "editor"; post: BlogPost | null };

export default function AdminBlog() {
  const [view, setView] = useState<View>({ mode: "list" });

  return view.mode === "list" ? (
    <BlogList
      onNew={() => setView({ mode: "editor", post: null })}
      onEdit={(post) => setView({ mode: "editor", post })}
    />
  ) : (
    <BlogEditor
      editingPost={view.post}
      onBack={() => setView({ mode: "list" })}
    />
  );
}
