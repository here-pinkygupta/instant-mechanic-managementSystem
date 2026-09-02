import request from "supertest";
import app from "../src/app";
describe("authentication",()=>{it("rejects protected route without token",async()=>{const r=await request(app).get("/api/auth/me");expect(r.status).toBe(401);expect(r.body.success).toBe(false)});it("health is public",async()=>{const r=await request(app).get("/health");expect([200,503]).toContain(r.status);})});
