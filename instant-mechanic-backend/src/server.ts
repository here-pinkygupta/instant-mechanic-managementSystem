import {createServer} from "http"; import app from "./app"; import {connectDatabase} from "./config/database"; import {env} from "./config/env"; import {createSocketServer} from "./sockets/io";
const server=createServer(app);
async function start(){await connectDatabase();createSocketServer(server);server.listen(env.port,"0.0.0.0",()=>console.log(`Instant Mechanic API listening on ${env.port}`));}
function shutdown(signal:string){console.log(`${signal} received`);server.close(()=>process.exit(0));}
process.on("SIGTERM",()=>shutdown("SIGTERM"));process.on("SIGINT",()=>shutdown("SIGINT"));start().catch(e=>{console.error("Startup failed",e);process.exit(1)});
