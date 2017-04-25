'use strict';

app.component('datatable', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$datatableCtrl',
	controller: function($element, DEFAULTS){

		var $datatableCtrl = this;
		var el = $element[0];
		var svg;
		var width;
		var height;

		$datatableCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 40, right: 20, bottom: 30, left: 40};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
					.attr('class', 'datatable');

		};

		$datatableCtrl.$onChanges = function(changes){
			$datatableCtrl.update(el, changes.data.currentValue);
		};

		$datatableCtrl.update = function(el, data){

			// var keys = ['name', 'val', 'ly', 'pv'];

			var rows = svg.selectAll('g.rows').data(data, function(d){ return d.name; });

  			var enterRows = rows
  				.enter()
  				.append('g')
  				.attr('class', 'rows')
  				.attr('transform', function(d, i){
  					return 'translate(0,' + (i*15) + ')';
  				})
  				.merge(rows);

			rows
				.exit()
				.remove();

			var cells = rows.merge(enterRows).selectAll('text.cells').data(function(d){
				var _vals = d.values;
				return [_vals.val, _vals.ly, _vals.pv];
			});

			cells
				.enter()
				.append('text')
				.attr('class', 'cells')
				.merge(cells)
				.style('fill' , d3.color('white'))
				.attr('x', function(d, i){
					return i*20;
				})
				.text(function(d){
					return d;
				});

			cells
				.exit()
				.remove();


  			// keys.forEach(function(k){
	  		// 	cell
	  		// 		.append('text')
	  		// 		.text(function(d){
	  		// 			return d[k];
	  		// 		});
  			// });










			// var rowsEnter = rows
			// 	.enter()
			// 	.append('g')
			// 	.attr('class', 'rows')
			// 	.style('fill', d3.color('white'))
			// 	.attr('y', function(d, i){ return i*14;})
			// .merge(rows);

			// rows
			// 	.exit()
			// 	.remove();

			// var cells = rows.merge(rowsEnter).selectAll('tspan.cells').data(function(d) { return d; });

			// console.log(cells);

			// cells
			// 	.enter()
			// 	.append('tspan')
			// 	.text(function(d){
			// 		console.log(d);
			// 	});
			// 	.attr('class', 'cells')
			// 	.style('text-anchor', 'middle')
			// 	.style('fill', d3.color('white'))
			// 	.attr('x', function(d, i){ return (i*14)+20;})
			// .merge(cells)
			// 	.each(function(d){
			// 		var _p = d3.select(this).node().parentNode;
			// 		angular.forEach(d, function(f, k){
			// 			console.log(f, k);
			// 		});
			// 		// console.log(d, d3.select(this).node().parentNode);
			// 	});

			// cells
			// 	.exit()
			// 	.remove();


		};

		$datatableCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$datatableCtrl.init();
			}, 1000);
		};
	}
});
