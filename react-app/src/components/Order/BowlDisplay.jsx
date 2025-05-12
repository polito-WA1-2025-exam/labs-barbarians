import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import ProteinSelection from './DisplayProteinSelection';
import SizeSelection from './DisplaySizeSelection';
import IngredientSelection from './DisplayIngredientSelection';
import { Bowl, bowl_sizes } from '../../models/bowl.mjs';
import BaseSelection from './DisplayBaseSelection';
import bases from '../../models/ingredients.mjs';
import { fetchBowlAvailability } from '../../API/API.js';

function BowlDisplay({ addToOrder, availability }) {
    const [size, setSize] = useState(bowl_sizes.regular);
    const [base, setBase] = useState("Rice");
    const [proteinSelections, setProteinSelections] = useState({});
    const [toppingSelections, setToppingSelections] = useState({});
    const [quantity, setQuantity] = useState(1);

    const handleSizeChange = (newSize) => {
        console.log("Selected size:", newSize);
        setSize(Object.values(bowl_sizes).find(entry => entry.str === newSize));
        setProteinSelections({});
        setToppingSelections({});
    };

    const calculatePrice = () => {
        const basePrice = size.price;
        const extraToppings = Math.max(0, Object.values(toppingSelections).reduce((sum, qty) => sum + qty, 0) - size.num_ingredients);
        const extraToppingsCost = extraToppings * (basePrice * 0.2); // 20% of base price per extra topping
        return ((basePrice + extraToppingsCost) * quantity).toFixed(2); // Return price with 2 decimal places
    };
    const sizeMap = {
        regular: "R",
        medium: "M",
        big: "L",
    };

    const handleAddBowl = () => {
        

        const availabilityKey = sizeMap[size.str.toLowerCase()]; // Map size to `R`, `M`, `L`
        console.log("Availability:", availability);
        console.log("Selected size:", size.str);
        console.log("Mapped size key:", availabilityKey);

        if (quantity > (availability[availabilityKey] || 0)) {
            alert(`Not enough bowls available for size ${size.str}. Only ${availability[availabilityKey]} left.`);
            return;
        }

        const selectedProteins = Object.keys(proteinSelections).filter(protein => proteinSelections[protein] > 0);
        const selectedToppings = Object.keys(toppingSelections).filter(topping => toppingSelections[topping] > 0);

        const newBowl = new Bowl(size.str.toLowerCase(), base); // Use `regular`, `medium`, `big`
        newBowl.proteines = selectedProteins;
        newBowl.ingredients = selectedToppings;
        newBowl.price = size.price;

        addToOrder(newBowl, quantity);
    };

    const totalPrice = calculatePrice();

    return (
        <div className="container-fluid content-padding">
            <h2 className="text-center mb-4">Create Your PokéBowl</h2>

            {/* Size Selection */}
            <div className="row">
                <SizeSelection size={size} handleSizeChange={handleSizeChange} />
                <BaseSelection base={base} setBase={setBase} />
            </div>

            {/* Proteins and Toppings */}
            <div className="row mt-4">
                <ProteinSelection
                    maxProteins={size.num_proteins}
                    proteinSelections={proteinSelections}
                    setProteinSelections={setProteinSelections}
                />
                <IngredientSelection
                    maxToppings={size.num_ingredients}
                    toppingSelections={toppingSelections}
                    setToppingSelections={setToppingSelections}
                />
            </div>

            {/* Number of Bowls Selection */}
            <Form.Group className="mb-3 w-50 mx-auto">
                <Form.Label><strong>Number of bowls</strong></Form.Label>
                <Form.Select
                    aria-label="Choose number of bowls"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                >
                    {[...Array(10).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Price Preview */}
            <h4 className="text-center mt-3">Total Price: {totalPrice}€</h4>

            {/* Submit Button */}
            <div className="text-center">
                <Button
                    variant="success"
                    className="mt-3 px-5 py-2"
                    onClick={handleAddBowl}
                    disabled={quantity > (availability[sizeMap[size.str.toLowerCase()]] || 0)}
                >
                    Add Bowl to Order
                </Button>
            </div>

            {/* Availability Display */}
            <div className="mt-4">
                <h4>Available Bowls:</h4>
                <ul>
                    {Array.isArray(availability)
                        ? availability.map(({ size, count }) => (
                            <li key={size}>{size}: {count} available</li>
                          ))
                        : Object.entries(availability).map(([size, count]) => (
                            <li key={size}>{size}: {count} available</li>
                          ))}
                </ul>
            </div>
        </div>
    );
}

export default BowlDisplay;
