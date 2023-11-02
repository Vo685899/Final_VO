let circles = [];

function setup() {
    createCanvas(400, 400);
    background(220);
    noStroke();
}

function draw() {
    // Create a new circle with random position and color
    let x = random(width);
    let y = random(height);
    let r = random(10, 50);
    let color = randomColor();
    let circle = new Circle(x, y, r, color);
    circles.push(circle);

    // Draw and update all the circles
    for (let circle of circles) {
        circle.display();
        circle.update();
    }
}

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = random(-1, 1);
        this.speedY = random(-1, 1);
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.radius * 2);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off the canvas edges
        if (this.x < 0 || this.x > width) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > height) {
            this.speedY *= -1;
        }
    }
}

function randomColor() {
    return color(random(255), random(255), random(255));
}
