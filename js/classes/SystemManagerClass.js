import { Ball } from "./BallClass.js";
import { Vector } from "./VectorClass.js";

const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const balls = [];
export const GRAVITY = 0.002;

class SystemManager {
    constructor () {
        this.wallFriction = 1;
        this.ballFriction = 0.6;
        this.previousUpdateDate = new Date();
        this.presentUpdateDate = new Date();
        this.subSteps = 8;
        this.ballPossibleColors = [
            '#543864',
            '#8B4367',
            '#FF6464',
            // '#163c36'
        ];
    }

    init () {
        this.resize();
    }

    update (deltaTime) {
        const stepDeltaTime = deltaTime / this.subSteps;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let step = 0; step < this.subSteps; step++) {
            this.updateBalls(stepDeltaTime);
            // Applying constraints here AND after checkCollisions seems to fix a bug where balls would fly up glitching on the sides of the container.
            this.applyConstraints();
            this.checkCollisions(stepDeltaTime);
            this.applyConstraints();
        }

        this.renderBalls();
    }

    updateBalls (deltaTime) {
        for (const ball of balls) {
            ball.update(deltaTime);
        }
    }

    renderBalls () {
        for (const ball of balls) {
            ball.render();
        }
    }

    spawnBalls (count) {
        for (let b = 0; b < count; b++) {
            const attempt = this.attemptSpawningBall();

            if (attempt === false) {
                return console.log('Couldn\'t populate every ball. Not enough space.');
            }

            const mass = attempt.radius;
            const colorIndex = Math.round(Math.random() * (this.ballPossibleColors.length - 1));
            const color = this.ballPossibleColors[colorIndex];
            const ball = new Ball(b, attempt.position, attempt.radius, mass, color);

            balls.push(ball);
        }
    }

    attemptSpawningBall () {
        const maxTries = 15;
        let radius = 15 + Math.round(Math.random() * window.innerWidth / 40);
        let tries = 0;

        while (tries < maxTries) {
            const position = this.getRandomPosition(radius);
            const isPositionFree = this.checkIfPositionIsFree({position, radius});

            if (isPositionFree) {
                return {position, radius};
            }

            radius -= 2; // gradually reduce ball radius to try to find a spot for it
            tries ++;
        }

        return false;
    }

    getRandomPosition (radius) {
        return {
            x: radius + Math.round(Math.random() * (window.innerWidth - radius)),
            y: radius + Math.round(Math.random() * (window.innerHeight - radius))
        }
    }

    checkIfPositionIsFree (ball) {
        for (let b = 0; b < balls.length; b++) {
            const ball2 = balls[b];
            if (this.doBallsCollide(ball, ball2)) {
                return false;
            }
        }

        return true;
    }

    doBallsCollide (ball1, ball2) {
        const a = ball2.position.x - ball1.position.x;
        const b = ball2.position.y - ball1.position.y;
        const distance = Math.sqrt(a * a + b * b);

        if (distance < ball1.radius + ball2.radius) {
            return true;
        }

        return false;
    }

    resize () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    checkCollisions () {
        for (let i = 0; i < balls.length; i++) {
            const ball1 = balls[i];

            // Iterate on object involved in new collision pairs
            for (let k = i + 1; k < balls.length; k++) {
                const ball2 = balls[k];

                // Check overlapping
                if (this.doBallsCollide(ball1, ball2)) {
                    const v = Vector.sub(ball1.position, ball2.position);
                    const distance  = Math.sqrt(v.x * v.x + v.y * v.y);
                    const minDistance = ball1.radius + ball2.radius;
                    const n = Vector.div(v, distance);
                    const mass_ratio_1 = ball1.radius / (ball1.radius + ball2.radius);
                    const mass_ratio_2 = ball2.radius / (ball1.radius + ball2.radius);
                    const delta = 0.5 * this.ballFriction * (distance - minDistance);
                    // Update positions
                    ball1.position = Vector.sub(ball1.position, Vector.mult(n, (mass_ratio_2 * delta)));
                    ball2.position = Vector.add(ball2.position, Vector.mult(n, (mass_ratio_1 * delta)));
                }
            }
        }
    }

    applyConstraints () {
        for (const ball of balls) {
            const velocity = Vector.sub(ball.position, ball.oldPosition);

            if (ball.position.x - ball.radius < 0) { // Left border
                ball.position.x = ball.radius;
                ball.oldPosition.x = ball.position.x + velocity.x;
            } else if (ball.position.x + ball.radius > window.innerWidth) { // Right border
                ball.position.x = window.innerWidth - ball.radius;
                ball.oldPosition.x = ball.position.x + velocity.x;
            } else if (ball.position.y + ball.radius > window.innerHeight) { // Bottom border
                ball.position.y = window.innerHeight - ball.radius;
                // ball.oldPosition.x = ball.position.x + velocity.x * 0.999;
                ball.oldPosition.y = ball.position.y + velocity.y;
            }
        }
    }

    raf () {
        this.presentUpdateDate = new Date();
        const dt = Math.min(this.presentUpdateDate - this.previousUpdateDate, 30);

        this.update(dt);

        this.previousUpdateDate = new Date();
        requestAnimationFrame(this.raf.bind(this));
    }
}

export const systemManager = new SystemManager();
