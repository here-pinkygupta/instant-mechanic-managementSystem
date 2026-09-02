import { Schema, model } from "mongoose";
export const BOOKING_STATUSES=["PENDING","ASSIGNED","MECHANIC_ON_THE_WAY","IN_PROGRESS","COMPLETED","CANCELLED"] as const;
export type BookingStatus=typeof BOOKING_STATUSES[number];
const vehicle=new Schema({
 make:{type:String,required:true}, model:{type:String,required:true}, year:{type:Number,required:true},
 registrationNumber:{type:String,required:true,uppercase:true,index:true}, fuelType:{type:String,required:true,enum:["PETROL","DIESEL","CNG","ELECTRIC","HYBRID"]}
},{_id:false});
const location=new Schema({latitude:{type:Number,required:true},longitude:{type:Number,required:true}},{_id:false});
const schema=new Schema({
 bookingId:{type:String,required:true,unique:true,index:true}, customer:{type:Schema.Types.ObjectId,ref:"Customer",required:true,index:true},
 vehicle:{type:vehicle,required:true}, service:{type:Schema.Types.ObjectId,ref:"Service",required:true,index:true},
 mechanic:{type:Schema.Types.ObjectId,ref:"Mechanic",default:null,index:true}, status:{type:String,enum:BOOKING_STATUSES,required:true,index:true},
 amount:{type:Number,required:true,min:0}, scheduledAt:{type:Date,required:true,index:true}, startedAt:{type:Date,default:null},
 completedAt:{type:Date,default:null}, cancelledAt:{type:Date,default:null}, notes:{type:String,default:"",maxlength:2000},
 pickupAddress:{type:String,required:true}, location:{type:location,required:true}
},{timestamps:true});
schema.index({status:1,scheduledAt:-1}); schema.index({createdAt:-1}); schema.index({customer:1,createdAt:-1}); schema.index({mechanic:1,scheduledAt:-1});
export const Booking=model("Booking",schema);
