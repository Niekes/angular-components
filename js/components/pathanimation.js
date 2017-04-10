'use strict';

app.component('pathanimation', {

  	controllerAs: '$pathanimationCtrl',
	controller: function($element, DEFAULTS){

		var $pathanimationCtrl = this;
		var tt = DEFAULTS.TRANSITION.TIME;
		var line = d3.line().curve(d3.curveCardinal);
		var el = $element[0];
		var textPath;
		var height;
		var width;
		var svg;

		$pathanimationCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 100, right: 20, bottom: 100, left: 20};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg.append('path')
				.attr('id', 'path')
				.style('fill', 'none')
				.style('stroke', '#BBB');

			textPath = svg.append('text')
			   	.append('textPath')
				.attr('xlink:href', '#path')
				.style('text-anchor','middle')
				.style('fill', 'white')
				.style('letter-spacing', '2px')
				.style('font-size', '2em')
				.text('I am a pretty awesome text, don\'t you think ?');

			$pathanimationCtrl.repeat();

		};

		$pathanimationCtrl.repeat = function(){

			textPath
				.attr('startOffset', '10%')
				.style('text-anchor','start')
				.transition().duration(tt).ease(d3.easeBack)
				.attr('startOffset', '50%')
				.style('text-anchor','start')
				.transition().duration(tt).delay(tt).ease(d3.easeBack)
				.attr('startOffset', '10%')
				.style('text-anchor','start');

			var pathStart = [
				[0,0],
				[width/3,height],
				[width/4*3,0],
				[width,0]
			];

			var pathEnd = [
				[0,0],
				[width/3,0],
				[width/4*3,height],
				[width,0]
			];

			svg.selectAll('path')
				.attr('d', line(pathStart))
				.transition().duration(tt).delay(tt).ease(d3.easeExp)
				.attr('d', line(pathEnd))
				.transition().duration(tt).delay(tt).ease(d3.easeExp)
				.attr('d', line(pathStart))
				.on('end', $pathanimationCtrl.repeat);

		};

		$pathanimationCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$pathanimationCtrl.init();
			}, 1000);
		};
	}
});
