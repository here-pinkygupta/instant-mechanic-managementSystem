import rateLimit from "express-rate-limit";
export const apiRateLimit=rateLimit({windowMs:15*60*1000,max:300,standardHeaders:true,legacyHeaders:false,message:{success:false,error:{code:"RATE_LIMITED",message:"Too many requests, please try again later"}}});
export const authRateLimit=rateLimit({windowMs:15*60*1000,max:20,standardHeaders:true,legacyHeaders:false});
