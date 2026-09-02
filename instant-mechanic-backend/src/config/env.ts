import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  LOG_LEVEL: z.string().default("info")
});
const result = schema.safeParse(process.env);
if (!result.success) {
  console.error("Invalid environment:", result.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = {
  nodeEnv: result.data.NODE_ENV,
  port: result.data.PORT,
  mongoUri: result.data.MONGODB_URI,
  jwtSecret: result.data.JWT_SECRET,
  jwtExpiresIn: result.data.JWT_EXPIRES_IN,
  frontendUrl: result.data.FRONTEND_URL,
  logLevel: result.data.LOG_LEVEL
};
