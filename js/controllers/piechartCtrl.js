'use strict';

app.controller('piechartCtrl', function($interval){

	var $piechartCtrl = this;

	function row(d){
		return {
			2016: d['2016'],
			Chrome : +d.Chrome,
			Firefox : +d.Firefox,
			IE : +d.IE,
			Opera : +d.Opera,
			Safari : +d.Safari,
		};
	}

	function updateData(){

		d3.csv('../data/browserstatistics_2016.csv', row, function(data){
			$piechartCtrl.data = data;
		});

	}

	updateData();
	// $interval(updateData, 5000);
});
