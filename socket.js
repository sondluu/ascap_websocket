var express = require('express');
var app = express();
//var ws = require('./ws');
var http = require('http').createServer(app);
var io = require('socket.io')(http);  // create socket connection 
app.use(express.static('public')); //this is to tell which folder to look for the front end files which is called "public" folder
var port = process.env.PORT || 3000;

http.listen(port,() => {
    console.log('Server running at port `+port');   
});

// app.get('/', (req,res) => {
// //    res.send('<h1>Hello world</h1>');
//     res.sendFile(__dirname + '/public/index.html');
// });

io.on('connection', newConnection); // server listens to anyone connecting 

function newConnection(socket){
    console.log('new connection: ' + socket.id);
//    socket.on('person', personMsg);
    socket.on('mouse', mouseMsg);  //event listener to receive the "mouse" from the client, then do something with it which in this case is "mouseMsg" 

    function mouseMsg(data){    //that "mouseMsg" is another function to send "data" back out to the other broasers
        socket.broadcast.emit('mouse', data);  //send the "data" out to all ther other browsers 
        console.log(data);
    }
}

