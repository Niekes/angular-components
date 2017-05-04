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
			d = d3.select(el).append('div').attr('class', 'dropdown');
		};

		$dropdownCtrl.$onChanges = function(changes){
			depth = 0;
			update(changes.data.currentValue);
		};

		function update(data){

			var list = d.selectAll('ul.list').data(data, key);

			list
				.exit()
				.remove();

			var e = list
				.enter()
				.append('ul')
				.attr('class', 'list')
				.merge(list);

			generateList(e);

			d3.selectAll('span.selectAll').on('click', function(){
				selectAll(d3.select(this.parentNode).node().__data__.children);
				updateList();
			});
		}

		function generateList (list) {

			var _filtered = list.filter(function(d){
				return d.children !== undefined;
			});

			var item = list.selectAll('li.item').data(function(d) {
				return [d];
			});

			var itemContainsList = _filtered.selectAll('li.item-contains-list').data(function(d) {
				return [{children: d.children}];
			});

			item
				.enter()
				.append('li')
				.attr('class', 'item')
				.merge(item)
				.each(function(d){
					d.depth = depth;
				})
				.classed('selected', function(d){
					return d.selected;
				})
				.html(makeHtmlForItem)
				.on('click', function(){
					if(d3.event.target.tagName === 'LI'){
						select(this);
						updateList();
					}
				});

			item.exit().remove();

			var _i = itemContainsList
				.enter()
				.append('li')
				.attr('class', 'item-contains-list')
				.merge(itemContainsList)
				.append('ul')
				.attr('class', 'list');

			itemContainsList.exit().remove();

			var _l = itemContainsList.select('ul.list').merge(_i).selectAll('li.item').data(function(d) {
				return d.children;
			}).enter();

			if(!_l.empty()){
				depth++;
				generateList(_l);
			}
		}

		function makeHtmlForItem(d){
			var _n = document.createElement('span');
			_n.innerHTML = d.name;
			var _html = _n.outerHTML;
			if(d.children){
				var _t = d.children.every(el => el.selected === true);
				var _s = document.createElement('span');
				_s.setAttribute('class', 'selectAll');
				_s.innerHTML = _t ? sym.deselectAll : sym.selectAll;
				_html += _s.outerHTML;
			}
			return _html;
		}

		function selectAll(els){
			var _t = els.every(el => el.selected === true);
			els.forEach(function(e){
				e.selected = !_t;
			});
		}

		function select(el){
			d3.select(el).node().__data__.selected = !d3.select(el).node().__data__.selected;
		}

		function updateList(){
			depth = 0;
			update(getData());
		}

		function getData(){
			return d.selectAll('div.dropdown > ul.list').data();
		}

		$dropdownCtrl.init();

	}
});
