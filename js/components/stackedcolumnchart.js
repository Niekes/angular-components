'use strict';

app.component('stackedColumnChart', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$stackedcolumnchartCtrl',
	controller: function($element){

		var $stackedcolumnchartCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var color = d3.scaleOrdinal(d3.schemeDark2);
		var transitionTime = 1000;

		$stackedcolumnchartCtrl.init = function(){

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
		};

		$stackedcolumnchartCtrl.$onChanges = function(changes){
			$stackedcolumnchartCtrl.update(el, changes.data.currentValue);
		};

		$stackedcolumnchartCtrl.update = function(el, data){
			console.log(el, data);
		};

		$stackedcolumnchartCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$stackedcolumnchartCtrl.init();
			}, 1000);
		};
	}
});