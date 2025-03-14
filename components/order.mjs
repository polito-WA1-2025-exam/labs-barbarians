import { Bowl } from "./bowl.mjs";


function Order() {
    this.bowls = [];
    this.price = 0;

    this.addBowl = function(bowl) {
        if (!(bowl instanceof Bowl)) {
            throw new Error("Invalid bowl");
        }
        const index = this.bowls.findIndex(item => item[0].toString() === bowl.toString());
        if(index !== -1) {
            this.bowls[index][1]++;
        }else{
            this.bowls.push([bowl, 1]);
        }
        this.price += bowl.price();
    }

}

export { Order };