'use strict';

app.component('treemap', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$treemapCtrl',
	controller: function($element, $filter, DEFAULTS){

		var $treemapCtrl = this;
		var el = $element[0];
		var svg;
		var height;
		var width;
		var bg = d3.color(DEFAULTS.COLORS.BG);
		var color = d3.scaleOrdinal(d3.schemeDark2);
		var treemap;

		$treemapCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 20, right: 20, bottom: 20, left: 20};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg
				.append('g')
				.attr('class', 'cells');

			treemap = d3.treemap()
				.tile(d3.treemapResquarify)
				.size([width, height])
				.round(true)
				.paddingInner(2);
		};

		$treemapCtrl.$onChanges = function(changes){
			$treemapCtrl.update(el, changes.data.currentValue, changes.data.previousValue);
		};

		$treemapCtrl.update = function(el, data, oldValue){

			var root = d3.hierarchy(data)
				.sum(function(d){ return d.children ? 0 : 1; })
				.sort(function(a, b) { return b.height - a.height; })
				.eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name; });

			treemap(root);

			var cell = svg.select('g.cells').selectAll('rect.cell').data(root.leaves(), function(d){ return d.data.name; });

    		cell.enter()
				.append('rect')
				.attr('class', 'cell')
				.style('opacity', 0)
				.attr('id', function(d) { return d.data.id; })
				.attr('width', 0)
				.attr('height', 0)
				.attr('fill', function(d) { return color(d.parent.data.id); })
      			.attr('x', function(d) { return (d.x0 + (d.x1 - d.x0)/2); })
      			.attr('y', function(d) { return (d.y0 + (d.y1 - d.y0)/2); })
  			.merge(cell)
  				.transition().duration(DEFAULTS.TRANSITION.TIME)
  				.style('opacity', 1)
				.attr('width', function(d) { return d.x1 - d.x0; })
				.attr('height', function(d) { return d.y1 - d.y0; })
				.attr('fill', function(d) { return color(d.parent.data.id); })
      			.attr('x', function(d) { return d.x0; })
      			.attr('y', function(d) { return d.y0; });

			cell
				.exit()
				.transition().duration(DEFAULTS.TRANSITION.TIME)
				.attr('width', 0)
				.attr('height', 0)
      			.attr('x', function(d) { return (d.x0 + (d.x1 - d.x0)/2); })
      			.attr('y', function(d) { return (d.y0 + (d.y1 - d.y0)/2); })
				.style('opacity', 0)
				.remove();

		};

		$treemapCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$treemapCtrl.init();
			}, 1000);
		};
	}
});
