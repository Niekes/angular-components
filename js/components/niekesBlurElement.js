'use strict';

app.component('niekesBlurElement', {
	bindings: {
    	options: '='
  	},
  	templateUrl: './templates/niekes-blur-element.html',
  	controllerAs: 'niekesBlurElementCtrl',
	controller: function(){

		function init(){

			var bg = document.querySelector('div.blurElement');
			var box = document.querySelector('div.blurElementTemplate');
			var boxBg = document.querySelector('div.blurElementTemplateBG');
			var image = new Image();
	    	image.src = 'img/bg.jpg';
	    	var h = bg.offsetWidth/image.width * bg.offsetHeight;

			var computedBg = {
				width: bg.offsetWidth > image.width ? image.width : bg.offsetWidth,
				height: h > image.height ? image.height : h
			};

			var computedBox = {
				left: -box.offsetLeft,
				top: -box.offsetTop
			};

			boxBg.style.backgroundPosition = computedBox.left + 'px ' + computedBox.top +  'px';
			boxBg.style.backgroundSize = computedBg.width + 'px ' + computedBg.height +  'px';

		}

		window.onresize = function() {
			init();
		};

		init();
	}
});