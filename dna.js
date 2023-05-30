class DNA {
  static mutationRate = 0.05;

  constructor(parentDna) {
    this.foodAttraction = random(-2, 2);
    this.poisonAttraction = random(-2, 2);
    this.foodAwareness = random(0, 100);
    this.poisonAwareness = random(0, 100);

    if (!parentDna) return;

    // Mutation
    this.foodAttraction = parentDna.foodAttraction;
    if (random(1) < DNA.mutationRate) {
      this.foodAttraction += random(-0.1, 0.1);
    }

    this.poisonAttraction = parentDna.poisonAttraction;
    if (random(1) < DNA.mutationRate) {
      this.poisonAttraction += random(-0.1, 0.1);
    }

    this.foodAwareness = parentDna.foodAwareness;
    if (random(1) < DNA.mutationRate) {
      this.foodAwareness += random(-10, 10);
    }

    this.poisonAwareness = parentDna.poisonAwareness;
    if (random(1) < DNA.mutationRate) {
      this.poisonAwareness += random(-10, 10);
    }
  }
}
