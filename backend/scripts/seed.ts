import { PrismaClient } from "@prisma/client";
import { auth } from "../src/auth";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");

  // Check if admin already exists
  const existing = await prisma.user.findUnique({ where: { email: "kennyt@admin.com" } });
  if (existing) {
    // Update to ensure admin role
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: "admin" },
    });
    console.log("Admin user already exists, ensured admin role");
  } else {
    // Create admin user via Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        name: "Kenny T",
        email: "kennyt@admin.com",
        password: "1234",
      },
    });

    if (result?.user) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role: "admin" },
      });
      console.log("Admin user created: kennyt@admin.com / 1234");
    }
  }

  // Seed some default workflows (only if none exist)
  const workflowCount = await prisma.workflow.count();
  if (workflowCount === 0) {
    await prisma.workflow.createMany({
      data: [
        {
          name: "Lead Capture & Notify",
          description: "Capture leads from website and send email notification",
          status: "active",
          trigger: "form",
          category: "automation",
          steps: JSON.stringify([
            { id: "1", type: "trigger", name: "Form Submission" },
            { id: "2", type: "action", name: "Send Email Notification" },
            { id: "3", type: "action", name: "Add to CRM" },
          ]),
        },
        {
          name: "AI Content Generator",
          description: "Auto-generate blog posts and social content using AI",
          status: "paused",
          trigger: "scheduled",
          category: "ai",
          steps: JSON.stringify([
            { id: "1", type: "trigger", name: "Daily Schedule" },
            { id: "2", type: "action", name: "AI Generate Content" },
            { id: "3", type: "action", name: "Post to Channels" },
          ]),
        },
        {
          name: "CRM Pipeline Mover",
          description: "Automatically move leads through sales pipeline stages",
          status: "active",
          trigger: "webhook",
          category: "crm",
          steps: JSON.stringify([
            { id: "1", type: "trigger", name: "Lead Status Change" },
            { id: "2", type: "condition", name: "Check Stage Rules" },
            { id: "3", type: "action", name: "Move Pipeline Stage" },
          ]),
        },
      ],
    });
    console.log("Default workflows created.");
  } else {
    console.log("Workflows already exist, skipping.");
  }

  console.log("Seed complete!");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
