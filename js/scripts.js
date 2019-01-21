// we use  Object Oriented Programming

// MVC architectural pattern. (Model-View-Controller)
// --------------------------------------------------

// View

var view = {                                                        //here we made object view

	displayMessage: function(msg){                                  //this method take message from HTML and show this message on display at the left. Method displayMessage take parametr msg
		let messageArea = document.querySelector("#messageArea");   //Here we get an element from HTML
		messageArea.innerHTML = msg;                                //here we put this element to the method displayMessage from msg
	},


	displayHit: function(location){                                 //this method interact with battle area and display ship(s) if was hit
		let cell = document.getElementById(location);               //here we take an element from the method - location, and safe this to the vareable sell
		cell.setAttribute("class" , "hit");							//method add class with "hit" parametr to the html 
	},

	displayMiss: function(location){								//this method interact with battle area and display inscription "MISS" , if was miss
		let cell = document.getElementById(location)				//here we take an element from the method - location, and safe this to the vareable sell
		cell.setAttribute("class" , "miss");						//method add class with "miss" parametr to the html
	}
}




// Model

let model = {
	boardSize: 7,    // size of play area
	numShips: 3,     // number ships in the game
	shipLength: 3,    // length ship in cell
	shipsSunk: 0,    // number of sunk ship(s)


	 ships: [                                                                   // property
		 { locations: [0 , 0 , 0] , hits: ["" , "" , ""] },
		 { locations: [0 , 0 , 0] , hits: ["" , "" , ""] },
		 { locations: [0 , 0 , 0] , hits: ["" , "" , ""] }
	],

                                                                               // 16 LESSO method which make a shot and look are you hit or not. (здесь мы преребираем массив кораблей циклом, последовательно проверяя каждый корабль, и если попадение совпадает с позицией корабля, мы )

	fire: function(guess) {                                                     //here method get coordinates of fire
		for (let i = 0; i < this.numShips; i++) {                              //the cycle plunk array "ships"
			let ship = this.ships[i];                                          //here we create varable "ship" which equals one element of array			                                                                   
			let index = ship.locations.indexOf(guess);                          //we get array of cells which occupies ship. Method "indexOf" searching specified point(guess), if this point found this method returns index, if there is no point returns -1
			
			if(ship.hits[index] === "hit"){                                                    //here we make check, if condition right , 				                                    	                                        // here we work with object "view" from whom call method "displayHit" and this method get location (our shot), so we get "guess" to this method
				view.displayMessage("Oops, you already hit that location!");                                   // and here we want send a message to user, we use object "view" again and call method "displayMessage"
                  return true;				
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);                                           // to the method "displayMiss" we get coordinates of shot
				view.displayMessage("HIT!");                                // and here we just show message to user
						
		        if (this.isSunk(ship)) {
		        	view.displayMessage("You sank my battleship!");
		        	this.shipsSunk++;
		        }
		        return true;
	        }
	    }    
		view.displayMiss(guess);
		view.displayMessage("You missed");
		return false;
	},











	isSunk: function(ship) {                                               // if all three shots got to one ship it is sunk. here we check
		for(let i = 0; i < this.shipLength; i++) {
			if(ship.hits[i] !== "hit"){
				return false;
			}
		}
		return true;                                                      //if array in the properties has three "hit" ship is sunk and return true
	},	



// three methods responsible forgeneration of ships on the playing field

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	// метод создает один корабль
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	// метод получает один корабль и проверяет, что тот не перекрывается с другими кораблями
	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
};





//Controller                                                            // take and processing coordinates of shot, look for number of shoots,  be work with "model" where be processing there two steps and look for end of the game(when three ships will be sunk) 

let controller = {
	gusses: 0,

	processGuess: function(guess){                                      // this function we made for tracking the number of shots, also make a request to the model to update the shots 
		let location = parceGuess(guess);
		if (location) {
			this.gusses++;
			let hit = model.fire(location);                             //method "fire" return "true" if there was hit
			if (hit && model.shipsSunk === model.numShips){             //here we check number of sunk ships which equally number of allocated ships in the game
                 view.displayMessage("Вы потопили " + model.numShips + " корабля(ей) за: " + this.gusses + "выстрелов");
			}                             
		}

	}

}






function parceGuess(guess){                                            // this function get and process coordinates of shoots
	let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if(guess === null || guess.length !== 2){
		alert("Вы ввели неверные координаты");
	}else {
		firstChar = guess.charAt(0);                                    // here we extract the first character from the string. User entry letter and number (А0) 
		let row = alphabet.indexOf(firstChar);                          // method "indexOf" return to us index (number 0, 1, 2, 3 ...) from array "alphabet"
		let column = guess.charAt(1);
		

		if (isNaN(row) || isNaN(column)){                                //here function "isNaN" chech do entry dates are numbers
			alert("Вы ввели неверные координаты");
		}else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize ){
		    alert("Вы ввели неверные координаты");
		}else {
			return row + column;                                          //here we retunn result after checking and fold first result with second
		}
	}
	return null;
}




function init(){
	let fireButton = document.getElementById("fireButton");               // here we get a link to the "fireButton" button
	fireButton.onclick = handleFireButton;                                 //here appoint event handler. after push on the button start function "handleFireButton"

	let guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;                               // we appoint event handler. after after pussing key "Enter" we start function "handleKeyPress"
	model.generateShipLocations();
}



function handleFireButton(){                                                // 
	let guessInput = document.getElementById("guessInput");                // here we reference to HTML to input (where user put coordinates) by id "guessInput"
	let guess = guessInput.value;                                          // here we take value from this input
	controller.processGuess(guess);                                        // here we transfer this value (A0) to the function "processGuess"

	guessInput.value = "";                                                 // here clean input frame (where we write A0)
}



function handleKeyPress(e){                                                // parametr - Event(e). here we adress to "e.keyCode" and get which botton was pushed
	let fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {                                                // 13 - this is indificator of "Enter" keypress on the keyboard. Enter = 13. if user pushed Enter this is the same that buttun "fire" which user push with mouse
		fireButton.click();                                                // this imitates mouse click
		return false;
	}
}

window.onload = init;                                                      // function "init" we need activation. here we activation it


























