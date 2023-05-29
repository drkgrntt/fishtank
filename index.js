const critters = [];
const food = [];
const poison = [];

let debug;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight - 20);
  for (let i = 0; i < 50; i++) {
    const x = random(width);
    const y = random(height);
    critters[i] = new Critter(x, y);
  }

  for (let i = 0; i < 40; i++) {
    const x = random(width);
    const y = random(height);
    food.push(createVector(x, y));
  }

  for (let i = 0; i < 20; i++) {
    const x = random(width);
    const y = random(height);
    poison.push(createVector(x, y));
  }

  debug = createCheckbox();
}

function mouseDragged() {
  critters.push(new Critter(mouseX, mouseY));
}

function draw() {
  background(0);

  // Create food
  if (random(1) < 0.2) {
    const x = random(width);
    const y = random(height);
    food.push(createVector(x, y));
  }

  // Create poison
  if (random(1) < 0.01) {
    const x = random(width);
    const y = random(height);
    poison.push(createVector(x, y));
  }

  for (let i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4, 4);
  }

  for (let i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 4, 4);
  }

  for (let i = critters.length - 1; i >= 0; i--) {
    critters[i].boundaries();
    critters[i].behaviors(food, poison);
    critters[i].update();
    critters[i].display();
    const newVehicle = critters[i].clone();
    if (newVehicle != null) {
      critters.push(newVehicle);
    }
    if (critters[i].dead()) {
      const x = critters[i].position.x;
      const y = critters[i].position.y;
      food.push(createVector(x, y));
      critters.splice(i, 1);
    }
  }
}
