import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProteinSelection from './DisplayProteinSelection';
import SizeSelection from './DisplaySizeSelection';
import IngredientSelection from './DisplayIngredientSelection';
import BaseSelection from './DisplayBaseSelection';
import { Bowl, bowl_sizes } from '../../models/bowl.mjs';

function BowlDisplay({ addToOrder, availability, orderQuantities, setOrderQuantities }) {
    const [size, setSize] = useState(bowl_sizes.R); // Default to Regular size
    const [base, setBase] = useState("Rice");
    const [proteinSelections, setProteinSelections] = useState({});
    const [toppingSelections, setToppingSelections] = useState({});
    const [quantity, setQuantity] = useState(1);

    const handleSizeChange = (sizeKey) => {
        const selectedSize = bowl_sizes[sizeKey];
        if (!selectedSize) {
            console.error(`Invalid size selected: ${sizeKey}`);
            return;
        }
        setSize(selectedSize);
        setProteinSelections({});
        setToppingSelections({});
    };

    const calculatePrice = () => {
        const extraToppings = Math.max(
            0,
            Object.values(toppingSelections).reduce((sum, qty) => sum + qty, 0) - size.num_ingredients
        );
        const extraToppingsCost = extraToppings * (size.price * 0.2); // 20% of base price per extra topping
        return ((size.price + extraToppingsCost) * quantity).toFixed(2);
    };

    const handleAddBowl = () => {
        const totalQuantityForSize = (orderQuantities[size.key] || 0) + quantity;

        // Check if adding the bowl exceeds availability
        if (totalQuantityForSize > (availability[size.key] || 0)) {
            alert(`Not enough bowls available for size ${size.label}. Only ${availability[size.key]} left.`);
            return;
        }

        const selectedProteins = Object.keys(proteinSelections).filter(protein => proteinSelections[protein] > 0);
        const selectedToppings = Object.keys(toppingSelections).filter(topping => toppingSelections[topping] > 0);

        const newBowl = new Bowl(size.key, base);
        newBowl.proteines = selectedProteins;
        newBowl.ingredients = selectedToppings;
        newBowl.nrBowls = quantity;

        addToOrder(newBowl, quantity);

        // Update order quantities
        setOrderQuantities(prev => ({
            ...prev,
            [size.key]: totalQuantityForSize,
        }));
    };

    const isAddDisabled = (orderQuantities[size.key] || 0) + quantity > (availability[size.key] || 0);

    return (
        <div className="container-fluid content-padding">
            <h2 className="text-center mb-4">Create Your PokéBowl</h2>

            <div className="row">
                <SizeSelection size={size} handleSizeChange={handleSizeChange} />
                <BaseSelection base={base} setBase={setBase} />
            </div>

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

            <h4 className="text-center mt-3">Total Price: {calculatePrice()}€</h4>

            <div className="text-center">
                <Button
                    variant="success"
                    className="mt-3 px-5 py-2"
                    onClick={handleAddBowl}
                    disabled={isAddDisabled} // Disable if it exceeds availability
                >
                    Add Bowl to Order
                </Button>
            </div>
        </div>
    );
}

export default BowlDisplay;
