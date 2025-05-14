import {bases, proteines, ingredients} from "./ingredients.mjs";

export const bowl_sizes = {
    R: { key: "R", label: "Regular", num_proteins: 1, num_ingredients: 4, price: 9 },
    M: { key: "M", label: "Medium", num_proteins: 2, num_ingredients: 4, price: 11 },
    L: { key: "L", label: "Large", num_proteins: 3, num_ingredients: 6, price: 14 },
};

class Bowl {
    constructor(sizeKey, base) {
        const size = bowl_sizes[sizeKey];
        if (!size) {
            throw new Error("Invalid bowl size");
        }
        this.size = size.key;
        this.base = base;
        this.proteines = [];
        this.ingredients = [];
        this.price = size.price;
    }

    toString() {
        return `${this.size}-${this.base}-${this.proteines.join(",")}-${this.ingredients.join(",")}`;
    }
}

export { Bowl };