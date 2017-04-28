'use strict';

app.controller('linechartCtrl', function(){

	var $linechartCtrl = this;
	var _lastYear = new Date().getFullYear()-1;
	var _w = d3.timeWeek.range(new Date(_lastYear, 0, 1), new Date(_lastYear, 11, 31), 1);

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	function generateValues(){
		var _vals = [];
		_w.forEach(function(w){
			_vals.push({ x: w, y: rndInt(0, 1000) });
		});
		return _vals;
	}

	function generateData(){
		var _c = rndInt(1, 6);
		var data = [];
		for (var i = 0; i < _c; i++) {
			data.push({
				key: i, values: generateValues(),
			});
		}
		return data;
	}

	$linechartCtrl.updateData = function(){
		$linechartCtrl.data = generateData();
	};

	$linechartCtrl.updateData();
});
