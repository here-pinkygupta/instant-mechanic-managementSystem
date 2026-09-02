import type { RequestHandler } from "express";
import { User } from "../models/User";
import { failure } from "../utils/apiResponse";
import { verifyToken } from "../utils/jwt";
export const requireAuth:RequestHandler=async(req,res,next)=>{
 try {
  const header=req.headers.authorization;
  if(!header?.startsWith("Bearer ")) return failure(res,"UNAUTHORIZED","Authentication token is required",401);
  const p=verifyToken(header.slice(7).trim());
  const user=await User.findById(p.sub).lean();
  if(!user || !user.isActive) return failure(res,"UNAUTHORIZED","User is inactive or no longer exists",401);
  req.user={id:String(user._id),email:user.email,name:user.name,role:user.role};
  next();
 } catch { return failure(res,"UNAUTHORIZED","Invalid or expired authentication token",401); }
};
export const requireRoles=(...roles:Array<"ADMIN"|"OPERATIONS">):RequestHandler=>(req,res,next)=>{
 if(!req.user) return failure(res,"UNAUTHORIZED","Authentication token is required",401);
 if(!roles.includes(req.user.role)) return failure(res,"FORBIDDEN","You do not have permission to perform this action",403);
 next();
};
