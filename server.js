var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = 8080;

app.use(express.static(__dirname + '/src'));

// GET method route
app.get('/', function (req, res) {
  //res.send('GET request to the homepage');
  console.log("get!");
  res.redirect('/view/index.html');
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});


var io = require('socket.io')
			.listen(app.listen(port, function(){
				console.log('HTTP on http://localhost:8080/');
			}));

io.sockets.on('connection', function (socket) {
	console.log("socket!");
    socket.emit('message', { message: 'welcome! ' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});



/*
server.listen(8080, function(){
    console.log('HTTP on http://localhost:8080/');
});
*/