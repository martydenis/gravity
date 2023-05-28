<?php require_once '../../includes.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <link rel="icon" type="image/svg" href="<?php echo $favicon_path; ?>favicon.svg" />
  <link rel="stylesheet" type="text/css" href="<?php echo $css_path; ?>game.css" media="screen" />
  <title>Gravity</title>

  <style>
    html,
    body,
    canvas {
      width: 100%;
      height: 100%;
    }

    html {
      font-size: 15px;
      font-family: 'Gill Sans', 'Gill Sans MT', sans-serif;
    }

    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    canvas {
      background-color: #97CECC;
    }
  </style>
</head>

<body>
  <a href="<?php echo $sandbox_path; ?>" id="back">Back</a>
  <canvas id="canvas" width="400" height="400"></canvas>

  <script src="<?php echo $js_path; ?>tools<?php echo ($is_prod ? '.min' : '') ; ?>.js"></script>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const FPS = 90;
    const INTERVAL = Math.round(1000 / FPS) // ms
    const gravity = 0.5;
    const balls = [];
    const bg = 'rgba(151, 206, 204, 0.62)';
    const colors = [
      '#C4421A',
      '#F98F45',
      '#12908E',
      '#16594E'
    ];

    class Ball {
      constructor (x, y, radius, mass, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
        this.color = color;
        this.dx = 0;
        this.dy = 1;
        this.wallFriction = 0.80;
        this.airFriction = 0.999;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }

      update() {
        if (this.y + this.radius + this.dy > innerHeight) {
          this.dy = -this.dy * this.wallFriction;
          this.dx *= this.wallFriction;
        } else {
          this.dy += gravity;
        }

        if (this.x + this.radius + this.dx >= innerWidth ||
          this.x - this.radius + this.dx <= 0) {
          this.dx = -this.dx * this.wallFriction;
          this.dy *= this.wallFriction;
        } else {
          this.dx = this.dx;
        }
        
        this.dy *= this.airFriction;
        this.dx *= this.airFriction;

        this.x += this.dx;
        this.y += this.dy;
      }

      jump(force) {
        const vForce = - force * 100;
        const hForce = randomIntFromRange(-force, force) * 50;
        this.dx = hForce / this.mass;
        this.dy = vForce / this.mass;
      }
    }

    const ballAmount = Math.round(window.innerWidth / 40);

    for (let i = 0; i < ballAmount; i++) {
      let radius = randomIntFromRange(15, 50, false);
      const mass = 20 + radius/3;
      radius = Math.floor(radius);
      const x = randomIntFromRange(radius, innerWidth - radius);
      const y = innerHeight - radius;
      const color = randomValueFromArray(colors);
      balls.push(new Ball(x, y, radius,  mass, color));
    }

    resizeWindow();

    let gameLogicInterval = new AdjustingInterval(updateGameLogic, INTERVAL);
    gameLogicInterval.start();
    updateGameDisplay();

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

      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        ball.draw();
      }

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
        
        ball.jump(6);
      }
    });
  </script>
</body>

</html>