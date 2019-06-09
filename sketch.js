const w_HEIGHT = 500;
const w_WIDTH = 500;

let fps = 30;
let currentTimeoutID = -1;

const rocketSize = 20;

let rocketPopulationSize = 50;
let rockets = [];
let rocketImg;
let rocketImgRatio = 1;

let obstacles = [];

let spawnPoint;
let target;
let notActiveRockets;

let algorithm;

function preload()
{
	rocketImg = loadImage("rocket1.png");
}

function setup() {
	createCanvas(500, 500);

	frameRate(fps);

	rocketImgRatio = rocketImg.height / rocketImg.width;
	spawnPoint = createVector(width / 2.0, height - rocketSize * rocketImgRatio * 2);
	target = new Target(createVector(400, 100), 30);
	notActiveRockets = 0;

	for(let i of Array(rocketPopulationSize).keys())
	{
		rockets.push(new Rocket(spawnPoint, 20, rocketImgRatio, (imgWidth, imgHeight) => {
			imageMode(CENTER);
			image(rocketImg, 0, 0, imgWidth, imgHeight);
		}));
	}

	obstacles.push(new Obstacle(330, 200, 150, 30));

	let fitFunc = function(r) {
		let distance = r.pos.dist(target.pos);
		distance = max(distance, 1.0);
		return 1.0 / distance;
	};
	algorithm = new GenAlgorithm(fitFunc, 0.95, 0.3, 0.05);
	algorithm.loadInitialPopulation(rockets);
	currentTimeoutID = window.setTimeout(rocketsTimeout, 20 * 1000);
}

function draw() {
	background(255);
	showWallsBoundaries();
	let dt = 1.0 / fps;

for(let o of obstacles) {
	o.display();
}

	for(let rocket of algorithm.population) {
		rocket.physicsUpdate(dt);
		rocket.display();
	}

	detectWallCollisions();
	detectObstacleCollisions();
	detectTargetHit();

	target.display();

	if(notActiveRockets == algorithm.population.length)
	{
		if(currentTimeoutID != -1)
		{
			window.clearTimeout(currentTimeoutID);
			currentTimeoutID = -1;
		}

		notActiveRockets = 0;
		algorithm.runGeneration();

		for(let rocket of algorithm.population)
		{
			rocket.resetToDefaultState();
		}
		currentTimeoutID = window.setTimeout(rocketsTimeout, 20 * 1000);
	}

}

function showWallsBoundaries() 
{
	noFill();
	strokeWeight(3);
	stroke(200, 0, 50);
	rect(0, 0, width, height);
}

function detectWallCollisions()
{
	for(let r of algorithm.population.filter(r => r.active)) {
		if(!r.within(0, 0, width, height))
		{
			r.active = false;
			notActiveRockets += 1;
		}
	}
}

function detectObstacleCollisions()
{
	for(let r of algorithm.population.filter(r => r.active))
	{
			for(let o of obstacles)
			{
				if(o.containsPoint(r.pos))
				{
					r.active = false;
					notActiveRockets += 1;
				}
			}
		
	}
}

function detectTargetHit()
{
	for(let r of algorithm.population.filter(r => r.active))
	{
		if(target.isHitByRocket(r))
		{
			r.active = false;
			notActiveRockets += 1;
			console.log("HIT!!!");
		}
	}
}

function whereIsMouse()
{
	stroke(1);
	if (mouseIsPressed) {
		fill(0);
	} 
	else {
		fill(255);
	}
	ellipse(mouseX, mouseY, 20, 20);
}

function rocketsTimeout() {
	for(let r of algorithm.population.filter(r => r.active))
	{
		r.active = false;
		notActiveRockets += 1;
	}
	currentTimeoutID = -1;
}