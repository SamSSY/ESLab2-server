var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 8080;

app.use('/static', express.static('public'));

// GET method route
app.get('/', function (req, res) {
  fs.readFile('view/index.html', function(err, buf) {
    res.send(buf.toString());
  });
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});


io.on('connection', function (socket) {
	console.log("socket!");
    socket.emit('message', { message: 'welcome! ' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

server.listen(port, function() {
  console.log('HTTP on http://localhost:' + port +'/');
});

