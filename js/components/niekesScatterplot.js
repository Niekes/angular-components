'use strict';

app.component('niekesScatterPlot', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: 'niekesScatterplotCtrl',
	controller: function($element){

		var niekesScatterplotCtrl = this;
		var el = $element[0];
		var svg;
		var xAxis;
		var yAxis;
		var height;
		var width;
		var color = d3.scaleOrdinal(d3.schemeDark2);
		var transitionTime = 1000;

		niekesScatterplotCtrl.init = function(){

			// MARGIN
			var margin = {top: 20, right: 20, bottom: 30, left: 40};

			// WIDTH AND HEIGHT
			height = el.offsetHeight - margin.left - margin.right;
			width  = el.clientWidth - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform',
				'translate(' + margin.left + ',' + margin.top + ')');

			svg.append('g')
				.attr('transform', 'translate(0,' + (height) + ')')
				.attr('class', 'axis x');

			svg.append('g')
				.attr('class', 'axis y');

			svg.append('g')
				.attr('class', 'minusBorder');

			svg.append('g')
				.attr('class', 'circles');

			svg.append('g')
				.attr('class', 'labels');
		}

		niekesScatterplotCtrl.$onChanges = function(changes){
			niekesScatterplotCtrl.update(el, changes.data.currentValue)
		};

		niekesScatterplotCtrl.update = function(el, data){

			var xMin = d3.min(data, function(d){return d.date; });
			var xMax = d3.max(data, function(d){ return d.date; });

			var yMin = d3.min(data, function(d){return d.sum; });
			var yMax = d3.max(data, function(d){ return d.sum; });

			var gMax = d3.max(data, function(d){ return  d.group; });

			var xScale = d3.scaleTime()
			    .range([0, width])
			    .domain([
			    	new Date(new Date(xMin).setMonth(xMin.getMonth()-1)),
			    	new Date(new Date(xMax).setMonth(xMax.getMonth()+1))
		    	]);

			var yScale = d3.scaleLinear()
			    .domain([yMin, yMax])
			    .range([height, 0])

			var xAxis = d3.axisBottom(xScale).ticks(20);
			var yAxis = d3.axisLeft(yScale).ticks(10);

			svg.select('.x.axis').transition().duration(transitionTime).call(xAxis);
			svg.select('.y.axis').transition().duration(transitionTime).call(yAxis);

			var isMinus = yMin < 0 ? 1 : 0;
			var rect = svg.select('g.minusBorder').selectAll('rect').data([isMinus]); // UPDATE SELECTION

			rect.enter().append('rect') // ENTER
				.style('fill', function(d){ return 'rgba(255,0,0,.1)' })
				.attr('x', 0)
				.attr('y', height)
				.attr('width', width)
				.attr('height', 0)
			.merge(rect)
				.transition().duration(transitionTime)
				.attr('x', 0)
				.attr('y', yScale(0))
				.attr('width', width)
				.attr('height', isMinus === 1 ? yScale(yMin) - yScale(0) : 0);

			rect.exit() // EXIT
				.transition().duration(transitionTime)
				.attr('opacity', 0)
				.remove();
			///////////////////////////////////////////
			///////////////////////////////////////////
			////////////////CIRCLES////////////////////
			///////////////////////////////////////////
			///////////////////////////////////////////
			var circle = svg.select('g.circles').selectAll('circle').data(data); // UPDATE SELECTION

			circle.enter().append('circle') // ENTER
				.style('fill', function(d){ return 'transparent' })
				.attr('r', function( d ){ return 0; })
				.attr('cx', function( d ){ return xScale(d.date); })
				.attr('cy', function( d ){ return yScale(d.sum); })
			.merge(circle) // ENTER + UPDATE
				.transition().duration(transitionTime)
				.attr('r', function( d ){ return d.radius; })
				.attr('cx', function( d ){ return xScale(d.date); })
				.attr('cy', function( d ){ return yScale(d.sum); })
				.style('fill', function(d){ return color(d.group); })

			circle.exit() // EXIT
				.transition().duration(transitionTime)
				.attr('r', function( d ){ return 0; })
				.remove();

			///////////////////////////////////////////
			///////////////////////////////////////////
			/////////////////LABELS////////////////////
			///////////////////////////////////////////
			///////////////////////////////////////////
			var labels = svg.select('g.labels').selectAll('text').data(data); // UPDATE SELECTION

			labels.enter().append('text')
				.attr('opacity', 0)
				.attr('x', function( d ){ return xScale(d.date); })
				.attr('y', function( d ){ return yScale(d.sum); })
				.attr('dy', - 10 )

				.attr('text-anchor', 'middle' )
				.text(function(d){ return d.name; })
			.merge(labels)
				.transition().duration(transitionTime)
				.attr('opacity', 1)
				.attr('x', function( d ){ return xScale(d.date); })
				.attr('y', function( d ){ return yScale(d.sum); })

			labels.exit() // EXIT
				.transition().duration(transitionTime)
				.attr('opacity', 0)
				.remove();
		};

		niekesScatterplotCtrl.init();
	}
});