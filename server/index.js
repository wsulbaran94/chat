const express = require('express');
require('dotenv').config()

const app = require('express')()
const cors = require("cors");


const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const { API_PORT } = require('./config/config');
const port = API_PORT || process.env.PORT;

require("./config/database").connect();

app.use(cors());
const { saveHistory, saveRoom } = require('./controllers/Chat/ChatController')

io.on('connection', socket => {
	console.log(`User Connected: ${socket.id}`);

  socket.on("join-room", (data) => {
    socket.join(data.room);
    saveRoom(data)
    console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
  });

  socket.on("send-message", (data) => {
    socket.to(data.room).emit("receive-message", data);
    saveHistory(data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
})

nextApp.prepare().then(() => {
	const authRouter = require("./routes/auth")
  const chatRouter = require("./routes/chat")

  app.use(express.json());
  
  app.use("/auth", authRouter)
  app.use("/chat", chatRouter)

	app.get('*', (req, res) => {
		return nextHandler(req, res)
	})

	server.listen(port, (err) => {
		if (err) process.exit(0)
		console.log(`> Ready on http://localhost:${port}`)
	})
})