'use strict';

app.component('pathanimation', {

  	controllerAs: '$pathanimationCtrl',
	controller: function($element){

		var $pathanimationCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;

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
				.attr('d', 'M 0,' + height + ' Q ' + width/2 + ',' + height + ' ' + width + ',0')
				.style('fill', 'none')
				.style('stroke', '#BBB');

			svg.append('text')
			   	.append('textPath')
				.attr('xlink:href', '#path')
				.style('text-anchor','middle')
				.style('fill', 'white')
				.attr('startOffset', '50%')
				.text('Yay, my text is on a wavy path');

			svg.selectAll('path')
				.transition().duration(2000).delay(2000)
				.attr('d', 'M 0,' + 0 + ' Q ' + width/2 + ',' + height + ' ' + width + ',' + height + '');

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
