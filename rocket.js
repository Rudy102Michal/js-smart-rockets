
let defaultDrawFunction = function(rocketWidth, rocketHeight) {
    rectMode(CENTER);
    rect(0, 0, rocketWidth, rocketHeight);
}

class Rocket {

    constructor(position, rocketWidth, heightToWidthRatio, drawFunction=null, genome=null) {
        this.pos = position.copy();
        this.startingPos = this.pos.copy();
        this.velocity = createVector(0.0, 0.0);
        this.ratio = heightToWidthRatio;
        this.width = rocketWidth;
        this.height = int(this.width * this.ratio);
        this.drawFunction = (drawFunction != null) ? drawFunction : defaultDrawFunction;
        this.active = true;
        this.dnaIndex = 0;
        this.usageMaxCount = 1;
        this.dnaUsage = this.usageMaxCount;
        if(genome == null)
        {
            this.genome = new Genome(200, () => {
                return p5.Vector.random2D().mult(random(4, 9));
            });
            this.genome.generateRandomDNA();
        }
        else
        {
            this.genome = genome;
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.velocity.heading() + HALF_PI);
        this.drawFunction(this.width, this.height);
        pop();
    }

    physicsUpdate(delta) {
        if (this.active)
        {
            if(this.dnaUsage == 0)
            {
                this.velocity.add(this.genome.dna[this.dnaIndex % this.genome.dna.length]);
                this.dnaIndex += 1;
                this.dnaUsage = this.usageMaxCount;
            }
            let mod = this.velocity.copy().mult(delta);
            this.pos.add(mod);
            this.dnaUsage -= 1;
        }
    }

    within(xLeft, yLeft, xRight, yRight) {
        let x = this.pos.x;
        let y = this.pos.y;

        return x > xLeft && x < xRight && y > yLeft && y < yRight;
    }

    clone() {
        let ret = new Rocket(this.startingPos, this.width, this.ratio, this.drawFunction, this.genome.clone());
        return ret;
    }

    resetToDefaultState() {
        this.pos = this.startingPos.copy();
        this.velocity = createVector(0.0, 0.0);
        this.dnaIndex = 0;
        this.active = true;
        this.dnaUsage = this.usageMaxCount;
    }

}