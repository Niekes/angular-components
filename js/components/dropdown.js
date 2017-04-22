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

			d3.selectAll('span.it').on('click', function(){
				select(this);
			});

			d3.selectAll('span.expand').on('click', function(){
				expandChilds(this);
			});
		};

		function generateList (parent) {

			var enterP = parent
				.enter()
				.append('li')
				.attr('class', 'item')
			.merge(parent)
				.style('border-left', depth === 0 ? '' : '1px solid #503b65')
				.style('padding-left', depth === 0 ? '' : '8px')
				.each(function(d){ d.depth = depth; })
				.html(function(d){
					var cssC = d.children !== undefined ? 'it' : 'it sin';
					var html = '<span class="'+cssC+'">' + d.name + '</span>';
					if(d.children !== undefined){
						html += '<span class="selectAll">&#9744;</span><span class="expand">&#8853;</span>';
					}
					return html;
				})
				.append('ul').attr('class', 'childList').classed('hidden', true);

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

		function select(){

		}

		function expandChilds(el){
			var _el = d3.select(el);
			var _ch = d3.select(_el.node().nextSibling);
			var _hh = _ch.classed('hidden');
			_ch.classed('hidden', !_hh);
			_el.html(_hh ? '&#8854;' : '&#8853;');
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
