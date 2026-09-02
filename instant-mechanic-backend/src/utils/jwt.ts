import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "../models/User";
export interface TokenPayload { sub:string; email:string; name:string; role:UserRole; }
export function signToken(payload:TokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });
}
export function verifyToken(token:string) { return jwt.verify(token, env.jwtSecret) as TokenPayload; }
