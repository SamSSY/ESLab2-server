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
var degrees = 0;
var humidity = 0;
var lightLevel = 0;
var soundLevel = 0;
var dataFromDb = null; 
var coordinates = {};
var altitude = {};


app.use(express.static(__dirname + '/src'));
//app.use(express.logger('dev'));

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
		console.log(req.body);

		if( req.body.x !== undefined ){
			x = req.body.x;
			y = req.body.y;
			z = req.body.z;
			io.sockets.emit('postData', { "x": x, "y":y, "z":z });
			saveData('accel-data.db', { "x": x, "y":y, "z":z });
			res.send("get post!");
		}
		else if( req.body.degrees !== undefined){
			degrees = req.body.degrees;
			humidity = req.body.humidity;
			io.sockets.emit('postClimateData', {"degrees": degrees, "humidity": humidity});
			saveData('climate-data.db', {"degrees": degrees, "humidity": humidity});
			res.send("get post!");
		}
		else if ( req.body.lightLevel !== undefined){
			lightLevel = req.body.lightLevel;
			soundLevel = req.body.soundLevel;
			io.sockets.emit('postAmbientData', {"lightLevel": lightLevel, "soundLevel": soundLevel});
			saveData('ambient-data.db', {"lightLevel": lightLevel, "soundLevel": soundLevel});
			res.send("get post!");
		}
		else if ( req.body[1].timestamp !== undefined){
			//coordinates = req.body.coordinates;
			//altitude = req.body.altitude;

			io.sockets.emit('postGpsData', req.body);
			saveData('gps-data.db', req.body);
			res.send("get post!");
		}

	});

    socket.on('pullAccelData', function (data) {
    	console.log('pullAccelData');
        readData('accel-data.db',function(){
        	 console.log("push!");
        	 io.sockets.emit('pushAccelData', dataFromDb);
        });
    });

    socket.on('pullClimateData', function (data) {
    	console.log('pullClimateData');
        readData('climate-data.db',function(){
        	 console.log("push!");
        	 io.sockets.emit('pushClimateData', dataFromDb);
        });
    });

    socket.on('pullAmbientData', function (data) {
    	console.log('pullAmbientData');
        readData('ambient-data.db',function(){
        	 console.log("push!");
        	 io.sockets.emit('pushAmbientData', dataFromDb);
        });
    });

    socket.on('pullGpsData', function (data) {
    	console.log('pullGpsData');
        readData('gps-data.db',function(){
        	 console.log("push!");
        	 io.sockets.emit('pushGpsData', dataFromDb);
        });
    });


});	



//

function readData(file, callback){
	fs.readFile(file, 'utf8', function (err, data) {
  		if (err) throw err;
  		console.log("readdata!");
  		dataFromDb = data;
  		console.log("dataFromDb", dataFromDb);
  		callback();
	});
}

function saveData(file, data){
	console.log(data);
	fs.appendFile(file,'\n' + JSON.stringify(data), function(err){
		// body
		if (err) throw err;
    	console.log('append success!');
	})
}









