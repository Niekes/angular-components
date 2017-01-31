'use strict';

app.component('gauge', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$gaugeCtrl',
	controller: function($element, $filter, DEFAULTS){

		var $gaugeCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var transitionTime = 1000;
		var needleLength;
		var needleRadius;
		var aqua = 'aqua';
		var arc;

		$gaugeCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 40, right: 20, bottom: 30, left: 20};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

			needleLength = (Math.min(width, height)/2) - (margin.right + margin.left + 20);
			needleRadius = needleLength/10;

			arc = d3.arc()
	    		.innerRadius(needleLength - (needleLength/2))
	    		.outerRadius(needleLength)
	    		.startAngle(-Math.PI/2);

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			var gradient = svg.append('defs')
				.append('radialGradient')
				.attr('id', 'gradient')
				.attr('gradientUnits', 'userSpaceOnUse')
    			.attr('cx', 0)
    			.attr('cy', 0)
    			.attr('r', '40%');

			gradient.append('stop')
				.attr('offset', '0%')
				.attr('stop-color', d3.color(aqua).brighter(2));

			gradient.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', d3.color(aqua).darker(3));

			var gauge = svg.append('g')
				.attr('class', 'gauge')
				.attr('opacity', 0)
				.attr('transform', 'translate(' + width/2 + ',' + (height - margin.bottom) + ')');

			gauge
				.append('path')
					.attr('class', 'arcIndicator')
					.datum({ endAngle: -Math.PI/2 })
    				.style('fill-opacity', 0.5)
    				.attr('d', arc);

			gauge
				.append('path')
					.attr('class', 'arc')
					.datum({ endAngle: -Math.PI/2 })
    				.style('fill', 'none')
    				.style('stroke', d3.color(aqua).darker())
    				.attr('stroke-width', 5)
    				.transition().duration(transitionTime*2)
    				.attrTween('d', $gaugeCtrl.arcTween(Math.PI/2));

			gauge
				.append('path')
					.attr('class', 'needle')
					.attr('fill', d3.color(aqua).darker(3))
					.attr('stroke', d3.color(aqua).brighter());

			gauge
				.append('text')
				.attr('class', 'valueText')
				.classed('monospace', true)
				.attr('font-size', 30)
				.attr('fill', d3.color(DEFAULTS.COLORS.BG).brighter(5))
				.attr('text-anchor', 'middle')
				.attr('dy', '0.25em')
				.text('0');

			gauge
				.append('circle')
				.attr('fill', d3.color(DEFAULTS.COLORS.BG))
				.attr('stroke', d3.color(aqua).darker(2))
				.attr('r', needleRadius);

			gauge
				.transition().duration(transitionTime)
				.attr('opacity', 1);
		};

		$gaugeCtrl.$onChanges = function(changes){

			$gaugeCtrl.update(el, changes.data.currentValue, changes.data.previousValue);

		};

		$gaugeCtrl.update = function(el, data, oldValue){

			oldValue = angular.equals(oldValue, {}) ? 0 : oldValue;

			var gauge = svg.select('g.gauge');
			var needle = gauge.selectAll('path.needle');

			var rads = $gaugeCtrl.percent2Radians(data/2);

			needle
				.transition().duration(transitionTime)
				.tween('progress', function(){
            		var that = d3.select(this);
            		var i = d3.interpolateNumber(oldValue, data);
					return function(t) {
						that.attr('d', $gaugeCtrl.getPath(i(t)));
					};
				});

			var arcIndicator = gauge.selectAll('path.arcIndicator');

			arcIndicator
				.transition().duration(transitionTime)
				.style('fill', 'url(#gradient)')
				.attrTween('d', $gaugeCtrl.arcTween( -Math.PI/2 + rads ));

			var valueText = gauge.select('text.valueText');

			valueText
				.transition().duration(transitionTime)
				.tween('text', function(){
					var that = d3.select(this);
					var i = d3.interpolateString(that.text(), data*100);
					return function(t){
						that.text($filter('number')(i(t), 1) + '%');
					};
				})
				.tween('progress', function(){
            		var that = d3.select(this);
            		var i = d3.interpolateNumber(oldValue, data);
					return function(t) {
						var iRads = $gaugeCtrl.percent2Radians(i(t));
						var textX = Math.cos(iRads/2)*(-needleLength-50);
						var textY = Math.sin(iRads/2)*(-needleLength-30);
						that.attr('transform', 'translate('+ textX +',' + textY +')');
					};
				});
		};

		$gaugeCtrl.arcTween = function(newAngle){
			return function(d){
				var interpolate = d3.interpolate(d.endAngle, newAngle);
				return function(t){
					d.endAngle = interpolate(t);
					return arc(d);
				};
			};
		};

		$gaugeCtrl.getPath = function(percent){

			var thetaRad = $gaugeCtrl.percent2Radians(percent / 2);

			var centerX = 0;
			var centerY = 0;

            var topX = centerX - needleLength * Math.cos(thetaRad);
            var topY = centerY - needleLength * Math.sin(thetaRad);

            var leftX = centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2);
            var leftY = centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2);

            var rightX = centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2);
            var rightY = centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2);

            return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY + 'Z';
		};

  		$gaugeCtrl.percent2Radians = function(perc) {
    		return perc * 360 * Math.PI / 180;
  		};

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
