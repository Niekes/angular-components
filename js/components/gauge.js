'use strict';

app.component('gauge', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$gaugeCtrl',
	controller: function($element){

		var $gaugeCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var transitionTime = 1000;
		var needleLength;
		var needleRadius;

		$gaugeCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 40, right: 20, bottom: 30, left: 40};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

			needleLength = 300;
			needleRadius = 30;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg.append('g')
				.attr('class', 'needle')
				.attr('transform', 'translate(' + width/2 + ',' + (height - margin.bottom) + ')');
		};

		$gaugeCtrl.$onChanges = function(changes){
			$gaugeCtrl.update(el, changes.data.currentValue, changes.data.previousValue);
		};

		$gaugeCtrl.update = function(el, data, oldValue){

			var needle = svg.select('g.needle').selectAll('path.needle').data([data]);

			needle
				.enter()
				.append('path')
				.attr('class', 'needle')
				.attr('d', getPath(data))
				.attr('opacity', 0);

			needle
				.transition().duration(transitionTime)
				.tween('progress', function(){
            		var that = d3.select(this);
            		var i = d3.interpolateNumber(oldValue, data);
					return function(t) {
						return that.attr('d', getPath(i(t)));
					};
				})
				.attr('fill', d3.color('aqua').darker())
				.attr('stroke', d3.color('aqua').brighter())
				.attr('fill-opacity', 0.3)
				.attr('opacity', 1);
		};

		function getPath(percent){

			var thetaRad = percToRad(percent / 2);

			var centerX = 0;
			var centerY = 0;

            var topX = centerX - needleLength * Math.cos(thetaRad);
            var topY = centerY - needleLength * Math.sin(thetaRad);

            var leftX = centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2);
            var leftY = centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2);

            var rightX = centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2);
            var rightY = centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2);

            return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY + 'Z';
		}

		function percToDeg(perc) {
    		return perc * 360;
  		}

  		function percToRad(perc) {
    		return degToRad(percToDeg(perc));
  		}

  		function degToRad(deg) {
    		return deg * Math.PI / 180;
  		}

		$gaugeCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$gaugeCtrl.init();
			}, 1000);
		};
	}
});
