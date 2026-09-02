import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { failure } from "../utils/apiResponse";
export const notFoundMiddleware:RequestHandler=(req,res)=>failure(res,"NOT_FOUND",`Route ${req.method} ${req.originalUrl} not found`,404);
export const errorMiddleware:ErrorRequestHandler=(err,req,res,_next)=>{
 console.error(err);
 if(err instanceof ZodError) return failure(res,"VALIDATION_ERROR","Request validation failed",422,err.flatten());
 if(err?.code===11000) return failure(res,"DUPLICATE_RESOURCE","A resource with the same unique value already exists",409);
 return failure(res,"INTERNAL_SERVER_ERROR",process.env.NODE_ENV==="production"?"An unexpected error occurred":(err?.message||"Unexpected error"),500);
};
