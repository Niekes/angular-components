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
			var margin = {top: 20, right: 20, bottom: 30, left: 40};

			// // WIDTH AND HEIGHT
			// height = 500 - margin.left - margin.right;
			// width  = 960 - margin.top - margin.bottom;

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

			console.log(angular.element(el));

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

			// svg.append('g')
			// 	.attr('class', 'labels');
		};

		$scatterplotCtrl.$onChanges = function(changes){
			$scatterplotCtrl.update(el, changes.data.currentValue);
		};

		$scatterplotCtrl.update = function(el, data){

			var xMin = d3.min(data, function(d){return d.date; });
			var xMax = d3.max(data, function(d){ return d.date; });

			var yMin = d3.min(data, function(d){return d.sum; });
			var yMax = d3.max(data, function(d){ return d.sum; });

			var gMax = d3.max(data, function(d){ return d.group; });

			var xScale = d3.scaleTime()
			    .range([0, width])
			    .domain([
			    	new Date(new Date(xMin).setMonth(xMin.getMonth())),
			    	new Date(new Date(xMax).setMonth(xMax.getMonth()))
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
			var circle = svg.select('g.circles').selectAll('circle').data(data); // UPDATE SELECTION

			circle.enter().append('circle') // ENTER
				.style('fill', function(){ return 'transparent'; })
				.attr('r', function(){ return 0; })
				.attr('cx', function(d){ return xScale(d.date); })
				.attr('cy', function(d){ return yScale(d.sum); })
				.style('stroke-width', 1)
			.merge(circle) // ENTER + UPDATE
				.transition().duration(transitionTime)
				.attr('r', function(d){ return d.radius; })
				.attr('cx', function(d){ return xScale(d.date); })
				.attr('cy', function(d){ return yScale(d.sum); })
				.style('fill', function(d){ return color(d.group); })
				.style('stroke', function(d){ return color(d.group); })
				.style('fill-opacity', 0.6)
				.style('stroke-opacity', 1);

			circle.exit() // EXIT
				.transition().duration(transitionTime)
				.attr('r', function(){ return 0; })
				.remove();

			////////////////////////////////////////////
			////////////////////////////////////////////
			///////////////// LABELS ///////////////////
			////////////////////////////////////////////
			////////////////////////////////////////////
			// var labels = svg.select('g.labels').selectAll('text').data(data); // UPDATE SELECTION

			// labels.enter().append('text')
			// 	.attr('opacity', 0)
			// 	.attr('x', function(d){ return xScale(d.date); })
			// 	.attr('y', function(d){ return yScale(d.sum); })
			// 	.attr('dy', - 10 )

			// 	.attr('text-anchor', 'middle' )
			// 	.text(function(d){ return d.name; })
			// .merge(labels)
			// 	.transition().duration(transitionTime)
			// 	.attr('opacity', 1)
			// 	.attr('fill', d3.color('white'))
			// 	.attr('x', function(d){ return xScale(d.date); })
			// 	.attr('y', function(d){ return yScale(d.sum); });

			// labels.exit() // EXIT
			// 	.transition().duration(transitionTime)
			// 	.attr('opacity', 0)
			// 	.remove();
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