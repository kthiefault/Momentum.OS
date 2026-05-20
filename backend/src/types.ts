import { z } from "zod";

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  trigger: z.string(),
  category: z.string(),
  steps: z.string(),
  runCount: z.number(),
  lastRun: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  source: z.string(),
  status: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AdminStatsSchema = z.object({
  totalWorkflows: z.number(),
  activeWorkflows: z.number(),
  totalLeads: z.number(),
  newLeads: z.number(),
  recentWorkflows: z.array(WorkflowSchema),
  recentLeads: z.array(LeadSchema),
});

export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  coverImage: z.string().nullable(),
  author: z.string(),
  tags: z.string(),
  status: z.string(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Workflow = z.infer<typeof WorkflowSchema>;
export type Lead = z.infer<typeof LeadSchema>;
export type AdminStats = z.infer<typeof AdminStatsSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
