import {bases, proteines, ingredients} from "./ingredients.mjs";

/**
 * On the one hand this object stores all size for a bowl. On the other hand it stores also the number of proteins and ingredients for each bowl size.
 */
const bowl_sizes = {
    regular: {str:"Regular", num_proteins: 1, num_ingredients: 4, price: 9},
    medium: {str:"Medium", num_proteins: 2, num_ingredients: 4, price: 11},
    big: {str:"Big", num_proteins: 3, num_ingredients: 6, price: 14}
}

/**
 * The Bowl object represents one bowl. Thereby it stores the size, base, proteiens and ingredients and determine its prices. The bowl object cannot be identified by an ID but by a string that is created with the provided toString method. 
 * @param {bowl_sizes} size - Determines the size of the bowl.
 * @param {bases} base - Provides the base for this bowl.
 */
function Bowl(size, base) {
    // Ensure size is a valid string
    if (!(size in bowl_sizes)) {
        console.log(size)
        throw new Error("Invalid bowl size");
    }

    this.size = size; // Use the string key (e.g., "regular", "medium", "big")
    this.base = base;

    this.proteines = [];
    this.ingredients = [];
    this.price = bowl_sizes[size].price; // Set price based on size

    this.toString = function() {
        return `Bowl size: ${this.size}, base: ${this.base}, proteines: ${this.proteines.join(", ")}, ingredients: ${this.ingredients.join(", ")}`;
    };
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

        const bowl = new Bowl(randomSizeKey, randomBase);

        // Randomly add proteins
        const shuffledProteins = proteinOptions.sort(() => 0.5 - Math.random());
        bowl.proteines = shuffledProteins.slice(0, sizeObj.num_proteins);

        // Randomly add ingredients
        const shuffledIngredients = ingredientOptions.sort(() => 0.5 - Math.random());
        bowl.ingredients = shuffledIngredients.slice(0, sizeObj.num_ingredients);

        console.log(bowl);

        bowlArray.push(bowl);
    }

    return bowlArray;
}

export { Bowl, bowl_sizes, generateBowls};