'use strict';

app.component('gaugepie', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$piechartCtrl',
	controller: function($rootScope, $element, DEFAULTS){

		var arc;
		var svg;
		var width;
		var height;
		var el = $element[0];
		var $piechartCtrl = this;
		var color = d3.scaleOrdinal(d3.schemeDark2);

		$piechartCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 40, right: 20, bottom: 30, left: 40};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg
				.append('g')
				.attr('class', 'gaugepie')
				.attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

		};

		$piechartCtrl.$onChanges = function(changes){
			$piechartCtrl.update(el, changes.data.currentValue);
		};

		$piechartCtrl.update = function(el, data){
			console.log(data);
		};

		$piechartCtrl.init();

		$rootScope.$on('window:resize', function(){
			$piechartCtrl.init();
		});
	}
});
