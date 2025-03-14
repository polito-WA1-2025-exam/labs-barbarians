import {bases, proteines, ingredients} from "./ingredients.mjs";

const bowl_sizes = {
    regular: {num_proteins: 1, num_ingredients: 4},
    medium: {num_proteins: 2, num_ingredients: 4},
    big: {num_proteins: 3, num_ingredients: 6}
}

function Bowl (size, base) {
    if (!(size in bowl_sizes)) {
        throw new Error("Invalid bowl size");
    }

    if (!base in bases) {
        throw new Error("Invalid base");
    }

    this.size = size;
    this.base = base;
    this.proteines = [];
    this.ingredients = [];

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

    this.price = function(size) {

        let price = 0;
        if (this.size === 'regular') {
            price = 9;
        } else if (this.size === 'medium') {
            price = 11;
        } else if (this.size === 'big') {
            price = 14;
        }
    
        return price;
    }

    this.toString = function() {
        return `Bowl size: ${this.size}, base: ${this.base}, proteines: ${this.proteines.join(", ")}, ingredients: ${this.ingredients.join(", ")}`;
    }
}


export { Bowl};