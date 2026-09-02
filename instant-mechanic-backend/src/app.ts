import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { apiRateLimit } from "./middleware/rateLimit.middleware";
import {
  notFoundMiddleware,
  errorMiddleware
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

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb"
  })
);

app.use(apiRateLimit);
app.use("/api/auth", auth);
app.get("/health", (req, res) =>
  res.json({
    success: true,
    status: databaseReady() ? "healthy" : "degraded",
    database: databaseReady() ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  })
);

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

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

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;