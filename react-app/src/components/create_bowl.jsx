import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';

const proteinsList = ["Salmon", "Tuna", "Chicken", "Tofu"];
const toppingsList = ["Avocado", "Ananas", "Cashew Nuts", "Mango", "Peppers"];

function CreateBowl() {

    /* State variables are created */
    const [size, setSize] = useState("R");
    const [base, setBase] = useState("Rice");
    const [proteinSelections, setProteinSelections] = useState({});
    const [toppingSelections, setToppingSelections] = useState({});
    const [quantity, setQuantity] = useState(1);

    /* Maximum number of proteins and toppings in relation to bowl size are defined */
    const sizeConstraints = {
        R: { maxProteins: 1, maxToppings: 4 },
        M: { maxProteins: 2, maxToppings: 4 },
        L: { maxProteins: 3, maxToppings: 6 },
    };

    // Calculate total selected proteins and toppings
    const totalSelectedProteins = Object.values(proteinSelections).reduce((sum, qty) => sum + qty, 0);
    const totalSelectedToppings = Object.values(toppingSelections).reduce((sum, qty) => sum + qty, 0);

    // defining constants for maximum number of proteins and toppings based on size
    const maxProteins = sizeConstraints[size].maxProteins;
    const maxToppings = sizeConstraints[size].maxToppings;

    // remaining proteins and toppings based on selections
    const remainingProteins = maxProteins - totalSelectedProteins;
    const remainingToppings = maxToppings - totalSelectedToppings

    
    // A function to automatically adjust protein and topping selections when the bowl
    // size is changed to a smaller one. This keeps the ingredients within the restrictions.

    const handleSizeChange = (newSize) => {

        setSize(newSize); // setting state variable to new size
        const newMaxProteins = sizeConstraints[newSize].maxProteins;
        const newMaxToppings = sizeConstraints[newSize].maxToppings;

        // Trim extra selections for proteins
        let adjustedProteins = {};
        let remainingProteins = newMaxProteins;
        for (let protein of Object.keys(proteinSelections)) {
            if (remainingProteins > 0) {
                let allowed = Math.min(proteinSelections[protein], remainingProteins);
                adjustedProteins[protein] = allowed;
                remainingProteins -= allowed;
            }
        }

        // Trim extra selections for toppings
        let adjustedToppings = {};
        let remainingToppings = newMaxToppings;
        for (let topping of Object.keys(toppingSelections)) {
            if (remainingToppings > 0) {
                let allowed = Math.min(toppingSelections[topping], remainingToppings);
                adjustedToppings[topping] = allowed;
                remainingToppings -= allowed;
            }
        }

        setProteinSelections(adjustedProteins);
        setToppingSelections(adjustedToppings);
    };


    /* Functions to handle change of protein and topping values in forms */
    
    const handleProteinChange = (protein, value) => {
        const newQty = Number(value);
        const newTotal = totalSelectedProteins - (proteinSelections[protein] || 0) + newQty;

        if (newTotal <= maxProteins) {
            setProteinSelections(prev => ({ ...prev, [protein]: newQty }));
        }
    };

    const handleToppingChange = (topping, value) => {
        const newQty = Number(value);
        const newTotal = totalSelectedToppings - (toppingSelections[topping] || 0) + newQty;

        if (newTotal <= maxToppings) {
            setToppingSelections(prev => ({ ...prev, [topping]: newQty }));
        }
    };





    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Create Your PokéBowl</h2>

            {/* Size Selection: 
            Size is selected by user and value R, M or L is stored in state "size". Selected size affects maxiumum amount of proteins 
            and toppings as seen in "sizeConstraints".
            */}

            <Form.Group className="mb-3 w-50 mx-auto">
                <Form.Label><strong>Choose your size</strong></Form.Label>
                <Form.Select aria-label="Choose size" value={size} onChange={(e) => handleSizeChange(e.target.value)}>
                    <option value="R">Regular</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                </Form.Select>
            </Form.Group>

            {/* Base Selection 
            Base type is selected by user and stored in state "base".
            */}
            <Form.Group className="mb-3 w-50 mx-auto">
                <Form.Label><strong>Choose your base</strong></Form.Label>
                <Form.Select aria-label="Choose base" value={base} onChange={(e) => setBase(e.target.value)}>
                    <option value="rice">Rice</option>
                    <option value="black_rice">Black Rice</option>
                    <option value="salad">Salad</option>
                </Form.Select>
            </Form.Group>

            {/* Protein Table: 
            Proteins are mapped onto each row from "proteinsList". Form is inserted in second column, where the user chosen protein
            is stored in "proteinSelections" state. Choice of protein numbers is depedent on state variable "size".
            */}
            <h4 className="text-center mt-4">Choose Proteins (Max: {maxProteins})</h4>
            <p className="text-center text-muted">Remaining: {remainingProteins}</p>
            <div className="d-flex justify-content-center">
                <Table striped bordered hover="w-75">
                    <thead>
                        <tr>
                            <th scope="col">Protein</th>
                            <th scope="col">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Returns a row with two columns for each protein in "proteinsList". First column input is protein name.
                        Second is the selectable form*/}
                        {proteinsList.map((protein) => (
                            <tr key={protein}>
                                <td>{protein}</td>
                                <td>
                                    <Form.Select value={proteinSelections[protein] || 0} onChange={(e) => handleProteinChange(protein, e.target.value)}>
                                        
                                        {/* Drop down selection is restricted to remaining proteins*/}

                                        {[...Array(Math.min(maxProteins - totalSelectedProteins + (proteinSelections[protein] || 0), maxProteins) + 1).keys()]
                                        .map(i => (
                                            <option key={i} value={i}>{i}</option>
                                        ))}
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Topping Table: 
            Applied logic is identical to proteins table.
            */}
            <h4 className="text-center mt-4">Choose Toppings (Max: {maxToppings})</h4>
            <p className="text-center text-muted">Remaining: {remainingToppings}</p>
            <div className="d-flex justify-content-center">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th scope="col">Topping</th>
                            <th scope="col">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {toppingsList.map((topping) => (
                            <tr key={topping}>
                                <td>{topping}</td>
                                <td>
                                    <Form.Select value={toppingSelections[topping] || 0} onChange={(e) => handleToppingChange(topping, e.target.value)}>

                                        {/* Drop down selection is restricted to remaining toppings*/}

                                        {[...Array(Math.min(maxToppings - totalSelectedToppings + (toppingSelections[topping] || 0), maxToppings) + 1).keys()]
                                        .map(i => (
                                            <option key={i} value={i}>{i}</option>
                                        ))}
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Number of Bowls Selection */}
            <Form.Group className="mb-3 w-50 mx-auto">
                <Form.Label><strong>Number of bowls</strong></Form.Label>
                <Form.Select aria-label="Choose number of bowls" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Form.Select>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="success" className="mt-3 px-5 py-2">Add bowl to order</Button>

            {/* No content yet. Could call an external function here to create an
            order object using data stored in state variables. Afterwards chosen options should be reset*/}
        </div>
    );
}

export default CreateBowl;
