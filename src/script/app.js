angular.module('tesselApp',[])
.controller('appCtrl', ['$scope', function($scope){
	//window.onload = function() {
 	$scope.data = 0 ;
    var messages = [];
    var socket = io();

    socket.on('postData', function (data) {
        	$scope.$apply(function () {
				$scope.data = data;
        	});
            console.log("data: ", data);
    });
	//}		
}])
.directive('accelerometerDatachart',function(){
	return{
		 restrict: 'E',
		 //transclude makes the contents of a directive with this option 
		 //have access to the scope outside of the directive rather than inside.
		 //transclude: true,
    	 scope: {},
    	 template: '<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
    	 link: function(scope){

    	 	var socket = io();
    	 	scope.dataArray = [];
    	 	scope.xArray = [];
    	 	scope.yArray = [];
    	 	scope.zArray = [];

    	 	(function(){ 
    	 		socket.emit('pullAccelData',{data : null});
    	 		console.log('pullAccelData');
    	 	})();

    	 	socket.on('pushAccelData',function(data){
    	 		console.log('pushAccelData');
    	 		console.log(typeof(data));
    	 		console.log(data);
    	 		console.log(data.split("\n"));
    	 		scope.dataArray = data.split("\n");
    	 		//delete scope.dataArray[scope.dataArray.length];
    	 		//scope.dataArray.splice(scope.dataArray.length - 1, 1);
    	 		console.log(scope.dataArray);
    	 		for(var i = 0; i < scope.dataArray.length; ++i){
    	 			if(scope.dataArray[i] == ""){
    	 				scope.dataArray.splice(i, 1);
    	 			}
    	 			else{
    	 				scope.dataArray[i] = JSON.parse(scope.dataArray[i]);
	    	 			scope.xArray.push(parseFloat(scope.dataArray[i].x));
						scope.yArray.push(parseFloat(scope.dataArray[i].y));
						scope.zArray.push(parseFloat(scope.dataArray[i].z));
	    	 			
	    	 			console.log(scope.dataArray[i]);
	    	 			//console.log(scope.xArray);
    	 			}
    	 		}
    	 		console.log(scope.xArray);
    	 		console.log(scope.yArray);
    	 		console.log(scope.zArray);
    	 		showAccelDataHighchart();
    	 	});

    	 	

    	 	function showAccelDataHighchart() {
			    $('#container').highcharts({
			        chart: {
			            type: 'spline'
			        },
			        title: {
			            text: 'accelerometer data'
			        },
			        subtitle: {
			            text: 'x ,y ,z'
			        },
			        xAxis: {
			            type: 'linear',
			            title: {
			                text: 'time'
			            }
			        },
			        yAxis: {
			            title: {
			                text: 'intensity'
			            },
			            min: -1
			        },
			        tooltip: {
			            headerFormat: '<b>{series.name}</b><br>',
			            pointFormat: '{point.y:.2f} '
			        },

			        plotOptions: {
			            spline: {
			                marker: {
			                    enabled: true
			                }
			            }
			        },

			        series: [{
			            name: 'x',
			            data: scope.xArray
			        }, {
			            name: 'y',
			            data: scope.yArray
			        }, {
			            name: 'z',
			            data: scope.zArray
			        }]
			    });
			};
			
    	 }
	};
});