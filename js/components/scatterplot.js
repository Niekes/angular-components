'use strict';

app.component('scatterPlot', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$scatterplotCtrl',
	controller: function($element){

		var $scatterplotCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var color = d3.scaleOrdinal(d3.schemeDark2);
		var transitionTime = 1000;
		var strokeDasharrayWidth = 1;

		$scatterplotCtrl.init = function(){

			angular.element(el).empty();

			// MARGIN
			var margin = {top: 40, right: 20, bottom: 30, left: 40};

			// // WIDTH AND HEIGHT
			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg.append('g')
				.attr('transform', 'translate(0,' + height + ')')
				.attr('class', 'axis x');

			svg.append('g')
				.attr('class', 'axis y');

			svg.append('g')
				.attr('class', 'minusBorder');

			svg.append('g')
				.attr('class', 'circles');

			svg.append('g')
				.attr('class', 'labels');
		};

		$scatterplotCtrl.$onChanges = function(changes){
			$scatterplotCtrl.update(el, changes.data.currentValue);
		};

		$scatterplotCtrl.update = function(el, data){

			var xMin = d3.min(data, function(d){return d.date; });
			var xMax = d3.max(data, function(d){ return d.date; });

			var yMin = d3.min(data, function(d){return d.sum; });
			var yMax = d3.max(data, function(d){ return d.sum; });

			var xScale = d3.scaleTime()
			    .range([0, width])
			    .domain([
			    	new Date(new Date(xMin).setMonth(xMin.getMonth()-3)),
			    	new Date(new Date(xMax).setMonth(xMax.getMonth()+3))
		    	]);

			var yScale = d3.scaleLinear()
			    .domain([yMin, yMax])
			    .range([height, 0]);

			var divider = '1';
			for (var i = 1; i <= yMax.toString().length - 1; i++) {
				divider += '0';
			}

			var ticks = [yMin, 0, yMax];
			for (var i = 1; i <= Math.floor(yMax / +divider); i++) {
				if(i % 2 === 0){
					ticks.push(i* (+divider));
				}
			}

			var xAxis = d3.axisBottom(xScale).ticks(30).tickFormat(d3.timeFormat('%b \'%y'));
			var yAxis = d3.axisLeft(yScale).tickValues(ticks).tickSizeInner([-width]);

			svg.select('g.x.axis').transition().duration(transitionTime).call(xAxis);
			svg.select('g.y.axis').transition().duration(transitionTime).call(yAxis);

			///////////////////////////////////////////
			///////////////////////////////////////////
			////////////// MINUS AREA /////////////////
			///////////////////////////////////////////
			///////////////////////////////////////////
			var isMinus = yMin < 0 ? 1 : 0;
			var rect = svg.select('g.minusBorder').selectAll('rect').data([isMinus]); // UPDATE SELECTION

			rect.enter().append('rect') // ENTER
				.style('fill', function(){ return 'rgba(255,0,0,.1)'; })
				.attr('x', 0)
				.attr('y', height)
				.attr('width', width)
				.attr('height', 0)
			.merge(rect)
				.transition().duration(transitionTime)
				.attr('x', 0)
				.attr('y', yScale(0) + strokeDasharrayWidth/2)
				.attr('stroke-dasharray', width + ',' + (width + Math.ceil((yScale(yMin) - yScale(0))*2)))
				.attr('stroke-width', strokeDasharrayWidth + 'px')
				.attr('stroke', 'coral')
				.attr('width', width)
				.attr('height', isMinus === 1 ? (yScale(yMin) - yScale(0)) - strokeDasharrayWidth/2 : 0);

			rect.exit() // EXIT
				.transition().duration(transitionTime)
				.attr('opacity', 0)
				.remove();

			///////////////////////////////////////////
			///////////////////////////////////////////
			//////////////// CIRCLES //////////////////
			///////////////////////////////////////////
			///////////////////////////////////////////
			var circles = svg.select('g.labels').selectAll('path').data(data);

			circles.enter()
				.append('path')
				.attr('id', function(d, i) { return 'textPath_' + i; })
				.style('fill', 'transparent')
				.style('stroke-width', 1)
				.attr('transform', function(d){ return 'translate(' + xScale(d.date) + ','+ yScale(d.sum) +') rotate(225)';	})
				.attr('d', d3.symbol().size(1))
			.merge(circles)
				.transition().duration(transitionTime)
				.attr('transform', function(d){ return 'translate(' + xScale(d.date) + ','+ yScale(d.sum) +') rotate(225)';	})
				.style('fill', function(d){ return color(d.group); })
				.style('stroke', function(d){ return color(d.group); })
				.attr('d', d3.symbol().size(function(d){
					return d.radius * d.radius * Math.PI;
				}))
				.style('fill-opacity', 0.6)
				.style('stroke-opacity', 1);

			circles.exit()
				.transition().duration(transitionTime)
				.style('fill-opacity', 0.6)
				.style('stroke-opacity', 1)
				.attr('d', d3.symbol().size(1))
				.remove();

			//////////////////////////////////////////
			//////////////////////////////////////////
			//////////////// LABELS //////////////////
			//////////////////////////////////////////
			//////////////////////////////////////////

			var labels = svg.select('g.labels').selectAll('text').data(data);

			labels.enter().append('text')
				.attr('opacity', 1)
				.attr('fill', d3.color('white'))
				.attr('dy', -5)
				.attr('x', 0)
				.attr('text-anchor', 'start')
				.style('font-size', 9)
				.append('textPath')
					.attr('xlink:href', function(d, i){ return '#textPath_' + i; })
					.text(function(d){ return d.name; })
			.merge(labels)
				.transition().duration(transitionTime*3)
				.attr('opacity', 1);

			labels.exit()
				.transition().duration(transitionTime)
				.attr('opacity', 0)
				.remove();
		};

		$scatterplotCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$scatterplotCtrl.init();
			}, 1000);
		};
	}
});