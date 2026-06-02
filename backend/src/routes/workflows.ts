import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../auth";
import { requireAdmin } from "../middleware/requireAuth";

const router = new Hono();

const workflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "paused", "draft"]).default("draft"),
  trigger: z.enum(["manual", "scheduled", "webhook", "form"]).default("manual"),
  category: z.enum(["automation", "ai", "crm", "notification", "custom", "general"]).default("general"),
  steps: z.array(z.any()).default([]),
});

// GET all workflows — exclude large steps blob from list view
router.get("/", requireAdmin, async (c) => {
  const workflows = await prisma.workflow.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      trigger: true,
      category: true,
      runCount: true,
      lastRun: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return c.json({ data: workflows });
});

// GET single workflow
router.get("/:id", requireAdmin, async (c) => {
  const workflow = await prisma.workflow.findUnique({ where: { id: c.req.param("id") } });
  if (!workflow) return c.json({ error: { message: "Not found", code: "NOT_FOUND" } }, 404);
  return c.json({ data: workflow });
});

// POST create workflow
router.post("/", requireAdmin, zValidator("json", workflowSchema), async (c) => {
  const data = c.req.valid("json");
  const workflow = await prisma.workflow.create({
    data: { ...data, steps: JSON.stringify(data.steps) },
  });
  return c.json({ data: workflow }, 201);
});

// PUT update workflow
router.put("/:id", requireAdmin, zValidator("json", workflowSchema.partial()), async (c) => {
  const data = c.req.valid("json");
  const workflow = await prisma.workflow.update({
    where: { id: c.req.param("id") },
    data: {
      ...data,
      steps: data.steps ? JSON.stringify(data.steps) : undefined,
      updatedAt: new Date(),
    },
  });
  return c.json({ data: workflow });
});

// DELETE workflow
router.delete("/:id", requireAdmin, async (c) => {
  await prisma.workflow.delete({ where: { id: c.req.param("id") } });
  return c.json({ data: null }, 200);
});

// POST run workflow
router.post("/:id/run", requireAdmin, async (c) => {
  const workflow = await prisma.workflow.update({
    where: { id: c.req.param("id") },
    data: { runCount: { increment: 1 }, lastRun: new Date() },
  });
  return c.json({ data: { success: true, workflow } });
});

export default router;
