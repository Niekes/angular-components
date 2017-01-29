'use strict';

app.component('pieChart', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$piechartCtrl',
	controller: function($element, DEFAULTS){

		var $piechartCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var arc;
		var path;
		var color = d3.scaleOrdinal(d3.schemeDark2);

		$piechartCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 40, right: 20, bottom: 30, left: 40};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg
				.append('g')
				.attr('class', 'piechart')
				.attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

		};

		$piechartCtrl.$onChanges = function(changes){
			$piechartCtrl.update(el, changes.data.currentValue);
		};

		$piechartCtrl.update = function(el, data){

			var radius = Math.min(width, height)/2;

        	var pie = d3.pie()
            	.value(function(d) { return d.value; })
            	.sort(null);

	        arc = d3.arc()
	            .outerRadius(radius - 140)
	            .innerRadius(radius)
	            .padAngle(0.05)
	            .cornerRadius(5);

			var path = svg.select('g.piechart').selectAll('path.path');
	        var data0 = path.data();
         	var data1 = pie(data);

     		path = path.data(data1, $piechartCtrl.key);

	      	path
				.transition().duration(DEFAULTS.TRANSITION.TIME)
      			.attrTween('d', $piechartCtrl.arcTween);

        	path
        		.enter()
        		.append('path')
        		.attr('class', 'path')
        		.attr('fill', 'transparent')
        		.attr('stroke-opacity', 0)
				.each(function(d, i) { this._current = $piechartCtrl.findNeighborArc(i, data0, data1, $piechartCtrl.key) || d; })
      			.transition().duration(DEFAULTS.TRANSITION.TIME)
      			.attr('stroke-opacity', 1)
   				.attr('stroke', function(d) { return d3.rgb(color(d.data.name)).brighter(1); })
      			.attr('fill-opacity', 1)
   				.attr('fill', function(d) { return d3.rgb(color(d.data.name)).darker(1); })
      			.attrTween('d', $piechartCtrl.arcTween);

			path
				.exit()
				.datum(function(d, i) { return $piechartCtrl.findNeighborArc(i, data1, data0, $piechartCtrl.key) || d; })
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attrTween('d', $piechartCtrl.arcTween)
				.attr('stroke-opacity', 0)
				.remove();
		};

		$piechartCtrl.arcTween = function(d){
    		var i = d3.interpolate(this._current, d);
    		this._current = i(0);
    		return function(t) {
        		return arc(i(t));
    		};
		};

		$piechartCtrl.key = function(d){
    		return d.data.name;
  		};

  		// Thx to Mike Bostock
  		// https://bl.ocks.org/mbostock/5682158
		$piechartCtrl.findNeighborArc = function(i, data0, data1, key) {
  			var d;
  			return (d = $piechartCtrl.findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
      			: (d = $piechartCtrl.findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
      			: null;
		};

		$piechartCtrl.findPreceding = function(i, data0, data1, key) {
			var m = data0.length;
  			while (--i >= 0) {
    			var k = key(data1[i]);
    			for (var j = 0; j < m; ++j) {
      				if (key(data0[j]) === k) {
      					return data0[j];
      				}
    			}
  			}
		};

		$piechartCtrl.findFollowing = function(i, data0, data1, key) {
			var n = data1.length, m = data0.length;
			while (++i < n) {
	    		var k = key(data1[i]);
	    		for (var j = 0; j < m; ++j) {
	      			if (key(data0[j]) === k) {
	      				return data0[j];
	      			}
	    		}
 			}
		};

		$piechartCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$piechartCtrl.init();
			}, 1000);
		};
	}
});
