import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProteinSelection from './DisplayProteinSelection';
import SizeSelection from './DisplaySizeSelection';
import IngredientSelection from './DisplayIngredientSelection';
import BaseSelection from './DisplayBaseSelection';
import { Bowl, bowl_sizes } from '../../models/bowl.mjs';

function BowlDisplay(props) {
    // const [size, setSize] = useState(bowl_sizes.R); // Default to Regular size
    // const [base, setBase] = useState("Rice");
    // const [proteinSelections, setProteinSelections] = useState({});
    // const [toppingSelections, setToppingSelections] = useState({});
    // const [quantity, setQuantity] = useState(1);


    const handleSizeChange = (sizeKey) => {
        const selectedSize = bowl_sizes[sizeKey];
        if (!selectedSize) {
            console.error(`Invalid size selected: ${sizeKey}`);
            return;
        }
        props.setSize(selectedSize);
        props.setProteinSelections({});
        props.setToppingSelections({});
    };

    const calculatePrice = () => {
        const extraToppings = Math.max(
            0,
            Object.values(props.toppingSelections).reduce((sum, qty) => sum + qty, 0) - props.size.num_ingredients
        );
        const extraToppingsCost = extraToppings * (props.size.price * 0.2); // 20% of base price per extra topping
        return ((props.size.price + extraToppingsCost) * props.quantity).toFixed(2);
    };

    const handleAddBowl = () => {
        if (props.quantity > (props.availability[props.size.key] || 0)) {
            alert(`Not enough bowls available for size ${props.size.label}. Only ${props.availability[props.size.key]} left.`);
            return;
        }

        const selectedProteins = Object.keys(props.proteinSelections).filter(protein => props.proteinSelections[protein] > 0);
        const selectedToppings = Object.keys(props.toppingSelections).filter(topping => props.toppingSelections[topping] > 0);

        const newBowl = new Bowl(props.size.key, props.base);
        newBowl.proteines = selectedProteins;
        newBowl.ingredients = selectedToppings;

        props.addToOrder(newBowl, props.quantity);
    };

    return (
        <div className="container-fluid content-padding">
            <h2 className="text-center mb-4">Create Your PokéBowl</h2>

            <div className="row">
                <SizeSelection size={props.size} handleSizeChange={handleSizeChange} />
                <BaseSelection base={props.base} setBase={props.setBase} />
            </div>

            <div className="row mt-4">
                <ProteinSelection
                    maxProteins={props.size.num_proteins}
                    proteinSelections={props.proteinSelections}
                    setProteinSelections={props.setProteinSelections}
                />
                <IngredientSelection
                    maxToppings={props.size.num_ingredients}
                    toppingSelections={props.toppingSelections}
                    setToppingSelections={props.setToppingSelections}
                />
            </div>

            <Form.Group className="mb-3 w-50 mx-auto">
                <Form.Label><strong>Number of bowls</strong></Form.Label>
                <Form.Select
                    aria-label="Choose number of bowls"
                    value={props.quantity}
                    onChange={(e) => props.setQuantity(Number(e.target.value))}
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
                    disabled={props.quantity > (props.availability[props.size.key] || 0)}
                >
                    Add Bowl to Order
                </Button>
            </div>
        </div>
    );
}

export default BowlDisplay;
