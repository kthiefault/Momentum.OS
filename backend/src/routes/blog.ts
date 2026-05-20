import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../auth";
import { requireAdmin } from "../middleware/requireAuth";
import type { Context, Next } from "hono";

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function requireJarvisKey(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  const expectedKey = process.env.BLOG_API_KEY;
  if (!authHeader || !expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  await next();
}

const blogRouter = new Hono();

// --- Public routes ---

blogRouter.get("/", async (c) => {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
  const serialized = posts.map((p) => ({
    ...p,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
  return c.json({ data: serialized });
});

blogRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "published" },
  });
  if (!post) {
    return c.json({ error: { message: "Post not found", code: "NOT_FOUND" } }, 404);
  }
  const serialized = {
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
  return c.json({ data: serialized });
});

// --- Admin routes ---

blogRouter.get("/admin/all", requireAdmin, async (c) => {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  const serialized = posts.map((p) => ({
    ...p,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
  return c.json({ data: serialized });
});

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  tags: z.string().optional(),
  status: z.string().optional(),
  publishedAt: z.string().optional(),
});

blogRouter.post(
  "/admin",
  requireAdmin,
  zValidator("json", createPostSchema),
  async (c) => {
    const body = c.req.valid("json");
    const slug = generateSlug(body.title);
    const status = body.status ?? "draft";
    let publishedAt: Date | null = null;
    if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt);
    } else if (status === "published") {
      publishedAt = new Date();
    }
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        excerpt: body.excerpt ?? null,
        coverImage: body.coverImage ?? null,
        author: body.author ?? "Momentum.OS Team",
        tags: body.tags ?? "[]",
        status,
        publishedAt,
      },
    });
    const serialized = {
      ...post,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
    return c.json({ data: serialized }, 201);
  }
);

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  author: z.string().optional(),
  tags: z.string().optional(),
  status: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
});

blogRouter.put(
  "/admin/:id",
  requireAdmin,
  zValidator("json", updatePostSchema),
  async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: { message: "Post not found", code: "NOT_FOUND" } }, 404);
    }

    let publishedAt: Date | null | undefined = undefined;
    if (body.publishedAt !== undefined) {
      publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    } else if (body.status === "published" && !existing.publishedAt) {
      publishedAt = new Date();
    }

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.status !== undefined) updateData.status = body.status;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt;

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    const serialized = {
      ...post,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
    return c.json({ data: serialized });
  }
);

blogRouter.delete("/admin/:id", requireAdmin, async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ error: { message: "Post not found", code: "NOT_FOUND" } }, 404);
  }
  await prisma.blogPost.delete({ where: { id } });
  return c.json({ data: null });
});

// --- Jarvis API key route ---

const jarvisPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  author: z.string().optional().default("Jarvis AI"),
  tags: z.string().optional().default("[]"),
  status: z.enum(["draft", "published"]).optional().default("published"),
  slug: z.string().optional(),
});

blogRouter.post(
  "/jarvis",
  requireJarvisKey,
  zValidator("json", jarvisPostSchema),
  async (c) => {
    const body = c.req.valid("json");
    const slug = body.slug ?? generateSlug(body.title);
    const status = body.status ?? "published";
    const publishedAt = status === "published" ? new Date() : null;

    const existing = await prisma.blogPost.findUnique({ where: { slug } });

    let post;
    if (existing) {
      post = await prisma.blogPost.update({
        where: { slug },
        data: {
          title: body.title,
          content: body.content,
          excerpt: body.excerpt ?? null,
          coverImage: body.coverImage ?? null,
          author: body.author ?? "Jarvis AI",
          tags: body.tags ?? "[]",
          status,
          publishedAt,
        },
      });
    } else {
      post = await prisma.blogPost.create({
        data: {
          title: body.title,
          slug,
          content: body.content,
          excerpt: body.excerpt ?? null,
          coverImage: body.coverImage ?? null,
          author: body.author ?? "Jarvis AI",
          tags: body.tags ?? "[]",
          status,
          publishedAt,
        },
      });
    }

    return c.json({ data: { success: true, id: post.id, slug: post.slug } });
  }
);

export { blogRouter };
