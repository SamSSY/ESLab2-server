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
})
.directive('gpsDatachart',function(){
	return {
		 restrict: 'E',
		 //transclude makes the contents of a directive with this option 
		 //have access to the scope outside of the directive rather than inside.
		 //transclude: true,
    	 scope: {},
    	 template: '<div id="gps-data-container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
    	 link: function(scope){

    	 	var socket = io();
    	 	scope.coordinatesArray = [];
    	 	scope.altitudeArray = [];

    	 	(function(){ 
    	 		socket.emit('pullGpsData',{data : null});
    	 		console.log('pullGpsData');
    	 	})();

    	 	socket.on('pushGpsData',function(data){
    	 		console.log('pushGpsData');
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
	    	 			scope.coordinatesArray.push(scope.dataArray[i].coordinates);
   	    	 			scope.altitudeArray.push(scope.dataArray[i].altitude);
						//scope.soundArray.push(parseFloat(scope.dataArray[i].soundLevel));	 			
	    	 			console.log(scope.dataArray[i]);
    	 			}
    	 		}
       	 		showGpsDataHighchart();
    	 	});

    	 	

    	 	function showGpsDataHighchart() {
				    // Give the points a 3D feel by adding a radial gradient
				    Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
				        return {
				            radialGradient: {
				                cx: 0.4,
				                cy: 0.3,
				                r: 0.5
				            },
				            stops: [
				                [0, color],
				                [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
				            ]
				        };
				    });

				    // Set up the chart
				    var chart = new Highcharts.Chart({
				        chart: {
				            renderTo: 'gps-data-container',
				            margin: 100,
				            type: 'scatter',
				            options3d: {
				                enabled: true,
				                alpha: 10,
				                beta: 30,
				                depth: 250,
				                viewDistance: 5,

				                frame: {
				                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
				                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
				                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
				                }
				            }
				        },
				        title: {
				            text: 'GPS data'
				        },
				        subtitle: {
				            text: '@NTU'
				        },
				        plotOptions: {
				            scatter: {
				                width: 10,
				                height: 10,
				                depth: 10
				            }
				        },
				        yAxis: {
				            min: 0,
				            max: 10,
				            title: null
				        },
				        xAxis: {
				            min: 0,
				            max: 10,
				            gridLineWidth: 1
				        },
				        zAxis: {
				            min: 0,
				            max: 10,
				            showFirstLabel: false
				        },
				        legend: {
				            enabled: false
				        },
				        series: [{
				            name: 'Reading',
				            colorByPoint: true,
				            data: [[1, 6, 5], [8, 7, 9], [1, 3, 4], [4, 6, 8], [5, 7, 7], [6, 9, 6], [7, 0, 5], [2, 3, 3], [3, 9, 8], [3, 6, 5], [4, 9, 4], [2, 3, 3], [6, 9, 9], [0, 7, 0], [7, 7, 9], [7, 2, 9], [0, 6, 2], [4, 6, 7], [3, 7, 7], [0, 1, 7], [2, 8, 6], [2, 3, 7], [6, 4, 8], [3, 5, 9], [7, 9, 5], [3, 1, 7], [4, 4, 2], [3, 6, 2], [3, 1, 6], [6, 8, 5], [6, 6, 7], [4, 1, 1], [7, 2, 7], [7, 7, 0], [8, 8, 9], [9, 4, 1], [8, 3, 4], [9, 8, 9], [3, 5, 3], [0, 2, 4], [6, 0, 2], [2, 1, 3], [5, 8, 9], [2, 1, 1], [9, 7, 6], [3, 0, 2], [9, 9, 0], [3, 4, 8], [2, 6, 1], [8, 9, 2], [7, 6, 5], [6, 3, 1], [9, 3, 1], [8, 9, 3], [9, 1, 0], [3, 8, 7], [8, 0, 0], [4, 9, 7], [8, 6, 2], [4, 3, 0], [2, 3, 5], [9, 1, 4], [1, 1, 4], [6, 0, 2], [6, 1, 6], [3, 8, 8], [8, 8, 7], [5, 5, 0], [3, 9, 6], [5, 4, 3], [6, 8, 3], [0, 1, 5], [6, 7, 3], [8, 3, 2], [3, 8, 3], [2, 1, 6], [4, 6, 7], [8, 9, 9], [5, 4, 2], [6, 1, 3], [6, 9, 5], [4, 8, 2], [9, 7, 4], [5, 4, 2], [9, 6, 1], [2, 7, 3], [4, 5, 4], [6, 8, 1], [3, 4, 0], [2, 2, 6], [5, 1, 2], [9, 9, 7], [6, 9, 9], [8, 4, 3], [4, 1, 7], [6, 2, 5], [0, 4, 9], [3, 5, 9], [6, 9, 1], [1, 9, 2]]
				        }]
				    });


				    // Add mouse events for rotation
				    $(chart.container).bind('mousedown.hc touchstart.hc', function (eStart) {
				        eStart = chart.pointer.normalize(eStart);

				        var posX = eStart.pageX,
				            posY = eStart.pageY,
				            alpha = chart.options.chart.options3d.alpha,
				            beta = chart.options.chart.options3d.beta,
				            newAlpha,
				            newBeta,
				            sensitivity = 5; // lower is more sensitive

				        $(document).bind({
				            'mousemove.hc touchdrag.hc': function (e) {
				                // Run beta
				                newBeta = beta + (posX - e.pageX) / sensitivity;
				                chart.options.chart.options3d.beta = newBeta;

				                // Run alpha
				                newAlpha = alpha + (e.pageY - posY) / sensitivity;
				                chart.options.chart.options3d.alpha = newAlpha;

				                chart.redraw(false);
				            },
				            'mouseup touchend': function () {
				                $(document).unbind('.hc');
				            }
				        });
				    });
			    };
			}			
    	};
});
