import {bases, proteines, ingredients} from "./ingredients.mjs";

/**
 * On the one hand this object stores all size for a bowl. On the other hand it stores also the number of proteins and ingredients for each bowl size.
 */
const bowl_sizes = {
    regular: {num_proteins: 1, num_ingredients: 4},
    medium: {num_proteins: 2, num_ingredients: 4},
    large: {num_proteins: 3, num_ingredients: 6}
}


function Bowl (size, base) {
    // Checks the validity of the passed size.
    if (!(size in bowl_sizes)) {
        throw new Error("Invalid bowl size");
    }

    // Checks the validity of the passed base.
    if (!base in bases) {
        throw new Error("Invalid base");
    }

    // Store size and base of the bowl. 
    this.size = size;
    this.base = base;

    // Creates list for storing proteines and ingredients.
    this.proteines = [];
    this.ingredients = [];

    /**
     * This method should be used to add proteines to the bowl.
     * @param {*} proteine - proteine to add
     * @throws {Error} - Throws an error if the provided proteine is not in `proteines` or if the maximum number of proteines is exceeded.
     */
    this.addProteine = function(proteine) {
        if (!(proteine in proteines)) {
            throw new Error("Invalid proteine");
        }
        if (this.proteines.length >= this.size.num_proteins){
            throw new Error("Too many proteines");
        }

        this.proteines.push(proteine);
        this.proteines.sort();
    }

    /**
     * This method should be used to add ingredients to the bowl. 
     * @param {*} ingredient - ingredient that should be added to the bowl.
     * @throws {Error} - Throws an error if the provided ingredient is not in `ingredients` or if the maximum number of ingredients is exceeded.
     */
    this.addIngredient = function(ingredient) {
        if (!(ingredient in ingredients)) {
            throw new Error("Invalid ingredient");
        }
        if (this.ingredients.length >= this.size.num_ingredients){
            throw new Error("Too many ingredients");
        }

        this.ingredients.push(ingredient);
        this.ingredients.sort();
    }

    /**
     * This method computes the price for the current bowl.
     * @returns price of the bowl
     */
    this.price = function() {

        let price = 0;
        if (this.size === 'regular') {
            price = 9;
        } else if (this.size === 'medium') {
            price = 11;
        } else if (this.size === 'large') {
            price = 14;
        }
    
        return price;
    }

    /**
     * Creates a characteristic string that specifies the bowl-object. A bowl object is specified by its properties as size, base and stored proteines and ingredients. This means that two independently created bowl objects having the same property are observed as equal.
     * 
     * @returns The characteristic string for this bowl.
     */
    this.toString = function() {
        return `Bowl size: ${this.size}, base: ${this.base}, proteines: ${this.proteines.join(", ")}, ingredients: ${this.ingredients.join(", ")}`;
    }
}


export { Bowl};