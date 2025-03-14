import { Bowl } from "./bowl.mjs";


function Order() {
    this.bowls = [];
    this.price = 0;

    this.addBowl = function(bowl) {
        if (!(bowl instanceof Bowl)) {
            throw new Error("Invalid bowl");
        }
        this.bowls.push(bowl);
        this.price += bowl.price();
    }

}

export { Order };