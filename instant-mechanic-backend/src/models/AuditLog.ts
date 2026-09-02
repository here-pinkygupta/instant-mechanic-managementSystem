import { Schema, model } from "mongoose";
const schema=new Schema({
 user:{type:Schema.Types.ObjectId,ref:"User",default:null,index:true}, action:{type:String,required:true,index:true},
 entity:{type:String,required:true,index:true}, entityId:{type:String,required:true}, metadata:{type:Schema.Types.Mixed,default:{}}
},{timestamps:true});
schema.index({createdAt:-1});
export const AuditLog=model("AuditLog",schema);
