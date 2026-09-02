import { Schema, model } from "mongoose";
export const MECHANIC_STATUSES=["AVAILABLE","BUSY","ON_THE_WAY","OFFLINE"] as const;
export type MechanicStatus=typeof MECHANIC_STATUSES[number];
const loc=new Schema({latitude:{type:Number,required:true},longitude:{type:Number,required:true}},{_id:false});
const schema=new Schema({
 mechanicId:{type:String,required:true,unique:true,index:true}, name:{type:String,required:true,trim:true},
 email:{type:String,required:true,unique:true,lowercase:true}, phone:{type:String,required:true}, avatar:{type:String,default:""},
 status:{type:String,enum:MECHANIC_STATUSES,required:true,index:true}, specializations:{type:[String],default:[]},
 location:{type:loc,required:true}, jobsCompleted:{type:Number,default:0}, rating:{type:Number,default:4.5,min:0,max:5},
 currentBooking:{type:Schema.Types.ObjectId,ref:"Booking",default:null}, lastBooking:{type:Schema.Types.ObjectId,ref:"Booking",default:null}
},{timestamps:true});
schema.index({status:1,specializations:1});
export const Mechanic=model("Mechanic",schema);
