'use strict';

app.controller('treemapCtrl', function($interval){

	var $treemapCtrl = this;
	var d1 = { 'name': 'Eve', 'children': [ { 'name': 'Cain', 'value': 3 }, { 'name': 'Seth', 'value': 2 }, { 'name': 'Abel', 'value': 1 }, { 'name': 'Awan', 'value': 1 }, { 'name': 'Azura', 'value': 0.5 } ] };

	function updateData(){
		$treemapCtrl.data = d1;
	}

	updateData();

	// $interval(function(){
	// 	updateData();
	// }, 10000);
});
