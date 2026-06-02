import { Hono } from "hono";
import { auth, prisma } from "../auth";
import { requireAdmin } from "../middleware/requireAuth";

const router = new Hono();

// Custom login — bypasses Better Auth's HTTP-level origin check
router.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const result = await auth.api.signInEmail({
      body: { email, password },
    });
    if (!result?.token) {
      return c.json({ error: { message: "Invalid credentials", code: "INVALID_CREDENTIALS" } }, 401);
    }
    const user = await prisma.user.findUnique({ where: { id: result.user.id } });
    if (!user || user.role !== "admin") {
      return c.json({ error: { message: "Access denied", code: "FORBIDDEN" } }, 403);
    }
    return c.json({ data: { token: result.token, user: result.user } });
  } catch {
    return c.json({ error: { message: "Invalid credentials", code: "INVALID_CREDENTIALS" } }, 401);
  }
});

router.get("/stats", requireAdmin, async (c) => {
  const [totalWorkflows, activeWorkflows, totalLeads, newLeads, recentWorkflows, recentLeads] =
    await Promise.all([
      prisma.workflow.count(),
      prisma.workflow.count({ where: { status: "active" } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "new" } }),
      prisma.workflow.findMany({ take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.lead.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    ]);

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
