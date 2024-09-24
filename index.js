const functions = require('firebase-functions')
const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const cors = require('cors')
const router = require('./router')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')
const server = http.createServer(app)
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(router)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
})


io.on("connection", (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        // Why two objectValues? coz addUser can return 2 object properties
        if (!name || !room) {
            return callback('username and room are required!')
        }
        const user = addUser({ id: socket.id, name, room })
        console.log(user);



        // emit From backend to the front end
        socket.join(user.room)
        socket.emit('message', { user: 'admin', text: `${user.name} , welcome to the room ${user.room}` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!` })
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
        
        
        callback()

    })

    // eexpect from the front-end
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        if(user){
            io.to(user.room).emit('message', { user: user.name, text: message })

        }
        io.to(user.room).emit('roomData', { room:user.room, users:getUsersInRoom(user.room) })

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit("message", { user: "admin", text: `${user.name} has left` })
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        }
    })
});





server.listen(port, () => {
    console.log(`Server has started on port ${port}`);
})

exports.app = functions.https.onRequest(app)