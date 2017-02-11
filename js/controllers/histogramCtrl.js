'use strict';

app.controller('histogramCtrl', function($timeout){

	var $histogramCtrl = this;

	var img = new Image();
    var	canvas = document.getElementById('canvas');
    var	context = canvas.getContext('2d');
    var	src = '../../img/cameraman.png';
    var imageData;

	img.crossOrigin = 'Anonymous';

	img.onload = function() {
    	canvas.width = this.width;
    	canvas.height = this.height;
    	context.drawImage(img, 0, 0);
		imageData = context.getImageData(0, 0, this.width, this.height).data;
	};

	img.src = src;

	function updateData(){
		$histogramCtrl.data = imageData;
	}

	$timeout(function() {
		updateData();
	}, 100);


});
