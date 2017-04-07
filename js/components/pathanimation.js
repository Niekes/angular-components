'use strict';

app.component('pathAnimation', {
	bindings: {
    	data: '<'
  	},
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

			console.log('WORKS');

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
