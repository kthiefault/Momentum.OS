import "@vibecodeapp/proxy"; // DO NOT REMOVE OTHERWISE VIBECODE PROXY WILL NOT WORK
import { Hono } from "hono";
import { cors } from "hono/cors";
import "./env";
import { sampleRouter } from "./routes/sample";
import { notificationsRouter } from "./routes/notifications";
import { logger } from "hono/logger";
import { auth } from "./auth";
import workflowsRouter from "./routes/workflows";
import leadsRouter from "./routes/leads";
import adminRouter from "./routes/admin";
import { blogRouter } from "./routes/blog";

const app = new Hono();

// CORS middleware - validates origin against allowlist
const allowed = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[a-z0-9-]+\.dev\.vibecode\.run$/,
  /^https:\/\/[a-z0-9-]+\.vibecode\.run$/,
  /^https:\/\/[a-z0-9-]+\.vibecodeapp\.com$/,
  /^https:\/\/[a-z0-9-]+\.vibecode\.dev$/,
  /^https:\/\/vibecode\.dev$/,
];

app.use(
  "*",
  cors({
    origin: (origin) => (origin && allowed.some((re) => re.test(origin)) ? origin : null),
    credentials: true,
  })
);

// Logging
app.use("*", logger());

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

// Better Auth handler — must be before other /api/auth routes
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// Routes
app.route("/api/sample", sampleRouter);
app.route("/api/notifications", notificationsRouter);
app.route("/api/workflows", workflowsRouter);
app.route("/api/leads", leadsRouter);
app.route("/api/admin", adminRouter);
app.route("/api/blog", blogRouter); // blog system

const port = Number(process.env.PORT) || 3000;

export default {
  port,
  fetch: app.fetch,
};
