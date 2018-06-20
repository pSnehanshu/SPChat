const express = require('express')
const socketio = require('socket.io')

const port = 9001

//Setup
const app = express()
const server = app.listen(port, () => console.log('SPChat running at port '+port) )

//Static files
app.use(express.static('static'))


//Socket
const io = socketio(server)

/**
 * A dictionary mapping socket ids to names
 * e.g.
 * {
 *    <socket.id>: <name>
 * }
 */
var users = {}


io.on('connection', function(socket){
    socket.on('joined', function(name){
        users[socket.id] = name
        socket.broadcast.emit('joined', name)
    })

    socket.on('send', function(data){
        socket.broadcast.emit('receive', data)
        
    })

    socket.on('disconnect', function(){
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
})
