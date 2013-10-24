
$(function() {
	Highcharts.setOptions({
		global : {
			useUTC : false
		}
	});
	
	// Create the chart
	$('#container').highcharts('StockChart', {
		chart : {
			events : {
				load : function() {

					// set up the updating of the chart each second
					var series = this.series[0];
					var flags = this.series[1];
					setInterval(function() {
						var a = (new Date()).getTime(), // current time
						y = Math.round(Math.random() * 100);
						series.addPoint([a, y], true, true);
						if(y < 20){
							flags.addPoint({
								title: "Buy",
								x: a
							});
							buy();
						}
						if(y > 80){
							flags.addPoint({
								title: "Sell",
								x: a
							});
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
			text : 'Live random data'
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
						Math.round(Math.random() * 100)
					]);
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
		}]
	});
	$('.slider').slider();
});

function buy(){
	//alert("buy");
}