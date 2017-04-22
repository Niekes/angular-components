'use strict';

app.component('dropdown', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$dropdownCtrl',
	controller: function($element, $filter, DEFAULTS){

		var d;
		var depth = 0;
		var $dropdownCtrl = this;
		var el = $element[0];
		var tt = DEFAULTS.TRANSITION.TIME;
		var key = function(d){ return d.name; };
		var html = function(d, e){
			var childcount = d.children ? ' (' + d.children.length : '(0';
			childcount += '-'+d.depth+')';
			return '<span class="it">' + d.name + childcount + '</span>';
		};

		$dropdownCtrl.init = function(){

			angular.element(el).empty();

			d = d3.select(el).append('div').attr('class', 'dropdown').append('ul');

		};

		$dropdownCtrl.$onChanges = function(changes){

			depth = 0;

			$dropdownCtrl.update(el, changes.data.currentValue);

		};

		$dropdownCtrl.update = function(el, data){

			var parent = d.selectAll('li.item').data(data, key);
			generateList(parent);

		};

		function generateList (parent) {

			var enterP = parent
				.enter()
				.append('li')
				.attr('class', 'item')
			.merge(parent)
				.style('border-left', '1px solid #503b65')
				.style('padding-left', '10px')
				.each(function(d){ d.depth = depth; })
				.html(html)
				.on('click', function(){
					expandChilds(this);
				})
				.append('ul');

			parent
				.exit()
				.remove();

			var child = parent.select('ul').merge(enterP).selectAll('li.child').data(function(d) {
				return d.children !== undefined ? d.children : [];
			});

			var enterC = child.enter();

			if(!enterC.empty()){
				depth++;
				generateList(child);
			}
		}

		function expandChilds(el){
			var s = d3.select(el).select('ul');
			var t = s.transition();
			var h = s.classed('hidden');
			var o = h ? 1 : 0;
			if(h){
				t.style('opacity', o).style('height', s._currentHeight);
				s.classed('hidden', false);
			}else{
				s._currentHeight = s.style('height');
				t.style('opacity', o).style('height', '0px');
				s.classed('hidden', true);
			}

		}

		$dropdownCtrl.init();

		var timeout;
		window.onresize = function() {
			clearTimeout(timeout);
			timeout = setTimeout(function(){
    			$dropdownCtrl.init();
			}, 1000);
		};
	}
});
