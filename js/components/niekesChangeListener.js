'use strict';

app.component('niekesChangeListener', {
	bindings: {
    	options: '<'
  	},
  	templateUrl: './templates/niekes-change-listener.html',
  	controllerAs: 'niekesChangeListenerCtrl',
	controller: function(){

		this.$onChanges = function (changes) {
			this.valueChanged = changes.options.currentValue;
    	};
	}
});