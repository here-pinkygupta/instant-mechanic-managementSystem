import type { UserRole } from "../models/User";
export interface AuthUser { id:string; email:string; name:string; role:UserRole; }
declare global { namespace Express { interface Request { user?:AuthUser; } } }
