

class Target {
    
    constructor(targetPosition, targetSize) {
        this.pos = targetPosition;
        this.size = targetSize;
        this.radius = this.size * 0.5;
    }

    display() {
        //push();
        //translate(this.pos.x, this.pos.y);
        noStroke();
        fill(255, 161, 0, 128);
        ellipseMode(CENTER);
        ellipse(this.pos.x, this.pos.y, this.size);
        //pop();
    }

    isHitByRocket(rocket) {
        let d = this.pos.dist(rocket.pos);
        return d < this.radius;// * this.radius;
    }

}