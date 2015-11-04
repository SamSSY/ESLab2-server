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
    	 template: '<div id="accel-data-container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
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
			    $('#accel-data-container').highcharts({
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
})
.directive('climateDatachart',function(){
	return{
		 restrict: 'E',
		 //transclude makes the contents of a directive with this option 
		 //have access to the scope outside of the directive rather than inside.
		 //transclude: true,
    	 scope: {},
    	 template: '<div id="climate-data-container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
    	 link: function(scope){

    	 	var socket = io();
    	 	scope.dataArray = [];
    	 	scope.tempArray = [];
    	 	scope.humidityArray = [];

    	 	(function(){ 
    	 		socket.emit('pullClimateData',{data : null});
    	 		console.log('pullClimateData');
    	 	})();

    	 	socket.on('pushClimateData',function(data){
    	 		console.log('pushClimateData');
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
	    	 			scope.tempArray.push(parseFloat(scope.dataArray[i].degrees));
						scope.humidityArray.push(parseFloat(scope.dataArray[i].humidity));
	    	 			
	    	 			console.log(scope.dataArray[i]);
	    	 			//console.log(scope.xArray);
    	 			}
    	 		}
       	 		showClimateDataHighchart();
    	 	});

    	 	

    	 	function showClimateDataHighchart() {
			    $('#climate-data-container').highcharts({
				 		chart: {
				            zoomType: 'xy'
				        },
				        title: {
				            text: 'climate data'
				        },
				        subtitle: {
				            text: '@NTUEE BL building '
				        },
				        xAxis:{
				        	 type: 'linear',
							 title: {
							    text: 'time'
							 }
				        },
				        yAxis: [{ // Primary yAxis
				            labels: {
				                format: '{value}°F',
				                style: {
				                    color: Highcharts.getOptions().colors[2]
				                }
				            },
				            title: {
				                text: 'Temperature'
				            },
				            opposite: true

				        }, { // Secondary yAxis
				            gridLineWidth: 0,
				            title: {
				                text: 'Humidity',
				                style: {
				                    color: Highcharts.getOptions().colors[0]
				                }
				            },
				            labels: {
				                format: '{value} %RH',
				                style: {
				                    color: Highcharts.getOptions().colors[0]
				                }
				            }

				        }],
				        tooltip: {
				            shared: true
				        },
				        legend: {
				            layout: 'vertical',
				            align: 'left',
				            x: 80,
				            verticalAlign: 'top',
				            y: 55,
				            floating: true,
				            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				        },
				        series: [{
				            name: 'Humidity',
				            type: 'column',
				            yAxis: 1,
				            data: scope.humidityArray,
				            tooltip: {
				                valueSuffix: ' %RH'
				            }

				        }, {
				            name: 'Temperature',
				            type: 'spline',
				            data: scope.tempArray,
				            tooltip: {
				                valueSuffix: ' °F'
				            }
				        }]
				    });
			    };
			}			
    	};
})
.directive('ambientDatachart',function(){
	return{
		 restrict: 'E',
		 //transclude makes the contents of a directive with this option 
		 //have access to the scope outside of the directive rather than inside.
		 //transclude: true,
    	 scope: {},
    	 template: '<div id="ambient-data-container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
    	 link: function(scope){

    	 	var socket = io();
    	 	scope.dataArray = [];
    	 	scope.lightArray = [];
    	 	scope.soundArray = [];

    	 	(function(){ 
    	 		socket.emit('pullAmbientData',{data : null});
    	 		console.log('pullAmbientData');
    	 	})();

    	 	socket.on('pushAmbientData',function(data){
    	 		console.log('pushAmbientData');
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
	    	 			scope.lightArray.push(parseFloat(scope.dataArray[i].lightLevel));
						scope.soundArray.push(parseFloat(scope.dataArray[i].soundLevel));
	    	 			
	    	 			console.log(scope.dataArray[i]);
    	 			}
    	 		}
       	 		showAmbientDataHighchart();
    	 	});

    	 	

    	 	function showAmbientDataHighchart() {
			    $('#ambient-data-container').highcharts({
				 		chart: {
				            zoomType: 'xy'
				        },
				        title: {
				            text: 'ambient data'
				        },
				        subtitle: {
				            text: 'with cell phone light app/ hand claps '
				        },
				        xAxis:{
				        	 type: 'linear',
							 title: {
							    text: 'time'
							 }
				        },
				        yAxis: [{ // Primary yAxis
				            labels: {
				                format: '{value}',
				                style: {
				                 //   color: Highcharts.getOptions().colors[2]
				                }
				            },
				            title: {
				                text: 'Light level'
				            },
				            opposite: true

				        }, { // Secondary yAxis
				            gridLineWidth: 0,
				            title: {
				                text: 'Sound level',
				                style: {
				                  //  color: Highcharts.getOptions().colors[0]
				                }
				            },
				            labels: {
				                format: '{value}',
				                style: {
				                   // color: Highcharts.getOptions().colors[0]
				                }
				            }

				        }],
				        tooltip: {
				        	crosshairs: true, 
				            shared: true
				        },
				        legend: {
				            layout: 'vertical',
				            align: 'left',
				            x: 80,
				            verticalAlign: 'top',
				            y: 55,
				            floating: true,
				            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				        },
				        series: [{
				            name: 'light level',
				            //type: 'spline',
				            yAxis: 1,
				            data: scope.lightArray,
				            //tooltip: {
				            //    valueSuffix: ' %RH'
				            //}

				        }, {
				            name: 'sound level',
				            //type: 'spline',
				            data: scope.soundArray,
				            //tooltip: {
				            //    valueSuffix: ' °F'
				            //}
				        }]
				    });
			    };
			}			
    	};
});
