'use strict';

app.component('textAnimation', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$textanimationCtrl',
	controller: function($element){

		var $textanimationCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var transitionTime = 2500;

		$textanimationCtrl.init = function(){

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
				.attr('class', 'textGroup')
				.attr('transform', 'translate(' + width/2 + ',0)');

		};

		$textanimationCtrl.$onChanges = function(changes){
			$textanimationCtrl.update(el, changes.data.currentValue);
		};

		$textanimationCtrl.update = function(el, data){

			var text = svg.select('g.textGroup').selectAll('text.monospace').data(data);

			text
				.enter()
				.append('text')
				.attr('text-anchor', 'middle')
				.attr('class', 'monospace')
				.attr('font-size', '28px')
				.attr('y', function(d, i){
					var part = height/data.length;
					return (part * i) + part/2;
				})
				.style('opacity', 0)
				.text(function(d){ return d; })
			.merge(text)
				.transition().duration(transitionTime)
				.attr('fill', function(d){
					return d < 0 ? '#c54d81' : '#72d694';
				})
				.attr('y', function(d, i){
					var part = height/data.length;
					return (part * i) + part/2;
				})
				.style('opacity', 1)
				.tween('text', function(d){
            		var that = d3.select(this);
            		var i = d3.interpolateNumber(that.text(), d);
					return function(t) {
						that.text(Math.floor(i(t)));
					};
				});

			text
				.exit()
				.remove();
		};

		$textanimationCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$textanimationCtrl.init();
			}, 1000);
		};
	}
});
