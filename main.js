/* Nathan Irwin
 * CMPM 20
 * Assignment 2
 */

$(document).ready(function(){
		var keys = [];
		// add keydown listener
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
		// add keyup listener
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
		var spoiled;
		var score;
		var gameIsOver;
		var snakeArray;
		var framerate;
		
		// init(): initialize variables
		function init(){
			// Set default direction
			dir = "right";
			createSnake();
			createFood();
			spoiled = 99;
			score = 0;
			ticks = 0;
			framerate = 120;
			gameIsOver = false;
			if(typeof game_loop != "undefined"){
				clearInterval(game_loop);
			}
			game_loop = setInterval(paint, framerate);
		}
		init();
		
		// createSnake(): creates the snake
		function createSnake(){
			var length = 5;
			snakeArray = [];
			for (var i = length - 1; i >= 0; i--){
				snakeArray.push({x:i, y:0});
			}
		}
		
		// createFood(): creates food in random spots
		function createFood(){
			food = {
					x: Math.round(Math.random() * (w - cellW) / cellW),
					y: Math.round(Math.random() * (h - cellW) / cellW),
					ticks: 0, // food timer
				};
				// add food to foodArray
				foodArray.push(food);
		}
		
		// paint(): updates snake and food
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
						tail.x = newHeadX;
						tail.y = newHeadY;
						// increase speed
						framerate -= 10;
						}
					else{
						var tail = { x: newHeadX, y: newHeadY};
						snakeArray.push(tail);
						score++;
					}
					// Restart ticks
					ticks = 0;
					// get rid of food
					foodArray.splice(i, 1);
					clearInterval(game_loop);
					game_loop = setInterval(paint, framerate);
					// create the new food
					createFood();
					break;
				}
			}
			if(!gameIsOver){
				var tail = snakeArray.pop();
				tail.x = newHeadX;
				tail.y = newHeadY;
			}
			if(ticks % 60 == 0 && ticks != 0){
				// Create food every 60 ticks
				createFood();
			}
			// destory bad food
			for(var i = 0; i < foodArray.length; i++){
				if(foodArray[i].ticks > 160){
					foodArray.splice(i, 1);
				}
			}
			// Put tail ack as first cell
			snakeArray.unshift(tail);
			paintSnake();
			
			// Paint the food
			for(var i = 0; i < foodArray.length; i++){
				if(foodArray[i].ticks > spoiled){
					paintCell(foodArray[i].x, foodArray[i].y, "red", "Black");
				}
				else{
					paintCell(foodArray[i].x, foodArray[i].y, "blue", "white");
					ctx.font = "7pt Times";
					ctx.fillStyle = "white";
					// Food timer
					var timer = "" + ( 100 - foodArray[i].ticks);
					ctx.fillText(timer, foodArray[i].x * cellW, foodArray[i].y * cellW + 9);
				}
			}
			
			// Paint the score
			var scoreText = "Score: " + score;
			ctx.font = "20pt Times";
			ctx.fillStyle = "Blue";
			ctx.fillText(scoreText, 5, h - 5);
			ctx.strokeStyle = "Black";
			ctx.strokeText(scoreText, 5, h - 5);
			
			var snakeLenText = "Length: " + snakeArray.length;
			ctx.font = "12pt Times";
			ctx.fillStyle = "grey";
			ctx.fillText(snakeLenText, 375, h - 5);
			
			// tick timer
			ticks++;
			for(var i = 0; i < foodArray.length; i++){
				// increment individual timers
				foodArray[i].ticks++;
			}
		}
		
		// paintSnake(): draw snake
		function paintSnake(){
			for(var i = 0; i < snakeArray.length; i++){
				var curr = snakeArray[i];
				if(ticks > 240){
					// Starving
					if(ticks % 2 == 0){
						paintCell(curr.x, curr.y, "red", "white");
					}
					else{
						paintCell(curr.x, curr.y, "blue", "white");
					}
				}
				else{
					// paint the snake normally
					paintCell(curr.x, curr.y, "black", "white");
				}
			}
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
		
		// gameOver(): Displays game over screen
		function gameOver(){
			while(foodArray.length != 0){
				// empty foodArray
				foodArray.pop();
			}
			ctx.save();
			ctx.font = 'bold 45px arial';
			ctx.fillStyle = 'red';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			var cenX = w / 2;
			var cenY = w / 2;
			ctx.strokeText('Game Over', cenX, cenY - 50);
			ctx.fillText('Game Over', cenX, cenY - 50);
			ctx.font = 'bold 30px arial';
			ctx.fillStyle = 'green';
			var scoreText = "Your Score: " + score;
			ctx.strokeText(scoreText, cenX, cenY - 10);
			ctx.fillText(scoreText, cenX, cenY -10);
			ctx.font = 'bold 15px arial';
			ctx.fillStyle = '#000';
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			ctx.strokeText('Press space to restart', cenX, cenY + 15);
			ctx.fillText('Press space to restart', cenX, cenY + 15);
			gameIsOver = true;
			ctx.restore();
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