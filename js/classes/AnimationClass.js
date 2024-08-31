import { balls } from "./SystemManagerClass.js";

let oldTime = new Date();
let newTime = new Date();

class AnimationManager {
    raf () {
        newTime = new Date();
        const deltaTime = newTime - oldTime;

        oldTime = new Date();
        balls.map(ball => ball.update());
        balls.map(ball => ball.update());

        requestAnimationFrame(this.raf);
    }
}

export const animationManager = new AnimationManager();
