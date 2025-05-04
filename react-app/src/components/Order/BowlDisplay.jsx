import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import ProteinSelection from './DisplayProteinSelection';
import SizeSelection from './DisplaySizeSelection';
import IngredientSelection from './DisplayIngredientSelection';
import { Bowl, bowl_sizes } from '../../models/bowl.mjs';
import BaseSelection from './DisplayBaseSelection';
import bases from '../../models/ingredients.mjs';


function BowlDisplay({ addToOrder }) {
    // const [bowl, setBowl] = useState(new Bowl(bowl_sizes.r   egular, "rice"));
    // console.log("[BOWL]", bowl)
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

    const totalSelectedToppings = Object.values(toppingSelections).reduce((sum, qty) => sum + qty, 0);

    const calculatePrice = () => {
        const basePrice = size.price;
        const extraToppings = Math.max(0, totalSelectedToppings - size.num_ingredients);
        const extraToppingsCost = extraToppings * (basePrice * 0.2); // 20% of base price per extra topping
        let totalPrice = (basePrice + extraToppingsCost) * quantity;

        return totalPrice.toFixed(2); // Return price with 2 decimal places
    };

    const handleAddBowl = () => {
        const selectedProteins = Object.keys(proteinSelections).filter(protein => proteinSelections[protein] > 0);
        const selectedToppings = Object.keys(toppingSelections).filter(topping => toppingSelections[topping] > 0);

        const newBowl = new Bowl(size.str, base);
        newBowl.proteines = selectedProteins;
        newBowl.ingredients = selectedToppings;
        newBowl.price = size.price;
    
        console.log("Proteines", selectedProteins)

        addToOrder(newBowl, quantity);
    };

    const totalPrice = calculatePrice();
    
    return (
        <div className="container-fluid content-padding">
            <h2 className="text-center mb-4">Create Your PokéBowl</h2>

            {/* Size Selection */}
            <div className="row">
                <SizeSelection size={size} handleSizeChange={handleSizeChange} />

            {/*  Proteins, and Toppings Side by Side */}
                <BaseSelection  base={base} setBase={setBase} />
            </div>
            
                {/* Proteins Table */}
                <div className="row mt-6">
                <ProteinSelection maxProteins={size.num_proteins} proteinSelections={proteinSelections} setProteinSelections={setProteinSelections}/>

                {/* Toppings Table */}
                <IngredientSelection maxToppings={size.num_ingredients} toppingSelections={toppingSelections} setToppingSelections={setToppingSelections}/>
            </div>

            {/* Number of Bowls Selection */}
            <Form.Group className="mb-3 w-50 mx-auto">
                <Form.Label><strong>Number of bowls</strong></Form.Label>
                <Form.Select
                    aria-label="Choose number of bowls"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
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
                <Button variant="success" className="mt-3 px-5 py-2" onClick={handleAddBowl}>
                    Add Bowl to Order
                </Button>
            </div>
        </div>
    );
}

export default BowlDisplay;
