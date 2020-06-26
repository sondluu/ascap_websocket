var express = require('express');
var app = express();
//var ws = require('./ws');
var http = require('http').createServer(app);
var io = require('socket.io')(http); 
app.use(express.static('public'));
var port = process.env.PORT || 3000;

http.listen(port,() => {
    console.log('Server running at port `+port');
});

// app.get('/', (req,res) => {
// //    res.send('<h1>Hello world</h1>');
//     res.sendFile(__dirname + '/public/index.html');
// });

io.on('connection', newConnection);

function newConnection(socket){
    console.log('new connection: ' + socket.id);
//    socket.on('person', personMsg);
    socket.on('mouse', mouseMsg);

    function mouseMsg(data){
        socket.broadcast.emit('mouse', data);
        console.log(data);
    }
}

