'use strict';

app.controller('scatterplotCtrl', function($interval){

	var $scatterplotCtrl = this;
	var names = ["Heath", "Almeta", "Marjorie", "Verdie", "Gudrun", "Rosaura", "Gerald", "Weldon", "Ocie", "Lan", "Yuko", "Basil", "Deb", "Treva", "Shae", "Irmgard", "Chanelle", "Nan", "Thomasena", "Dylan", "Janel", "Chanel", "Drucilla", "Cathleen", "Samara", "Emiko", "Sheree", "Roscoe", "Saul", "Angelique", "Nedra", "Jinny", "Stacey", "Judy", "Fae", "Carola", "Royce", "Veronika", "Tinisha", "Lupe", "Fannie", "Carly", "Sasha", "Lane", "Benita", "Trevor", "Hermina", "Monet", "Joshua", "Reba", "Woodrow", "Vergie", "Amiee", "Shannon", "Arturo", "Marlo", "Jeannetta", "Derek", "Jaleesa", "Eilene", "Albertina", "Harold", "Maryalice", "Sandee", "Monnie", "Akilah", "Cher", "Cami", "Shenika", "Nila", "Tinisha", "Remona", "Coleen", "Hui", "Rosella", "Seema", "Rea", "Jeanine", "Luanne", "Eli", "Johanna", "Homer", "Krystina", "Val", "Arianne", "Eleni", "Reynalda", "Joanna", "Sherlyn", "Cletus", "Verona", "Ardelia", "Daina", "Signe", "Betsy", "Beth", "Molly", "Adria", "Glennie"];

	var user = function(){
		return {
			name: names[_randomIntBetweenMinMax(0, names.length-1)],
			date: _randomDate(new Date(2010, 0, 1), new Date()),
			sum:  _randomIntBetweenMinMax(-2000, 10000),
			radius: _randomIntBetweenMinMax(4, 10),
			group: _randomIntBetweenMinMax(0, 2),
		};
	}

	function _randomIntBetweenMinMax(min, max){
    	return Math.floor(Math.random()*(max-min+1)+min);
	}

	function _randomDate(start, end) {
    	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	}

	function updateData(){
		var users = [];
		for (var i = _randomIntBetweenMinMax(2, 100); i >= 0; i--) {
			users.push(user());
		}
		$scatterplotCtrl.users = users;
	}

	updateData();
	$interval(updateData, 5000);
});
