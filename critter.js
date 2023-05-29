class Critter {
  constructor(x, y, dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.position = createVector(x, y);
    this.size = 4;
    this.maxspeed = 5;
    this.maxforce = 0.5;

    this.health = 1;

    this.dna = new DNA(dna);
  }

  // Method to update location
  update() {
    this.health -= 0.005;

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  behaviors(good, bad) {
    const steerG = this.eat(good, 0.2, this.dna.foodAwareness);
    const steerB = this.eat(bad, -1, this.dna.poisonAwareness);

    steerG.mult(this.dna.foodAttraction);
    steerB.mult(this.dna.poisonAttraction);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  clone() {
    if (random(1) < 0.002) {
      return new Critter(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }

  eat(list, nutrition, perception) {
    let record = Infinity;
    let closest = null;
    for (let i = list.length - 1; i >= 0; i--) {
      const d = this.position.dist(list[i]);

      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = list[i];
        }
      }
    }

    // This is the moment of eating!

    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    const desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
  }

  dead() {
    return this.health < 0;
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    const angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.dna.foodAttraction * 25);
      strokeWeight(2);
      ellipse(0, 0, this.dna.foodAwareness * 2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna.poisonAttraction * 25);
      ellipse(0, 0, this.dna.poisonAwareness * 2);
    }

    const gr = color(0, 255, 0);
    const rd = color(255, 0, 0);
    const col = lerpColor(rd, gr, this.health);

    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.size * 2);
    vertex(-this.size, this.size * 2);
    vertex(this.size, this.size * 2);
    endShape(CLOSE);

    pop();
  }

  boundaries() {
    const d = 25;

    let desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      const steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
}
