import { server } from "./http";
import './websocket/ChatService'

server.listen(3000, () => console.log('🚀 HTTP Server Running on Port 3000'))