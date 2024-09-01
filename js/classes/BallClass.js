import { ctx, GRAVITY } from "./SystemManagerClass.js";

export class Ball {
    constructor (id, position, radius, mass, color) {
        this.id = id;
        this.mass = mass;
        this.radius = radius;
        this.color = color;

        this.position = position;
        this.oldPosition = {...this.position};
        this.oldPosition.x += 0.5 - Math.random();
    }

    update (deltaTime) {
        const temporaryPosition = this.position;

        this.position = {
            x: (this.position.x * 2 - this.oldPosition.x),
            y: ((this.position.y * 2 - this.oldPosition.y) + GRAVITY * deltaTime * deltaTime),
        };

        this.oldPosition = temporaryPosition;
    }

    render () {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    jump (force) {
        this.oldPosition.x += (0.5 - Math.round(Math.random())) * force;
        this.oldPosition.y += (Math.round(Math.random())) * force;
    }
}
