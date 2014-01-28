
$(function() {
	Highcharts.setOptions({
		global : {
			useUTC : false
		}
	});
	var EUR = 13793;
	// Create the chart
	$('#container').highcharts('StockChart', {
		chart : {
			events : {
				load : function() {

					// set up the updating of the chart each second
					var series = this.series[0];
					var flags = this.series[1];
					var low_in_a_row = 0;
					var up_in_a_row = 0;
					setInterval(function() {
						var a = (new Date()).getTime(); // current time

						var change = Math.floor(Math.random() * 3) - 1;
						y = EUR + change;
						EUR = y;

						if(change < 0){
							low_in_a_row++;
							up_in_a_row = 0;
						}else if (change > 0){
							up_in_a_row++;
							low_in_a_row = 0;
						}
						
						series.addPoint([a, y], true, true);
						if(low_in_a_row > 2){
							flags.addPoint({
								title: "Buy",
								x: a
							});
							buy();
						}
						if(up_in_a_row > 2){
							flags.addPoint({
								title: "Sell",
								x: a
							});
							sell();
						}
					}, 1000);
				}
			}
		},
		
		rangeSelector: {
			buttons: [{
				count: 1,
				type: 'minute',
				text: '1M'
			}, {
				count: 5,
				type: 'minute',
				text: '5M'
			}, {
				type: 'all',
				text: 'All'
			}],
			inputEnabled: false,
			selected: 0
		},
		
		title : {
			text : 'EUR/USD Fake Data'
		},
		
		exporting: {
			enabled: false
		},
		
		series : [{
			name : 'Random data',
			data : (function() {
				// generate an array of random data
				var data = [], time = (new Date()).getTime(), i;

				for( i = -999; i <= 0; i++) {
					data.push([
						time + i * 1000,
						//Math.round(Math.random() * 100)
						EUR
					]);
					EUR += Math.floor(Math.random() * 3) - 1;
				}
				return data;
			})(),
			id: 'dataseries'
		},{
			type: 'flags',
			data: [],
			onSeries: 'dataseries',
			shape: 'circlepin',
			width: 30
		},
		{
			name : 'Random data 2',
			data : (function() {
			// generate an array of random data
			var data = [], time = (new Date()).getTime(), i;

			for( i = -999; i <= 0; i++) {
				data.push([
					time + i * 1000,
					//Math.round(Math.random() * 100)
					EUR
				]);
				EUR += Math.floor(Math.random() * 3) - 1;
			}
			return data;
			})(),
			id: 'dataseries2'
		}]
	});
	$('.slider').slider();
});

function buy(){
	//alert("buy");
}

function sell(){

}

function calcBollinger(){

}

function calcRSI(){

}

function calcMACD(){

}