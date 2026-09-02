import { z } from "zod";
export const statusSchema=z.object({status:z.enum(["PENDING","ASSIGNED","MECHANIC_ON_THE_WAY","IN_PROGRESS","COMPLETED","CANCELLED"])});
export const createBookingSchema=z.object({
 customerId:z.string().min(1), serviceId:z.string().min(1), mechanicId:z.string().optional().nullable(),
 vehicle:z.object({make:z.string().min(1),model:z.string().min(1),year:z.number().int().min(1980).max(2100),registrationNumber:z.string().min(2),fuelType:z.enum(["PETROL","DIESEL","CNG","ELECTRIC","HYBRID"])}),
 scheduledAt:z.coerce.date(), amount:z.number().nonnegative().optional(), pickupAddress:z.string().min(3), location:z.object({latitude:z.number(),longitude:z.number()}), notes:z.string().max(2000).optional()
});
export const updateBookingSchema=z.object({mechanicId:z.string().nullable().optional(),scheduledAt:z.coerce.date().optional(),amount:z.number().nonnegative().optional(),pickupAddress:z.string().min(3).optional(),notes:z.string().max(2000).optional()});
