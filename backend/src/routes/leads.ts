import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../auth";
import { requireAdmin } from "../middleware/requireAuth";

const router = new Hono();

const leadUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).optional(),
  notes: z.string().optional(),
});

const leadCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional().default("website"),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).optional().default("new"),
  notes: z.string().optional(),
});

const publicLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional().default("social-media-funnel"),
});

router.post("/public", zValidator("json", publicLeadSchema), async (c) => {
  const { name, email, phone, company, source } = c.req.valid("json");
  const notes = company ? `Company: ${company}` : undefined;
  await prisma.lead.create({
    data: { name, email, phone, source, status: "new", notes },
  });
  return c.json({ data: { success: true } }, 201);
});

router.get("/", requireAdmin, async (c) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return c.json({ data: leads });
});

router.post("/", requireAdmin, zValidator("json", leadCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const lead = await prisma.lead.create({ data });
  return c.json({ data: lead }, 201);
});

router.put("/:id", requireAdmin, zValidator("json", leadUpdateSchema), async (c) => {
  const lead = await prisma.lead.update({
    where: { id: c.req.param("id") },
    data: { ...c.req.valid("json"), updatedAt: new Date() },
  });
  return c.json({ data: lead });
});

router.delete("/:id", requireAdmin, async (c) => {
  await prisma.lead.delete({ where: { id: c.req.param("id") } });
  return c.json({ data: null });
});

export default router;
