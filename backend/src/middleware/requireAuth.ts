import { Context, Next } from "hono";
import { auth } from "../auth";

export async function requireAuth(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  c.set("session", session);
  c.set("user", session.user);
  await next();
}

export async function requireAdmin(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  if ((session.user as any).role !== "admin") {
    return c.json({ error: { message: "Forbidden", code: "FORBIDDEN" } }, 403);
  }
  c.set("session", session);
  c.set("user", session.user);
  await next();
}
