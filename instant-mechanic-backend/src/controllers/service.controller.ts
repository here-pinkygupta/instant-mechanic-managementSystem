import type {RequestHandler} from "express"; import {Service} from "../models/Service"; import {success} from "../utils/apiResponse";
export const list:RequestHandler=async(req,res)=>success(res,await Service.find({isActive:true}).sort({category:1,name:1}).lean(),"Services retrieved successfully");
