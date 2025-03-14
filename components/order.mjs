import { Bowl } from "./bowl.mjs";


function Order() {
    this.bowls = [];

    this.addBowl = function(bowl) {
        if (!(bowl instanceof Bowl)) {
            throw new Error("Invalid bowl");
        }

        this.bowls.push(bowl);
    }
}

export { Order };