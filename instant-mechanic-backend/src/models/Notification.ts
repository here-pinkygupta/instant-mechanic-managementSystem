import { Schema, model } from "mongoose";
export const NOTIFICATION_TYPES=["BOOKING_CREATED","BOOKING_ASSIGNED","MECHANIC_ON_THE_WAY","BOOKING_COMPLETED","BOOKING_CANCELLED"] as const;
const schema=new Schema({
 type:{type:String,enum:NOTIFICATION_TYPES,required:true,index:true}, title:{type:String,required:true}, message:{type:String,required:true},
 booking:{type:Schema.Types.ObjectId,ref:"Booking",default:null,index:true}, read:{type:Boolean,default:false,index:true}
},{timestamps:true});
schema.index({createdAt:-1});
export const Notification=model("Notification",schema);
