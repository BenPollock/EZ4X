
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
					//TODO: change this with pinging the server
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

						//Set the buy/sell flags
						if(low_in_a_row > 2){
							flags.addPoint({
								title: "Buy",
								x: a
							});
							//buy("EURUSD", 500); //Temporary Values
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

	//Manual buy/sell controls
	$("#manualbuy").on("click", function(){
		var quantity = $("#buyamount").val();
		buy(quantity);
	});

	reloadSession();
});


function buy(quantity){
	//initiate the trade to the backend
	$.ajax({
		type: "POST",
		url: "trader/buy",
		data: {quantity: quantity},
		success: function(data){
			//TODO: update front end
			console.log("Success!!");
			updateDisplay(data);
		}
	});

}

function sell(){

}

function calcBuySell(){

}

function calcBollinger(){

}

function calcRSI(){

}

function calcMACD(){

}

//This will create a new session on button click
function initSession(){
	var cash = $("#money").val();

	//create the session
	$.ajax({
		type: "POST",
		url: "tsessions/create",
		data: {cash: cash},
		success: function(){
				updateDisplay(cash);
		}
	});

}

//Gets the most recent session on page load
function reloadSession(){

	//get the session
	$.ajax({
		type: "GET",
		url: "tsessions/latest",
		success: function(data){
			if(!(data.empty == "empty"))
				updateDisplay(data);
			else
				alert("You have no session!");
		}
	});

}

function updateDisplay(cash){
	$("#cashdisplay").html("Cash: $" + cash);
}