'use strict';

app.component('pieChart', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$piechartCtrl',
	controller: function($element){

		var $piechartCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
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

			var preparedData = $piechartCtrl.groupData(data, '2016');
			var filteredData = preparedData.filter(function(d){ return d.key === 'May'; });

        	var pie = d3.pie()
            	.value(function(d) { return d.value; });

	        var arc = d3.arc()
	            .outerRadius(radius - 140)
	            .innerRadius(radius)
	            .padAngle(0.05)
	            .cornerRadius(5);

         	var g = svg.select('g.piechart').selectAll('g.arc')
      			.data(pie(filteredData[0].value))
    			.enter().append('g')
      			.attr('class', 'arc');

  			g.append('path')
      			.attr('d', arc)
      			.style('fill', function(d) {return color(d.data.name); });
		};

		$piechartCtrl.groupData = function(data, accessor){
			return d3.nest()
				.key(function(d){ return d[accessor]; })
				.rollup(function(v){
					return [
						{ name: 'Chrome', value: v[0].Chrome},
						{ name: 'Firefox', value: v[0].Firefox},
						{ name: 'IE', value: v[0].IE},
						{ name: 'Opera', value: v[0].Opera},
						{ name: 'Safari', value: v[0].Safari},
					];
				})
				.entries(data);
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
