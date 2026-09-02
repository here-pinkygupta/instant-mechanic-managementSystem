import { Router } from "express";

import {
  loginController,
  meController,
  registerController,
} from "../controllers/auth.controller";

import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { authRateLimit } from "../middleware/rateLimit.middleware";

const r = Router();

r.post(
  "/register",
  authRateLimit,
  asyncHandler(registerController)
);

r.post(
  "/login",
  authRateLimit,
  asyncHandler(loginController)
);

r.get(
  "/me",
  requireAuth,
  asyncHandler(meController)
);

export default r;