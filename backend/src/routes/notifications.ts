import { Hono } from "hono";
import { Resend } from "resend";
import { env } from "../env";

const notificationsRouter = new Hono();

notificationsRouter.post("/notify-signup", async (c) => {
  const { name, email, phone } = await c.req.json();

  if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL) {
    // Silently succeed if not configured — don't block the user
    return c.json({ data: { sent: false, reason: "not configured" } });
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: env.NOTIFICATION_EMAIL,
      subject: `New signup: ${name}`,
      html: `
        <h2>New user signed up on Momentum.OS</h2>
        <table>
          <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
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
