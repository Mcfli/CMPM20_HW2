/* Nathan Irwin
 * CMPM 20
 * Assignment 2
 */

use2D = true;
initGame("canvas");

// Create an array to store the snake
var snakeArray;

var dir;
var food;
var score;
var cw = 10;
var w = canvas.width();
var h = canvas.height();
var ctx = canvas.getContext("2d");

function init(){
	dir = "right";
	createSnake();
	createFood();
	score = 0;
	
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 60);
}
init();

gInput.addBool(37, "left");
gInput.addBool(38, "up");
gInput.addBool(39, "right");
gInput.addBool(40, "down");

function createSnake(){
	var length = 5;
	snakeArray = [];
	for(var i = 0; i < length; i++){
		snakeArray.push({x:i,y:0});
	}
}

function createFood(){
	food = {
		x:Math.round(Math.random()*(w-cw)/cw),
		y:Math.round(Math.random()*(h-cw)/cw),
	};
}

function paint(){
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0,0,w,h);
	
	var nx = snakeArray[0].x;
	var ny = snackArray[0].y;
	
	if(dir == "right") nx++;
	else if(dir == "left") nx--;
	else if(dir == "up") ny--;
	else if(dir == "down") ny++;
	
	// Check if game over
	if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || checkColl(nx,nx,snakeArray)){
		// restart
		init();
		return;
	}
	
	if(nx == food.x && ny == food.y){
		var tail = {x:nx,y:ny};
		score++;
		createFood();
	}
	else{
		var tail = snakeArray.pop();
		tail.x = nx;
		tail.y = ny;
	}
	
	// put back tail
	snakeArray.unshift(tail);
	
	for(var i = 0; i < snakeArray.length; i++){
		var c = snakeArray[i];
		// paint 10px wide cells
		paintCell(c.x,c.y);
	}
	
	// paint the food
	paintCell(food.x,food.y);
	
	// Score text
	var scoreText = "Score:" + score;
	ctx.fillText(scoreText,5,h-5);
}

function paintCell(x,y){
	ctx.fillStype = "blue";
	ctx.fillRect(x*cw,y*cw,cw,cw);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*cw,y*cw,cw,cw);
}

function checkColl(x,y,array){
	for(var i = 0; i < array.length; i++){
		if(array[i].x == x && array[i].y == y){
			return true;
		}
		return false;
	}
}