/* Nathan Irwin
 * CMPM 20
 * Assignment 2
 */

$(document).ready(function(){
		var keys = [];
		window.addEventListener("keydown",
		function(k){
			keys[k.keyCode] = true;
			switch(k.keyCode){
				// Arrow keys and space bar
				case 37: case 39: case 38: case 40: 
				case 32: k.preventDefault(); break;
				default: break;
			}
		},
		false);
		window.addEventListener('keyup',
		function(k){
			keys[k.keyCode] = false;
		},
		false);
		
		//Define variables
		var canvas = $("#canvas")[0];
		var ctx = canvas.getContext("2d");
		var w  = $("#canvas").width();
		var h = $("#canvas").height();
		var cellW = 10;
		var dir;
		var food;
		var foodArray = [];
		var noneEaten;
		var spoiled;
		var starve;
		var score;
		var gameIsOver;
		var snakeArray;
		var framerate;
		
		function init(){
			// Set default direction
			dir = "right";
			createSnake();
			createFood();
			noneEaten = true;
			spoiled = 99;
			starve = 240;
			score = 0;
			ticks = 0;
			framerate = 120;
			gameIsOver = false;
			console.log("This is a test");
			if(typeof game_loop != "undefined"){
				clearInterval(game_loop);
			}
			game_loop = setInterval(paint, framerate);
		}
		console.log("This is also a test");
		init();
		
		function createSnake(){
			var length = 5;
			snakeArray = [];
			for (var i = length - 1; i >= 0; i--){
				snakeArray.push({x:i, y:0});
			}
		}
		
		function createFood(){
			food = {
					x: Math.round(Math.random() * (w - cellW) / cellW),
					y: Math.round(Math.random() * (h - cellW) / cellW),
					ticks: 0, // food timer
				};
				// add food to foodArray
				foodArray.push(food);
		}
		
		function paint(){
			if(gameIsOver){
				return;
			}
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = "black";
			ctx.strokeRect(0, 0, w, h);
			
			// Create vars for x and y loc of snake head
			var newHeadX = snakeArray[0].x;
			var newHeadY = snakeArray[0].y;
			
			// Determine where next head will go
			if(dir == "right"){
				newHeadX++;
			}
			else if(dir == "left"){
				newHeadX--;
			}
			else if(dir == "up"){
				newHeadY--;
			}
			else if(dir == "down"){
				newHeadY++;
			}
			
			// Game end check
			if(newHeadX == -1 || newHeadX == w / cellW || newHeadY == -1 || newHeadY == h / cellW || checkColl(newHeadX, newHeadY, snakeArray)){
				gameOver();
				return;
			}
			
			// Snake eats food
			for(var i = 0; i < foodArray.length; i++){
				if(newHeadX == foodArray[i].x && newHeadY == foodArray[i].y){
					if(foodArray[i].ticks > spoiled){
						// food is bad, shrink
						var tail = snakeArray.pop();
						if(snakeArray.length == 0){
							gameOver();
						}
						tail = snakeArray.pop();
						if(snakeArray.length == 0){
							gameOver();
						}
						tail.x = newHeadX;
						tail.y = newHeadY;
						poisoned = true;
					}
					else{
						var tail = { x: newHeadX, y: newHeadY};
						score++;
					}
					// Restart ticks
					ticks = 0;
					// get rid of food
					foodArray.splice(i, 1);
					// increase speed
					framerate -= 5;
					clearInterval(game_loop);
					game_loop = setInterval(paint, framerate);
					// create the new food
					createFood();
					noneEaten = false;
					break;
				}
			}
			if(noneEaten){
				var tail = snakeArray.pop();
				tail.x = newHeadX;
				tail.y = newHeadY;
			}
			noneEaten = true;
			if(ticks % 60 == 0 && ticks != 0){
				// Create food every 60 ticks
				createFood();
			}
			for(var i = 0; i < foodArray.length; i++){
				if(foodArray[i].ticks > 160){
					foodArray.splice(i, 1);
				}
			}
			
			if(ticks > starve){
				// Warning text for starving
				ctx.font = "25pt Times";
				ctx.fillStyle = "black";
				ctx.fillText("Starving! Must eat food!", 5, 35);
			}
			else{
				ctx.font = "25pt Times";
				ctx.fillStyle = "white";
				ctx.fillText("Starving! Must eat food!", 5, 35);
			}
			
			if(ticks >= starve + 120 && ticks % 60 == 0){
				// Lose a part after 60 ticks if starving
				tail = snakeArray.pop();
				if(snakeArray.length == 0){
					gameOver();
				}
				tail.x = newHeadX;
				tail.y = newHeadY;
			}
			// Put tail ack as first cell
			snakeArray.unshift(tail);
			paintSnake();
			
			// Paint the food
			for(var i = 0; i < foodArray.length; i++){
				if(foodArray[i].ticks > spoiled){
					paintCell(foodArray[i].x, foodArray[i].y, "lime", "Black");
				}
				else{
					paintCell(foodArray[i].x, foodArray[i].y, "red", "white");
					ctx.font = "7pt Times";
					ctx.fillStyle = "lime";
					// Food timer
					var timer = "" + foodArray[i].ticks;
					ctx.fillText(timer, foodArray[i].x * cellW, foodArray[i].y * cellW + 9);
				}
			}
			
			// Paint the score
			var scoreText = "Score: " + score;
			ctx.font = "25pt Times";
			ctx.fillStyle = "Orange";
			ctx.fillText(scoreText, 5, h - 5);
			ctx.strokeStyle = "Black";
			ctx.strokeText(scoreText, 5, h - 5);
			
			var snakeLenText = "Length: " + snakeArray.length;
			ctx.font = "12pt Times";
			ctx.fillStyle = "black";
			ctx.fillText(snakeLenText, 135, h - 5);
			
			// tick timer
			ticks++;
			for(var i = 0; i < foodArray.length; i++){
				// increment individual timers
				foodArray[i].ticks++;
			}
		}
		
		function paintSnake(){
			for(var i = 0; i < snakeArray.length; i++){
				var curr = snakeArray[i];
				if(ticks > 240){
					// Starving
					if(ticks % 2 == 0){
						paintCell(curr.x, curr.y, "red", "white");
					}
					else{
						paintCell(curr.x, curr.y, "purple", "white");
					}
				}
				else{
					// paint the snake normally
					if(i == 0){
						var head = document.getElementById("part");
						ctx.drawImage(head, curr.x * cellW, curr.y * cellW, cellW, cellW);
						}
					else if(i == snakeArray.length - 1){
						var tail = document.getElementById("part");
						ctx.drawImage(tail, curr.x * cellW, curr.y * cellW, cellW, cellW);
					}
					else{
						var body = document.getElementById("part");
						ctx.drawImage(body, curr.x * cellW, curr.y * cellW, cellW, cellW);
					}
				}
			}
		}
		
		// gameOver(): Displays game over screen
		function gameOver(){
			while(foodArray.length != 0){
				// empty foodArray
				foodArray.pop();
			}
			ctx.save();
			ctx.font = 'bold 40px sans-serif';
			ctx.fillStyle = 'orange';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			var cenX = w / 2;
			var cenY = w / 2;
			var scoreText = "Your Score: " + score;
			ctx.strokeText(scoreText, cenX, cenY - 50);
			ctx.fillText(scoreText, cenX, cenY - 50);
			ctx.font = 'bold 30px sans-serif';
			ctx.fillStyle = '#000';
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			ctx.strokeText('Game Over', cenX, cenY - 10);
			ctx.fillText('Game Over', cenX, cenY -10);
			ctx.font = 'bold 15px sans-serif';
			ctx.strokeText('Press space to restart game', cenX, cenY + 15);
			ctx.fillText('Press space to restart game', cenX, cenY + 15);
			
			gameIsOver = true;
			ctx.restore();
		}
		
		// paintCell(): paint cell blocks
		function paintCell(x, y, fill, stroke){
			ctx.fillStyle = fill;
			ctx.fillRect(x * cellW, y * cellW, cellW, cellW);
			ctx.strokeStyle = stroke;
			ctx.strokeRect(x * cellW, y * cellW, cellW, cellW);
		}
		
		// checkColl(): check if x,y coord are in array of cells
		function checkColl(x, y, array){
			for(var i = 0; i < array.length; i++){
				if(array[i].x == x && array[i].y == y){
					return true;
				}
			}
			return false;
		}
		
		$(document).keydown(function(k){
			var key = k.which;
			if(key == "37" && dir != "right" && !gameIsOver){
				// left arrow
				dir = "left";
			}
			else if(key == "38" && dir != "down" && !gameIsOver){
				// up arrow
				dir = "up";
			}
			else if(key == "39" && dir != "left" && !gameIsOver){
				// right arrow
				dir = "right";
			}
			else if(key == "40" && dir != "up" && !gameIsOver){
				// down arrow
				dir = "down";
			}
			else if(key = "32" && gameIsOver){
				init();
			}
		})
})
