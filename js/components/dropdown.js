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
		var sym = {
			plus: '&#8853',
			minus: '&#8854',
			selectAll: '&#9744;',
			deselectAll: '&#9745;'
		};
		var key = function(d){ return d.name; };
		var hidden = false;

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

			d3.selectAll('span.selectAll').on('click', function(){
				selectAll(this);
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
					var html = '<span data-depth="'+depth+'" class="'+cssC+'">' + d.name + '</span>';
					var expandSym = hidden ? sym.plus : sym.minus;
					if(d.children !== undefined){
						html += '<span class="selectAll">&#9744;</span><span class="expand">'+ expandSym +'</span>';
					}
					return html;
				})
				.append('ul').attr('class', 'childList').classed('hidden', hidden);

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

		function select(el){
			var _el = d3.select(el);
			var _hh = _el.classed('selected');
			_el.classed('selected', !_hh);
		}

		function selectAll(el){
			var _el = d3.select(el);
			var _ch = d3.select(_el.node().nextSibling);
			var _dh = d3.select(_ch.node().nextSibling);
			var _sp = _dh.node().getElementsByClassName('it');
			var _de = _dh.node().__data__.depth + 1;
			var _se = _el.html().charCodeAt(0) === 9744 ? true : false;

			_el.html(_se ? sym.deselectAll : sym.selectAll);

			for (var i = 0; i < _sp.length; ++i) {
				var _d = +d3.select(_sp[i]).attr('data-depth');
				if(_d === _de){
					d3.select(_sp[i]).classed('selected', _se);
				}
			}
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
