'use strict';

app.component('threed', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$threedCtrl',
	controller: function($rootScope, $element, $filter, DEFAULTS){

		var svg;
		var width;
		var height;
		var el = $element[0];
		var $threedCtrl = this;


		document.querySelector('article').style.backgroundColor = 'white';


		$threedCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 0, right: 0, bottom: 0, left: 0};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			var focus =  svg.append('g').attr( 'class', 'focus');

			focus.append('path')
				.attr('stroke', 'black')
				.attr('d', d3.line()([[width/2,height/2+10], [width/2,height/2-10]]));

			focus.append('path')
				.attr('stroke', 'black')
				.attr('d', d3.line()([[width/2+10,height/2], [width/2-10,height/2]]));


		};

		$threedCtrl.$onChanges = function(changes){

			$threedCtrl.update(changes.data.currentValue, changes.data.previousValue);

		};

		$threedCtrl.update = function(data, oldValue){
			console.log(data);
		};

		$threedCtrl.init();

		$rootScope.$on('window:resize', function(){
			$threedCtrl.init();
		});
	}
});
