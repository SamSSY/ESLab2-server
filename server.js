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

var x = 0;
var y = 0;
var z = 0;
var dataFromDb = null; 



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

io.sockets.on('connection', function (socket) {
	console.log("socket!");

	// POST method route
	app.post('/', function (req, res) {
		console.log("post!");
		x = req.body.x;
		y = req.body.y;
		z = req.body.z;
		io.sockets.emit('postData', { "x": x, "y":y, "z":z });
		saveData('accel-data.db', { "x": x, "y":y, "z":z });
		res.send("get post!");
	});

    socket.on('pullAccelData', function (data) {
    	//console.log('pullAccelData');
        readData('accel-data.db',function(){
        	 //console.log("push!");
        	 io.sockets.emit('pushAccelData', dataFromDb);
        });
    });
});



//

function readData(file, callback){
	fs.readFile(file, 'utf8', function (err, data) {
  		if (err) throw err;
  		//console.log("readdata!");
  		dataFromDb = data;
  		//console.log("dataFromDb", dataFromDb);
  		callback();
	});
}

function saveData(file, data){
	console.log(data);
	fs.appendFile(file, JSON.stringify(data)+ '\n', function(err){
		// body
		if (err) throw err;
    	console.log('append success!');
	})
}









