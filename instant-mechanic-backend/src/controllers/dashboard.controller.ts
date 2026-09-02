import type {RequestHandler} from "express";
import {dashboard} from "../services/dashboard.service";
import {success} from "../utils/apiResponse";
import {z} from "zod";
export const getDashboard:RequestHandler=async(req,res)=>{const range=z.enum(["7d","30d","90d"]).default("30d").parse(req.query.range);return success(res,await dashboard(range),"Dashboard retrieved successfully")};
