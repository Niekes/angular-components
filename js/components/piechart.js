'use strict';

app.component('pieChart', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$piechartCtrl',
	controller: function($rootScope, $element, DEFAULTS){

		var arc;
		var svg;
		var width;
		var height;
		var el = $element[0];
		var $piechartCtrl = this;
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

			var outerRadius = Math.min(width, height)/2;
			var innerRadius = outerRadius - (outerRadius/2);

        	var pie = d3.pie()
            	.value(function(d) { return d.value; })
            	.sort(null);

	        arc = d3.arc()
	            .outerRadius(outerRadius)
	            .innerRadius(innerRadius)
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

			var labels = svg.select('g.piechart').selectAll('text.labels').data(data, function(d){ return d.name; });

			labels
				.enter()
				.append('text')
				.attr('class', 'labels')
				.attr('opacity', 0)
				.attr('text-anchor', 'middle')
				.attr('font-size', 14)
				.attr('dy', '-.4em')
				.attr('fill', d3.color(DEFAULTS.COLORS.BG).brighter(3))
				.classed('font-weight-bold', true)
				.attr('x', -10)
			.merge(labels)
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attr('opacity', 1)
				.attr('y', function(d, i){
					return i * 20 - (data.length*10) + 20;
				})
				.text(function(d){
					return d.name;
				});

			labels
				.exit()
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attr('opacity', 0)
				.remove();

			var values = svg.select('g.piechart').selectAll('text.values').data(data, function(d){ return d.name; });

			values
				.enter()
				.append('text')
				.attr('class', 'values')
				.attr('opacity', 0)
				.attr('text-anchor', 'end')
				.attr('dy', '-.4em')
				.attr('font-size', 14)
				.attr('fill', d3.color(DEFAULTS.COLORS.BG).brighter(3))
				.classed('font-weight-light', true)
				.attr('x', 40)
			.merge(values)
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attr('opacity', 1)
				.attr('y', function(d, i){
					return i * 20 - (data.length*10) + 20;
				})
				.tween('text', function(d){
            		var that = d3.select(this);
            		var i = d3.interpolateNumber(that.text(), d.value);
					return function(t) {
						that.text(i(t).toFixed(2));
					};
				});

			values
				.exit()
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.tween('text', function(){
            		var that = d3.select(this);
            		var i = d3.interpolateNumber(that.text(), 0);
					return function(t) {
						that.text(i(t).toFixed(2));
					};
				})
				.attr('opacity', 0)
				.remove();

			var labelPoints = svg.select('g.piechart').selectAll('circle.labelPoints').data(data, function(d){ return d.name; });

			labelPoints
				.enter()
				.append('circle')
				.attr('class', 'labelPoints')
				.attr('fill', 'transparent')
				.attr('cx', -30)
			.merge(labelPoints)
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attr('opacity', 1)
				.attr('fill', function(d){ return color(d.name); })
				.attr('r', 3)
				.attr('cy', function(d, i){
					return i * 20 - (data.length*10) + 10;
				})
				.attr('cx', -30);

			labelPoints
				.exit()
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attr('r', 0)
				.attr('opacity', 0)
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

		$rootScope.$on('window:resize', function(){
			$piechartCtrl.init();
		});
	}
});
