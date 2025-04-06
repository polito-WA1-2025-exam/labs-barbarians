import {bases, proteines, ingredients} from "./ingredients.mjs";

/**
 * On the one hand this object stores all size for a bowl. On the other hand it stores also the number of proteins and ingredients for each bowl size.
 */
const bowl_sizes = {
    regular: {str:"regular", num_proteins: 1, num_ingredients: 4},
    medium: {str:"medium", num_proteins: 2, num_ingredients: 4},
    big: {str:"big", num_proteins: 3, num_ingredients: 6}
}

/**
 * The Bowl object represents one bowl. Thereby it stores the size, base, proteiens and ingredients and determine its prices. The bowl object cannot be identified by an ID but by a string that is created with the provided toString method. 
 * @param {bowl_sizes} size - Determines the size of the bowl.
 * @param {bases} base - Provides the base for this bowl.
 */
function Bowl (size, base) {
    // Checks the validity of the passed size.
    // if (!(size in bowl_sizes)) {
    //     throw new Error("Invalid bowl size");
    // }

    // // Checks the validity of the passed base.
    // if (!base in bases) {
    //     throw new Error("Invalid base");
    // }

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
        if (this.size.str === 'regular') {
            price = 9;
        } else if (this.size.str === 'medium') {
            price = 11;
        } else if (this.size.str === 'big') {
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

function generateBowls(count) {
    const bowlArray = [];
    const baseOptions = Object.values(bases);
    const proteinOptions = Object.keys(proteines);
    const ingredientOptions = Object.keys(ingredients);
    const sizeKeys = Object.keys(bowl_sizes);

    for (let i = 0; i < count; i++) {
        // Randomly pick size and base
        const randomSizeKey = sizeKeys[Math.floor(Math.random() * sizeKeys.length)];
        const randomBase = baseOptions[Math.floor(Math.random() * baseOptions.length)];
        const sizeObj = bowl_sizes[randomSizeKey];

        const bowl = new Bowl(sizeObj, randomBase);

        // Randomly add proteins
        const shuffledProteins = proteinOptions.sort(() => 0.5 - Math.random());
        for (let p = 0; p < sizeObj.num_proteins; p++) {
            bowl.addProteine(shuffledProteins[p]);
        }

        // Randomly add ingredients
        const shuffledIngredients = ingredientOptions.sort(() => 0.5 - Math.random());
        for (let ing = 0; ing < sizeObj.num_ingredients; ing++) {
            bowl.addIngredient(shuffledIngredients[ing]);
        }
        console.log(bowl);

        bowlArray.push(bowl);
    }

    return bowlArray;
}

export { Bowl, bowl_sizes, generateBowls};