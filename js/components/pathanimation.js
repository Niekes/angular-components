'use strict';

app.component('pathanimation', {

  	controllerAs: '$pathanimationCtrl',
	controller: function($element, DEFAULTS){

		var $pathanimationCtrl = this;
		var tt = DEFAULTS.TRANSITION.TIME;
		var line = d3.line().curve(d3.curveCardinal);
		var el = $element[0];
		var height;
		var width;
		var svg;

		$pathanimationCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 40, right: 20, bottom: 30, left: 40};

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

			svg.append('text')
			   	.append('textPath')
				.attr('xlink:href', '#path')
				.style('text-anchor','middle')
				.style('fill', 'white')
				.style('letter-spacing', '2px')
				.style('font-size', '2em')
				.attr('startOffset', '50%')
				.text('I am a pretty awesome text, don\'t you think ?');

			$pathanimationCtrl.repeat();

		};

		$pathanimationCtrl.repeat = function(){

			var pathStart = [[0,0],[width/2,0],[width,0]];
			var pathEnd = [[0,0],[width/2,height],[width,0]];

			svg.selectAll('path')
				.attr('d', line(pathStart))
				.transition().duration(tt).delay(tt*2).ease(d3.easeBounce)
				.attr('d', line(pathEnd))
				.transition().duration(tt).delay(tt*2).ease(d3.easeBack)
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
