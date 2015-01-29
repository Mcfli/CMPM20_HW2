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

function init(){
	dir = "right";
	createSnake();
	createFood();
	score = 0;
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
}
