import type { RequestHandler } from "express";

import {
  AuthError,
  getMe,
  login,
  register,
} from "../services/auth.service";

import { loginSchema, registerSchema } from "../validators/auth.validator";
import { success, failure } from "../utils/apiResponse";


export const registerController: RequestHandler = async (req, res) => {
  try {
    const input = registerSchema.parse(req.body);

    const user = await register(
      input.name,
      input.email,
      input.password
    );

    return success(
      res,
      user,
      "Registration successful",
      201
    );
  } catch (e) {
    if (e instanceof AuthError) {
      return failure(
        res,
        e.code,
        e.code === "EMAIL_EXISTS"
          ? "An account with this email already exists"
          : "Registration failed",
        e.code === "EMAIL_EXISTS" ? 409 : 400
      );
    }

    throw e;
  }
};


export const loginController: RequestHandler = async (req, res) => {
  const input = loginSchema.parse(req.body);

  try {
    return success(
      res,
      await login(input.email, input.password),
      "Login successful"
    );
  } catch (e) {
    if (e instanceof AuthError) {
      return failure(
        res,
        e.code,
        e.code === "ACCOUNT_INACTIVE"
          ? "Your account is inactive"
          : "Invalid email or password",
        e.code === "ACCOUNT_INACTIVE" ? 403 : 401
      );
    }

    throw e;
  }
};


export const meController: RequestHandler = async (req, res) => {
  if (!req.user) {
    return failure(
      res,
      "UNAUTHORIZED",
      "Authentication required",
      401
    );
  }

  const u = await getMe(req.user.id);

  if (!u) {
    return failure(
      res,
      "USER_NOT_FOUND",
      "User not found",
      404
    );
  }

  return success(
    res,
    u,
    "Current user retrieved successfully"
  );
};