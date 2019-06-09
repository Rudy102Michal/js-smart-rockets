

class Obstacle {

    constructor(xPos, yPos, w, h) {
        this.pos = createVector(xPos, yPos);
        this.width = w;
        this.height = h;
    }

    display() {
        rectMode(CENTER);
        fill(10, 240, 150);
        strokeWeight(1);
        stroke(0);
        rect(this.pos.x, this.pos.y, this.width, this.height);
        rectMode(CORNER);
    }


    containsPoint(pointPos) {
        return (pointPos.x > this.pos.x - this.width / 2.0) 
            && (pointPos.x < this.pos.x + this.width / 2.0)
            && (pointPos.y > this.pos.y - this.height / 2.0)
            && (pointPos.y < this.pos.y + this.height / 2.0);
    }
}