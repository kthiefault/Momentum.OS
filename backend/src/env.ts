import { z } from "zod";

const DEV_AUTH_SECRET = "momentum-admin-secret-key-2024-secure";

/**
 * Environment variable schema using Zod
 * This ensures all required environment variables are present and valid
 */
const envSchema = z
  .object({
    // Server Configuration
    PORT: z.string().optional().default("3000"),
    NODE_ENV: z.string().optional(),
    // Email notifications (optional — feature fails gracefully if unset)
    RESEND_API_KEY: z.string().optional(),
    NOTIFICATION_EMAIL: z.string().optional(),
    // Database
    DATABASE_URL: z.string().optional().default("file:./dev.db"),
    // Better Auth
    BETTER_AUTH_SECRET: z.string().optional(),
    BETTER_AUTH_URL: z.string().optional().default("http://localhost:3000"),
    // Optional integration key for the Jarvis publishing route
    BLOG_API_KEY: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET === DEV_AUTH_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["BETTER_AUTH_SECRET"],
        message: "BETTER_AUTH_SECRET must be set to a unique value in production",
      });
    }
  })
  .transform((env) => ({
    ...env,
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET ?? DEV_AUTH_SECRET,
  }));

/**
 * Validate and parse environment variables
 */
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    console.log("✅ Environment variables validated successfully");
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment variable validation failed:");
      error.issues.forEach((err: any) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      console.error("\nPlease check your .env file and ensure all required variables are set.");
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Validated and typed environment variables
 */
export const env = validateEnv();

/**
 * Type of the validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Extend process.env with our environment variables
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line import/namespace
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
