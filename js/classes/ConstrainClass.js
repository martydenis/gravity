class Constrain {
    checkForCollision (ball) {
        this.checkForBorders(ball);
    }

    checkForBorders (ball) {
        const velocity = {
            x: ball.position.x - ball.oldPosition.x,
            y: ball.position.y - ball.oldPosition.y
        }

        if (ball.position.x - ball.radius < 0) { // Left border
            ball.position.x = ball.radius;
            ball.oldPosition.x = ball.position.x + velocity.x;
        } else if (ball.position.x + ball.radius > window.innerWidth) { // Right border
            ball.position.x = window.innerWidth - ball.radius;
            ball.oldPosition.x = ball.position.x + velocity.x;
        } else if (ball.position.y + ball.radius > window.innerHeight) { // Bottom border
            ball.position.y = window.innerHeight - ball.radius;
            ball.oldPosition.y = ball.position.y + velocity.y;
        }
    }
}

export const constrain = new Constrain();
