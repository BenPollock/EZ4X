var MACD_data;
var MACD_signal; //yes, a global variable, sue me


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
					var series2 = this.series[2];
					var low_in_a_row = 0;
					var up_in_a_row = 0;
					//This updates the chart
					setInterval(function() {
						var a = (new Date()).getTime(); // current time

						var change = Math.floor(Math.random() * 3) - 1;
						y = EUR + change;
						EUR = y;

						$.ajax({
							type: "GET",
							dataType: 'json',
							url: "http://ez4x-rates.herokuapp.com/Convert?symbol=EURUSD",
							success: function(data){
								var bidstring = data.Bid.toString();
								var askstring = data.Ask.toString();
								//Remove the demical, as the quotes are stored as integers
								//Also drop the last decimal, usually only goes up until 4 demicals
								bidstring = bidstring.substring(0, 1) + bidstring.substring(2, 6);
								askstring = askstring.substring(0, 1) + askstring.substring(2, 6);

								//Check to see if a 0 was left off by the API (leaves off least significant 0's)
								if(bidstring.length < 5)
									bidstring = bidstring + "0";
								if (askstring.length < 5)
									askstring = askstring + "0";

								var bidint = parseInt(bidstring);
								var askint = parseInt(askstring);

								series.addPoint([a, askint], true, true);
								series2.addPoint([a, bidint], true, true);


							}
						});

						//series.addPoint([a, y], true, true);
						//series2.addPoint([a, y-2], true, true);

						calcBuySell (MACD_data, MACD_signal);




						//Set the buy/sell flags
						/*if(low_in_a_row > 2){
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
							//sell();
						}*/
					}, 5000);
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
			text : 'EUR/USD REAL!! Data'
		},
		
		exporting: {
			enabled: false
		},

		yAxis: [{
                title: {
                    text: 'Price'
                },
                height: 200,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            }, {
                title: {
                    text: 'MACD'
                },
                top: 300,
                height: 50,
                offset: 0,
                lineWidth: 2
            },
            {
            	title: {
            		text: 'RSI'
            	},
            	top: 350,
            	height: 50,
            	offset: 0,
            	lineWidth: 2
            }],
		
		series : [{
			name : 'Ask',
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
			name : 'Bid',
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
		},
		{
			name : 'Bollinger Upper Ask',
			linkedTo: 'dataseries',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'bollingerUpper',
            dashStyle: 'Dash',
			id: 'bollingerupperask'
		},
		{
			name : 'Bollinger Lower Ask',
			linkedTo: 'dataseries',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'bollingerLower',
            dashStyle: 'Dash',
			id: 'bollingerlowerask'
		},
		{
			name : 'Bollinger Upper Bid',
			linkedTo: 'dataseries2',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'bollingerUpper',
            dashStyle: 'Dash',
			id: 'bollingerupperbid'
		},
		{
			name : 'Bollinger Lower Bid',
			linkedTo: 'dataseries2',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'bollingerLower',
            dashStyle: 'Dash',
			id: 'bollingerlowerbid'
		},
		{
			name : 'MACD',
            linkedTo: 'dataseries',
            yAxis: 1,
            showInLegend: true,
            type: 'trendline',
            algorithm: 'MACD'

        }, {
            name : 'Signal line',
            linkedTo: 'dataseries',
            yAxis: 1,
            showInLegend: true,
            type: 'trendline',
            algorithm: 'signalLine'

        }, {
            name: 'Histogram',
            linkedTo: 'dataseries',
            yAxis: 1,
            showInLegend: true,
            type: 'histogram'
        },
        {
        	name : 'RSI',
			data : (function() {
			// generate an array of random data
			var data = [], time = (new Date()).getTime(), i;

			for( i = -999; i <= 0; i++) {
				data.push([
					time + i * 1000,
					//Math.round(Math.random() * 100)
					50
				]);
			}
			return data;
			})(),
			yAxis: 2,
			id: 'rsi',
			showInLegend: true
        }]
	});
	$('.slider').slider();

	//Manual buy/sell controls
	$("#manualbuy").on("click", function(){
		var quantity = $("#buyamount").val();
		buy(quantity);
	});
	$("#manualsell").on("click", function(){
		var quantity = $("#buyamount").val();
		sell(quantity);
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
			var dataratedecimal = data.rate.toString();
			dataratedecimal = dataratedecimal.substring(0, dataratedecimal.length-4) + "." + dataratedecimal.substring(dataratedecimal.length-4, dataratedecimal.length);
			$("#tradealert").html("Manual Trade Executed: Buy " + quantity + " EUR @ " + dataratedecimal + "USD");
			updateDisplay(data.cash, data.position);
		}
	});

}

function sell(quantity){
	//initiate the trade to the backend
	var quantitynegative = parseInt(quantity);
	quantitynegative = quantitynegative * -1;
	$.ajax({
		type: "POST",
		url: "trader/buy",
		data: {quantity: quantitynegative},
		success: function(data){
			var dataratedecimal = data.rate.toString();
			dataratedecimal = dataratedecimal.substring(0, dataratedecimal.length-4) + "." + dataratedecimal.substring(dataratedecimal.length-4, dataratedecimal.length);
			$("#tradealert").html("Manual Trade Executed: Sell " + quantity + " EUR @ " + dataratedecimal + "USD");
			updateDisplay(data.cash, data.position);
		}
	});
}

//Currently only using MACD
function calcBuySell(MACD_data, MACD_signal){
	var latestdata = parseInt(MACD_data[999][1]);
	var latestsignal = parseInt(MACD_signal[999][1]);

	//Check for buy
	if (latestdata < 0 && latestsignal < latestdata)
		buy(1000);
	if (latestsignal > 0 && latestsignal > latestdata)
		sell(1000);

}

function calcBollinger(){

}

function calcRSI(){

}

//Handled by technical indicators js
/*function calcMACD(){

}*/

//This will create a new session on button click
function initSession(){
	var cash = $("#money").val();

	//create the session
	$.ajax({
		type: "POST",
		url: "tsessions/create",
		data: {cash: cash},
		success: function(cash){
				updateDisplay(cash, "0");
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
				updateDisplay(data.cash, data.position);
			else
				alert("You have no session!");
		}
	});

}

function updateDisplay(cash, position){
	var decimalcash = cash.toString();
	var decimalcash = decimalcash.substring(0, decimalcash.length-4) + "." + decimalcash.substring(decimalcash.length-4, decimalcash.length)
	$("#cashdisplay").html("Cash: $" + decimalcash);
	$("#positiondisplay").html("Positions: " + position + "EUR");
}