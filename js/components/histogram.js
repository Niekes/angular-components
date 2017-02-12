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
		var	canvas = document.getElementById('canvas');
    	var	context = canvas.getContext('2d');
    	var x;
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

			svg.append('g')
				.attr('class', 'brush');
		};

		$histogramCtrl.$onChanges = function(changes){
			$histogramCtrl.update(el, changes.data.currentValue, changes.data.previousValue);
		};

		$histogramCtrl.update = function(el, data){

			var img = new Image();

			img.onload = function() {

				var w = this.width;
				var h = this.height;

				context.clearRect(0, 0, w, h);
		    	canvas.width = w;
		    	canvas.height = h;
		    	context.drawImage(img, 0, 0);

		    	var brush = d3.brushX()
    				.extent([[0, 0], [width, height]])
    				.on('end', $histogramCtrl.brushed)
    				.on('brush', $histogramCtrl.brush);

				var data = context.getImageData(0, 0, w, h).data;
				var image = $histogramCtrl.retrieveImgData(data);
				var rangeband = width/image.histogram.values.length;

				x = d3.scaleLinear()
					.domain([min - 1, max])
    				.range([0, width]);

				var y = d3.scaleLinear()
					.domain([min, d3.max(image.histogram.values)])
	          		.range([height, min])
	          		.nice();

				var xAxis = d3.axisBottom(x).tickValues([max]);
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
			    	.attr('width', rangeband)
			    	.attr('height', 0)
				.merge(bar)
					.transition().duration(DEFAULTS.TRANSITION.TIME)
			    	.attr('x', function(d, i){ return x(i); })
			    	.attr('y', function(d){ return isNaN(y(d)) ? 0 : y(d); })
			    	.attr('width', rangeband)
			    	.attr('height', function(d){ return isNaN(y(d)) ? 0 : height - y(d); });

		    	bar
		    		.exit()
		    		.transition().duration(DEFAULTS.TRANSITION.TIME)
		    		.remove();

	    		svg
	    			.select('g.brush')
	    			.call(brush)
	    			.transition().duration(DEFAULTS.TRANSITION.TIME)
	    			.call(brush.move, [0, width]);

				};

			img.src = data.src;
		};

		$histogramCtrl.brushed = function(){
			var s = d3.event.selection;
			var sx = s.map(x.invert);
			var start = sx[0] === -1 ? 0 : parseInt(sx[0]);
			var end = parseInt(sx[1]);
			console.log(start, end);
		};

		$histogramCtrl.brush = function(){
			var selection = d3.select(this).select('rect.selection');
			var w = selection.attr('width');
			var h = selection.attr('height');
			selection.attr('stroke-dasharray', '0,' + w + ',' + h + ',' + w + ',' + h);
		};

		$histogramCtrl.retrieveImgData = function(data){
			var image = {values : [], histogram: { values: d3.range(max + 1).map(function(){ return 0; })}};
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

    		var maxValue = d3.max(image.histogram.values);

    		image.histogram.mode = {
    			pixel: maxValue,
    			value: image.histogram.values.indexOf(maxValue)
    		};
    		image.histogram.mean = d3.mean(image.histogram.values);

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
