const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const FPS = 90;
const INTERVAL = Math.round(1000 / FPS) // ms
const gravity = 0.5;
const balls = [];
const bg = 'rgba(151, 206, 204, 0.62)';
const ballAmount = Math.round(window.innerWidth / 100);
// const ballAmount = 2;
const colors = [
  '#C4421A',
  '#F98F45',
  '#12908E',
  '#16594E'
];

class Ball {
  constructor (x, y, radius, mass, color) {
    this.id = balls.length + 1;
    this.position = {}
    this.position.x = x;
    this.position.y = y;
    this.radius = radius;
    this.mass = mass;
    this.color = color;
    this.velocity = {};
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.wallFriction = 0.80;
    this.airFriction = 0.999;
    this.collisioned = []
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    for (let i = 0; i < balls.length; i++) {
      const ball1 = this;
      const ball2 = balls[i];

      if (ball2.id == ball1.id) {
        continue;
      }

      if (ball1.collisioned.includes(ball2.id)) {
        continue;
      }

      ball1.collisioned.push(ball2.id);
      ball2.collisioned.push(ball1.id);

      // Detect collision with other ball
      const distance = getDistance(
        ball1.position.x + ball1.velocity.x,
        ball1.position.y + ball1.velocity.y,
        ball2.position.x + ball2.velocity.x,
        ball2.position.y + ball2.velocity.y);
      // const distance = getDistance(
      //   ball1.position.x,
      //   ball1.position.y,
      //   ball2.position.x,
      //   ball2.position.y);

      const radii = ball1.radius + ball2.radius;

      if (distance < radii) {
        const collisionNormal = {
          x: ball2.position.x - ball1.position.x,
          y: ball2.position.y - ball1.position.y
        };

        const relativeVelocity = {
          x: ball1.velocity.x - ball2.velocity.x,
          y: ball1.velocity.y - ball2.velocity.y
        };

        const normalMagnitude =
          (collisionNormal.x * relativeVelocity.x + collisionNormal.y * relativeVelocity.y) /
          (collisionNormal.x * collisionNormal.x + collisionNormal.y * collisionNormal.y);

        const collisionNormalMagnitude = {
          x: collisionNormal.x * normalMagnitude,
          y: collisionNormal.y * normalMagnitude
        };

        const angle = getAngleBetweenPoints(ball1.position, ball2.position);
        const relativeDistance = (radii - distance) / 2;
        const ball1RelativeMass = ball2.mass / ball1.mass;
        const ball2RelativeMass = ball1.mass / ball2.mass;

        ball1.position.x -= Math.cos(angle) * relativeDistance;
        ball1.position.y -= Math.sin(angle) * relativeDistance;
        ball2.position.x += Math.sin(angle) * relativeDistance;
        ball2.position.y += Math.cos(angle) * relativeDistance;

        ball1.velocity.x -= collisionNormalMagnitude.x * ball1RelativeMass;
        ball1.velocity.y -= collisionNormalMagnitude.y * ball1RelativeMass;
        ball2.velocity.x += collisionNormalMagnitude.x * ball2RelativeMass;
        ball2.velocity.y += collisionNormalMagnitude.y * ball2RelativeMass;
      }
    }

    if (this.position.y + this.radius + this.velocity.y > innerHeight) {
      this.position.y = innerHeight - this.radius;
      this.velocity.y = -this.velocity.y * this.wallFriction;
      this.velocity.x *= this.wallFriction;
    } else {
      this.velocity.y += gravity;
    }

    const passedLeftBorder = this.position.x - this.radius + this.velocity.x <= 0;
    const passedRightBorder = this.position.x + this.radius + this.velocity.x >= innerWidth;
    if (passedLeftBorder || passedRightBorder) {
      if (passedRightBorder) {
        this.position.x = innerWidth - this.radius;
      }

      if (passedLeftBorder) {
        this.position.x = this.radius;
      }

      this.velocity.x = -this.velocity.x * this.wallFriction;
      this.velocity.y *= this.wallFriction;
    }

    this.velocity.y *= this.airFriction;
    this.velocity.x *= this.airFriction;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  jump(force) {
    const vForce = - force * 75;
    const hForce = randomIntFromRange(-force, force) * 50;
    this.velocity.x = hForce / this.mass;
    this.velocity.y = vForce / this.mass;
  }
}


function populateCanvas() {
  for (let i = 0; i < ballAmount; i++) {
    const radius = Math.floor(randomIntFromRange(15, 40, false));
    const creationTry = tryCreatingBall(radius);

    if (creationTry !== false) {
      x = creationTry.x
      y = creationTry.y
    } else {
      return console.log('Couldn\'t populate every ball. Not enough space.');
    }

    const color = randomValueFromArray(colors);
    const mass = 25 + Math.floor(radius/3);
    balls.push(new Ball(x, y, radius,  mass, color));
  }
}

function tryCreatingBall(radius) {
  const maxTries = 10;
  let tries = 0;
  let x = randomIntFromRange(radius, innerWidth - radius);
  let y = randomIntFromRange(radius, innerHeight - radius);

  if (balls.length == 0) {
    return {x: x, y: y};
  }

  while (tries < maxTries) {
    const isPositionFree = checkIfPositionIsFree({x: x, y: y, radius: radius});

    if (isPositionFree) {
      return {x: x, y: y};
    }

    x = randomIntFromRange(radius, innerWidth - radius);
    y = randomIntFromRange(radius, innerHeight - radius);
    tries ++;
  }

  return false;
}

function checkIfPositionIsFree(ball) {
  for (let b = 0; b < balls.length; b++) {
    const ball2 = balls[b];
    if (doBallsCollide(ball, ball2)) {
      return false;
    }
  }

  return true;
}

function doBallsCollide(ball1, ball2) {
  const distance = getDistance(ball1.x, ball1.y, ball2.position.x, ball2.position.y);

  if (distance < ball1.radius + ball2.radius) {
    return true;
  }

  return false;
}

populateCanvas();
resizeWindow();

let gameLogicInterval = new AdjustingInterval(updateGameLogic, INTERVAL);
gameLogicInterval.start();
requestAnimationFrame(updateGameDisplay);

function updateGameLogic() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ball.update();
  }
}

function updateGameDisplay() {
  ctx.beginPath()
  ctx.rect(0,0, innerWidth, innerHeight);
  ctx.fillStyle = bg;
  ctx.fill();

  balls.map(ball => ball.collisioned = []);
  balls.map(ball => ball.draw());

  requestAnimationFrame(updateGameDisplay);
}

function resizeWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', function(){
  resizeWindow();

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    if (ball.y + ball.radius > innerHeight) {
      ball.y = innerHeight - ball.radius;
    }
  }
});

window.addEventListener('click', function(){
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    ball.jump(8);
  }
});