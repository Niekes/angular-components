'use strict';

app.controller('dropdownCtrl', function($scope, $interval){

	var $dropdownCtrl = this;
	var al = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
	var data = [];
	var count;

	function rndInt(min, max){
		return Math.floor(d3.randomUniform(min, max)());
	}

	function updateData(){
		var i = rndInt(1, al.length);
		makeItem(i);
		$dropdownCtrl.data = data;
	}

	function makeItem(_i){
		count = 0;
		if(_i >= 0){
			var _j = rndInt(1, 5);
			var _o = {name: al[_i], children: []};
			makeChildren(_j, _o);
			data.push(_o);
			makeItem(_i - 1);
		}
	}

	function makeChildren(_j, _o){
		if(_j >= 0){
			count++;
			var name = '';
			for (var i = 0; i < count + 1; i++) {
				name += al[_j];
			}
			var _p = {name: name, children: []};
			var nome = '';
			for (var k = 0; k < name.length + 1; k++) {
				nome += name[1];
			}
			for (var m = 0; m < rndInt(1, 5); m++) {
				_p.children.push({name: nome});
			}
			_o.children.push(_p);
			makeChildren(_j - 1, _p);
		}
	}
	updateData();

	$dropdownCtrl.updateData = function(){
		data = [];
		updateData();
	};
});
