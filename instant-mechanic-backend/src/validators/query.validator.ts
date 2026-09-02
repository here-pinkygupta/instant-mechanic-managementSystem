import { z } from "zod";
export const listQuery=z.object({
 page:z.coerce.number().int().min(1).default(1), limit:z.coerce.number().int().min(1).max(100).default(20),
 search:z.string().trim().optional(), status:z.string().optional(), mechanic:z.string().optional(), service:z.string().optional(),
 serviceCategory:z.string().optional(), dateFrom:z.coerce.date().optional(), dateTo:z.coerce.date().optional(),
 sortBy:z.string().default("scheduledAt"), sortOrder:z.enum(["asc","desc"]).default("desc")
});
