var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html');
});

io.on('connection', function (socket) {
  app.post('/', function (req, res) {
		console.log("!!!");

		 socket.emit('news', { hello: 'world' });

	});


  socket.on('my other event', function (data) {
    console.log(data);
  });
});