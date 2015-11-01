window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:8080');
    //var content = document.getElementById("content");
 
    socket.on('message', function (data) {
        /*if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }*/
            console.log("data: ", data);
    });
 
}