export class VectorUtilities {
    add (vector1, vector2) {
        return {
            x: vector1.x + this.numberToVector(vector2).x,
            y: vector1.y + this.numberToVector(vector2).y
        }
    }

    sub (vector1, vector2) {
        return {
            x: vector1.x - this.numberToVector(vector2).x,
            y: vector1.y - this.numberToVector(vector2).y
        }
    }

    div (vector1, vector2) {
        return {
            x: vector1.x / this.numberToVector(vector2).x,
            y: vector1.y / this.numberToVector(vector2).y
        }
    }

    mult (vector1, vector2) {
        return {
            x: vector1.x * this.numberToVector(vector2).x,
            y: vector1.y * this.numberToVector(vector2).y
        }
    }

    numberToVector (vector) {
        if (typeof vector === "number") {
            return {
                x: vector,
                y: vector
            }
        } else {
            return vector
        }
    }
}

export const Vector = new VectorUtilities();
