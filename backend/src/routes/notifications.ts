import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Resend } from "resend";
import { env } from "../env";

const notificationsRouter = new Hono();
const signupNotificationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional().nullable(),
});

function escapeHtml(value: string | null | undefined): string {
  return (value ?? "").replace(/[&<>"']/g, (char) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return replacements[char] ?? char;
  });
}

notificationsRouter.post("/notify-signup", zValidator("json", signupNotificationSchema), async (c) => {
  const { name, email, phone } = c.req.valid("json");

  if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL) {
    // Silently succeed if not configured — don't block the user
    return c.json({ data: { sent: false, reason: "not configured" } });
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: env.NOTIFICATION_EMAIL,
      subject: `New signup: ${name.replace(/[\r\n]/g, " ")}`,
      html: `
        <h2>New user signed up on Momentum.OS</h2>
        <table>
          <tr><td><strong>Name:</strong></td><td>${safeName}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${safeEmail}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${safePhone}</td></tr>
        </table>
      `,
    });
    return c.json({ data: { sent: true } });
  } catch (err) {
    console.error("Email notification failed:", err);
    return c.json({ data: { sent: false, reason: "send failed" } });
  }
});

export { notificationsRouter };
