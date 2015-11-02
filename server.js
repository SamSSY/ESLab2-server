var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var port = 8080;

//var io = require('socket.io')(server);
var io = require('socket.io')
			.listen(app.listen(port, function(){
				console.log('HTTP on http://localhost:8080/');
			}));

app.use(express.static(__dirname + '/src'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// GET method route
app.get('/', function (req, res) {

  console.log("get!");
  fs.readFile('src/view/index.html', function(err, buf) {
    res.send(buf.toString());
  });
});

var x = 0;
var y = 0;
var z = 0;


io.sockets.on('connection', function (socket) {
	console.log("socket!");

	// POST method route
	app.post('/', function (req, res) {
		console.log("post!");
		x = req.body.x;
		y = req.body.y;
		z = req.body.z;

		io.sockets .emit('message', { x: x, y:y, z:z });
	});

    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
