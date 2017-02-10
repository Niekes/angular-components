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
		var color = d3.scaleOrdinal(d3.schemeDark2);
		var treemap;
		var cellUpdate;
		var textUpdate;

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
				.size([width, height])
				.round(true)
				.paddingInner(2);

			d3.selectAll('input')
    			.on('change', function(){
    				$treemapCtrl.updateLayout(this.value);
    			});
		};

		$treemapCtrl.$onChanges = function(changes){
			$treemapCtrl.update(el, changes.data.currentValue);
		};

		$treemapCtrl.update = function(el, data){

			/*---------ROOT---------*/

			var root = d3.hierarchy(data)
				.sum(function(d){ return d.value; })
				.sort(function(a, b) { return b.height - a.height; });

			treemap(root);

			/*---------CELL---------*/

			var cell = svg.select('g.cells').selectAll('rect.cell').data(root.leaves(), function(d){ return d.data.name; });

    		cellUpdate = cell.enter()
				.append('rect')
				.attr('class', 'cell')
				.attr('opacity', 0)
				.attr('id', function(d) { return d.data.id; })
				.attr('width', 0)
				.attr('height', 0)
				.attr('fill', function(d) { return color(d.parent.data.id); })
      			.attr('x', function(d) { return (d.x0 + (d.x1 - d.x0)/2); })
      			.attr('y', function(d) { return (d.y0 + (d.y1 - d.y0)/2); })
  			.merge(cell);

			cell
				.exit()
				.transition().duration(DEFAULTS.TRANSITION.TIME/2)
				.attr('width', 0)
				.attr('height', 0)
      			.attr('x', function(d) { return (d.x0 + (d.x1 - d.x0)/2); })
      			.attr('y', function(d) { return (d.y0 + (d.y1 - d.y0)/2); })
				.attr('opacity', 0)
				.remove();

			/*---------TEXT---------*/

			var text = svg.select('g.cells').selectAll('text.label').data(root.leaves(), function(d){ return d.data.name; });

    		textUpdate = text.enter()
				.append('text')
				.attr('class', 'label')
				.attr('opacity', 0)
				.attr('font-size', 20)
				.attr('x', function(d) { return (d.x0 + (d.x1 - d.x0)/2); })
      			.attr('y', function(d) { return (d.y0 + (d.y1 - d.y0)/2); })
  			.merge(text);

			text
				.exit()
				.transition().duration(DEFAULTS.TRANSITION.TIME/2)
				.attr('opacity', 0)
      			.attr('x', function(d) { return (d.x0 + (d.x1 - d.x0)/2); })
      			.attr('y', function(d) { return (d.y0 + (d.y1 - d.y0)/2); });

  			$treemapCtrl.updateLayout(d3.select('input').attr('value'));

		};

		$treemapCtrl.updateLayout = function(layout){
			if(layout === 'table'){

				cellUpdate
				  	.transition().duration(DEFAULTS.TRANSITION.TIME)
					.attr('fill', d3.color(DEFAULTS.COLORS.BG).brighter(0.5))
					.attr('y', function(d, i) { return i*41; })
					.attr('x', 0)
					.attr('height', 40)
					.attr('width', width);

				textUpdate
	  				.transition().duration(DEFAULTS.TRANSITION.TIME)
	  				.attr('opacity', 1)
					.attr('x', 10)
	      			.attr('y', function(d, i) { return (i*41)+25; })
	      			.attr('fill', d3.color('white'))
	      			.text(function(d){ return d.data.name; });

			}else{

	  			cellUpdate
	  				.transition().duration(DEFAULTS.TRANSITION.TIME)
	  				.attr('opacity', 1)
					.attr('width', function(d) { return d.x1 - d.x0; })
					.attr('height', function(d) { return d.y1 - d.y0; })
					.attr('fill', function(d) { return color(d.data.name); })
	      			.attr('x', function(d) { return d.x0; })
	      			.attr('y', function(d) { return d.y0; });

				textUpdate
	  				.transition().duration(DEFAULTS.TRANSITION.TIME)
	  				.attr('opacity', 1)
					.attr('x', function(d) { return d.x0 + 10; })
	      			.attr('y', function(d) { return d.y0 + 25; })
	      			.attr('fill', d3.color('black'))
	      			.text(function(d){ return d.data.name; });

			}
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
