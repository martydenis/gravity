class Gravity {
    constructor () {
        this.gravity = 0.004;
    }

    applyGravity(object) {
        object.velocity.y += this.gravity; 
    }
}

export const gravity = new Gravity();
