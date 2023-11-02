let x, y; // Center position of the hurricane
let circles = []; // Array to store circle information
let numCircles = 10;

function setup() {
  createCanvas(400, 400);
  x = width / 2;
  y = height / 2;
  for (let i = 0; i < numCircles; i++) {
    circles.push({ 
      radius: 30 + i * 20, 
      speed: 0.02 + i * 0.01, 
      fillColor: color(random(255), random(255), random(255)) 
    });
  }
}

function draw() {
  background(220);

  // Draw the hurricane-like shape with colors
  for (let i = 0; i < numCircles; i++) {
    let angle = frameCount * circles[i].speed;
    let xOffset = circles[i].radius * cos(angle);
    let yOffset = circles[i].radius * sin(angle);
    fill(circles[i].fillColor);
    noStroke();
    ellipse(x + xOffset, y + yOffset, circles[i].radius);
  }
}

