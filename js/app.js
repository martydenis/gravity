import { initControls, initStopPropagation } from "../sandbox-utils/utilities.js";
import { balls, systemManager } from "./classes/SystemManagerClass.js";

initControls();
initStopPropagation();

systemManager.init();
systemManager.spawnBalls(100);
systemManager.raf(); // Start requestAnimationFrame clock

window.addEventListener('resize', systemManager.resize);
window.addEventListener('click', function () {
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        ball.jump(1);
    }
});
