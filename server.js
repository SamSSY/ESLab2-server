var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/src'));

app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.redirect('/view/index.html');
});

server.listen(8080, function(){
    console.log('HTTP on http://localhost:8080/');
});
