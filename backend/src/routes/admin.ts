import { Hono } from "hono";
import { prisma } from "../auth";
import { requireAdmin } from "../middleware/requireAuth";

const router = new Hono();

router.get("/stats", requireAdmin, async (c) => {
  const [totalWorkflows, activeWorkflows, totalLeads, newLeads] = await Promise.all([
    prisma.workflow.count(),
    prisma.workflow.count({ where: { status: "active" } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "new" } }),
  ]);

  const recentWorkflows = await prisma.workflow.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
  });

  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return c.json({
    data: {
      totalWorkflows,
      activeWorkflows,
      totalLeads,
      newLeads,
      recentWorkflows,
      recentLeads,
    },
  });
});

export default router;
