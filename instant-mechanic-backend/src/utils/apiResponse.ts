import type { Response } from "express";
export function success<T>(res: Response, data: T, message="Request successful", status=200) {
  return res.status(status).json({ success:true, data, message });
}
export function failure(res: Response, code:string, message:string, status=400, details?:unknown) {
  return res.status(status).json({ success:false, error:{ code, message, ...(details ? {details}: {}) }});
}
