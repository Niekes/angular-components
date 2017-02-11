'use strict';

app.component('histogram', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$histogramCtrl',
	controller: function($element, $filter, DEFAULTS){

		var $histogramCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var min = 0;
		var max = 255;

		$histogramCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 40, right: 20, bottom: 30, left: 40};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis x')
				.attr('transform', 'translate(0,' + height + ')');

			svg.append('g')
				.attr('opacity', 0)
				.attr('class', 'axis y');

			svg.append('g')
				.attr('class', 'bars');
		};

		$histogramCtrl.$onChanges = function(changes){
			$histogramCtrl.update(el, changes.data.currentValue, changes.data.previousValue);
		};

		$histogramCtrl.update = function(el, data){

			var domain = d3.range(max + 1).map(function(){ return 0; });
			var image = $histogramCtrl.retrieveImgData(data, domain);

			var x = d3.scaleBand()
				.domain(d3.range(max + 1))
    			.range([0, width]);

			var y = d3.scaleLinear()
				.domain([min, d3.max(image.histogram.values)])
          		.rangeRound([height, min])
          		.nice();

			var xAxis = d3.axisBottom(x).tickValues([]);
			var yAxis = d3.axisLeft(y);

		    svg.select('g.x.axis').transition().duration(DEFAULTS.TRANSITION.TIME).attr('opacity', 1).call(xAxis);
		    svg.select('g.y.axis').transition().duration(DEFAULTS.TRANSITION.TIME).attr('opacity', 1).call(yAxis);

		    var bar = svg.select('g.bars').selectAll('rect.bar').data(image.histogram.values);

		    bar
		    	.enter()
		    	.append('rect')
		    	.attr('class', 'bar')
		    	.attr('x', function(d, i){ return x(i); })
		    	.attr('y', height)
		    	.attr('width', x.bandwidth())
		    	.attr('height', 0)
			.merge(bar)
				.transition().duration(DEFAULTS.TRANSITION.TIME)
		    	.attr('x', function(d, i){ return x(i); })
		    	.attr('y', function(d){ return isNaN(y(d)) ? 0 : y(d); })
		    	.attr('width', x.bandwidth())
		    	.attr('height', function(d){ return isNaN(y(d)) ? 0 : height - y(d); });

	    	bar
	    		.exit()
	    		.transition().duration(DEFAULTS.TRANSITION.TIME)
	    		.remove();

		};

		$histogramCtrl.retrieveImgData = function(data, histo){
			var image = {values : [], histogram: { values: histo}};
			var counter = 0;
			for (var i = 0; i < data.length; i += 4) {
				image.values[counter] = {
					r: data[i],		// red
					g: data[i + 1],	// green
					b: data[i + 2],	// blue
					a: data[i + 3],	// alpha
					string: 'rgba(' + data[i] + ',' + data[i+1] + ',' + data[i+2] + ',' + data[i+3] + ')',
					grayscale: parseInt((data[i] + data[i + 1] + data[i + 2]) / 3)
				};
				counter++;
    		}

    		image.values.forEach(function(pixel){
				image.histogram.values[pixel.grayscale]++;
    		});

    		var max = d3.max(image.histogram.values);

    		image.histogram.mode = {
    			pixel: max,
    			value: image.histogram.values.indexOf(max)
    		};
    		image.histogram.mean = d3.mean(image.histogram.values);
    		image.histogram.sum = d3.sum(image.histogram.values);

    		console.log(image.histogram);

    		return image;
		};

		$histogramCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$histogramCtrl.init();
			}, 1000);
		};
	}
});
