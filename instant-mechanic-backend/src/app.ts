import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { apiRateLimit } from "./middleware/rateLimit.middleware";
import {
  notFoundMiddleware,
  errorMiddleware,
} from "./middleware/error.middleware";
import swaggerSpec from "./docs/swagger";

import auth from "./routes/auth.routes";
import dashboard from "./routes/dashboard.routes";
import bookings from "./routes/booking.routes";
import mechanics from "./routes/mechanic.routes";
import customers from "./routes/customer.routes";
import services from "./routes/service.routes";
import notifications from "./routes/notification.routes";
import audit from "./routes/audit.routes";
import activity from "./routes/activity.routes";
import exportRoutes from "./routes/export.routes";

import { databaseReady } from "./config/database";

const app = express();

app.set("trust proxy", 1);

app.disable("x-powered-by");

app.use(helmet());

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  "http://localhost:3000",
  "https://instant-mechanic-management-system-d8ar8egm9.vercel.app",
  env.frontendUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --------------------------------------------------
// BODY PARSING
// --------------------------------------------------

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// --------------------------------------------------
// RATE LIMIT
// --------------------------------------------------

app.use(apiRateLimit);

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/health", (req, res) => {
  return res.json({
    success: true,
    status: databaseReady() ? "healthy" : "degraded",
    database: databaseReady() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------
// SWAGGER
// --------------------------------------------------

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use("/api/auth", auth);

app.use("/api/dashboard", dashboard);

app.use("/api/bookings/export", exportRoutes);

app.use("/api/bookings", bookings);

app.use("/api/mechanics", mechanics);

app.use("/api/customers", customers);

app.use("/api/services", services);

app.use("/api/notifications", notifications);

app.use("/api/audit-logs", audit);

app.use("/api/activity", activity);

// --------------------------------------------------
// ERROR HANDLING
// --------------------------------------------------

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;