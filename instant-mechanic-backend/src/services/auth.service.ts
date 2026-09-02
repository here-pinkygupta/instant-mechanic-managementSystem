import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";


export async function login(email:string,password:string){
 const user=await User.findOne({email:email.toLowerCase().trim()}).select("+passwordHash").lean();
 if(!user) throw new AuthError("INVALID_CREDENTIALS");
 if(!user.isActive) throw new AuthError("ACCOUNT_INACTIVE");
 if(!(await bcrypt.compare(password,user.passwordHash))) throw new AuthError("INVALID_CREDENTIALS");
 const safe={id:String(user._id),email:user.email,name:user.name,role:user.role};
 return {user:safe,token:signToken({sub:safe.id,email:safe.email,name:safe.name,role:safe.role})};
}
export const getMe=(id:string)=>User.findById(id).select("_id name email role isActive createdAt updatedAt").lean();


export class AuthError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new AuthError("EMAIL_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "OPERATIONS",
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};