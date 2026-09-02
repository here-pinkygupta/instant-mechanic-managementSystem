import { Schema, model } from "mongoose";
const schema=new Schema({
 customerId:{type:String,required:true,unique:true,index:true},
 name:{type:String,required:true,trim:true,index:true}, email:{type:String,required:true,lowercase:true,trim:true,index:true},
 phone:{type:String,required:true,trim:true,index:true}, address:{type:String,required:true}, city:{type:String,required:true,default:"Delhi"},
 totalBookings:{type:Number,default:0,min:0}, totalSpent:{type:Number,default:0,min:0}
},{timestamps:true});
schema.index({name:1}); schema.index({email:1,phone:1});
export const Customer=model("Customer",schema);
