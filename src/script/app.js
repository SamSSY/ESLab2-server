angular.module('tesselApp',[])
.controller('appCtrl', ['$scope', function($scope){
	//window.onload = function() {
 	$scope.data = 0 ;
    var messages = [];
    var socket = io.connect('http://localhost:8080');

    socket.on('message', function (data) {
        	$scope.$apply(function () {
				$scope.data = data;
        	});
            console.log("data: ", data);
    });
 
	//}		
}]);