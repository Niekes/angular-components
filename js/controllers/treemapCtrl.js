'use strict';

app.controller('treemapCtrl', function($interval){

	var $treemapCtrl = this;
	var d1 = { 'name': 'Eve', 'children': [ { 'name': 'Cain' }, { 'name': 'Seth', 'children': [ { 'name': 'Enos' }, { 'name': 'Noam' } ] }, { 'name': 'Abel' }, { 'name': 'Awan', 'children': [ { 'name': 'Enoch' } ] }, { 'name': 'Azura' } ] };
	var d2 = { 'name': 'Eve', 'children': [ { 'name': 'Cain' }, { 'name': 'Seth', 'children': [ { 'name': 'Enos' }, { 'name': 'Noam' }, { 'name': 'Kallo' }, { 'name': 'Jochen' } ] }, { 'name': 'Abel' }, { 'name': 'Awan', 'children': [ { 'name': 'Enoch' }, { 'name': 'Harry' } ] }, { 'name': 'Azura' } ] };
	var i = 0;
	function updateData(){
		$treemapCtrl.data = i % 2 === 0 ? d1 : d2;
		// console.log(i % 2 === 0 ? d1 : d2);
		i++;
	}

	updateData();

	$interval(function(){
		updateData();
	}, 2500);
});
