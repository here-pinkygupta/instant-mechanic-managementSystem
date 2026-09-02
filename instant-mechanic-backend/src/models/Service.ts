import { Schema, model } from "mongoose";
export const SERVICE_CATEGORIES=["MAINTENANCE","REPAIR","DIAGNOSTICS","TYRES","BATTERY","CLEANING"] as const;
const schema=new Schema({
 name:{type:String,required:true,unique:true,trim:true}, category:{type:String,enum:SERVICE_CATEGORIES,required:true,index:true},
 description:{type:String,required:true}, basePrice:{type:Number,required:true,min:0}, estimatedDuration:{type:Number,required:true,min:5},
 isActive:{type:Boolean,default:true,index:true}
},{timestamps:true});
schema.index({category:1,isActive:1});
export const Service=model("Service",schema);
