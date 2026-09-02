import type {Server as HttpServer} from "http"; import {Server} from "socket.io"; import {env} from "../config/env"; import {verifyToken} from "../utils/jwt"; import {logger} from "../utils/logger";
export let io:Server|undefined;
export function createSocketServer(server:HttpServer){
 io=new Server(server,{cors:{origin:env.frontendUrl,credentials:true}});
 io.use((socket,next)=>{try{const token=String(socket.handshake.auth?.token||socket.handshake.headers.authorization||"").replace(/^Bearer\s+/,"");if(!token) return next(new Error("Authentication required"));const p=verifyToken(token);socket.data.user=p;next()}catch{next(new Error("Invalid authentication token"))}});
 io.on("connection",socket=>{logger.info({socketId:socket.id,userId:socket.data.user?.sub},"Socket connected");socket.join(`role:${socket.data.user?.role}`);socket.on("disconnect",reason=>logger.info({socketId:socket.id,reason},"Socket disconnected"));});
 return io;
}
