import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase() {
  mongoose.connection.on("error", (err) => console.error("MongoDB error", err));
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
}
export function databaseReady() { return mongoose.connection.readyState === 1; }
export async function disconnectDatabase() { await mongoose.disconnect(); }
