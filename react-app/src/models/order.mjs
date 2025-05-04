import { Bowl } from "./bowl.mjs";

/**
 * The Order object should be used to handle a order. It stores the current bowls, determine the price and provide method for adjusting the bowls 
 */
function Order(orderId) {
    // One Order contains several bowls. Thereby, each bowl element is a tuple of the bowl object and its quantity. [bowl, num]
    this.bowls = [];

    // The price object stores the current price for the order.
    this.price = 0;
    this.id = orderId;

    /**
     * This method adds a bowl to the order. If the same bowl already exists, it increments the quantity. Moreover, the price is automatically adjusted.
     * 
     * @param {Bowl} bowl - The bowl to be added.
     * @throws {Error} Throws an error if the provided object is not an instance of `Bowl`. 
     * 
     */
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
        this.price += bowl.price;
    }

    this.changeNumBowls = function(bowl, num){
        if (!(bowl instanceof Bowl)) {
            throw new Error("Invalid bowl");
        }
        const index = this.bowls.findIndex(item => item[0].toString() === bowl.toString());
        if (index == -1){
            throw new Error("Bowl not part of Order");
        }else{
            this.bowls[index][1] = num;
        }
    }

    /**
     * This method removes a bowl from the order. If the order contains more than one bowl, it decrements the quantity. Otherwise, it removes the tuple with bowl from the list.
     * 
     * @param {Bowl} bowl - The bowl to be removed.
     * @throws {Error} Throws an error if the provided bowl is not an instance of bowl.
     */
    this.removeBowl = function(bowl){
        if (!(bowl instanceof Bowl)) {
            throw new Error("Invalid bowl");
        }
        const index = this.bowls.findIndex(item => item[0].toString() === bowl.toString());
        if (index !== -1){
            const num = this.bowls[index][1] - 1;
            if (num < 1){
                this.bowls.splice(index, 1)
            }else{
                this.bowls[index][1] = num;
            }
        }
    }

}

export { Order };