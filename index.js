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

io.on('connection', function(socket){
    socket.on('joined', function(name){
        socket.broadcast.emit('joined', name)
    })

    socket.on('send', function(data){
        socket.broadcast.emit('receive', data)
        
    })

    socket.on('disconnect', function(){
        console.log('disconnect')
    })
})
