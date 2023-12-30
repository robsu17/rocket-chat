import 'reflect-metadata';
import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const app = express()

mongoose.connect('mongodb://localhost/rocketsocket', {
  serverSelectionTimeoutMS: 40000
})

const server = createServer(app)

app.use(express.static(path.join(__dirname, '..', 'public')))

const io = new Server(server)

io.on('connection', (socket) => {
  console.log('Socket', socket.id)
})

app.get('/', (request, response) => {
  return response.json({
    message: "Hello Websocket"
  })
})

export { server, io }