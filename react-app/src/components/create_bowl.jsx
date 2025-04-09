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
        R: { maxProteins: 1, maxToppings: 2 },
        M: { maxProteins: 2, maxToppings: 3 },
        L: { maxProteins: 3, maxToppings: 4 },
    };

    /* Functions to handle change of form values */
    const handleProteinChange = (protein, value) => {
        setProteinSelections(prev => ({ ...prev, [protein]: Number(value) }));
    };

    const handleToppingChange = (topping, value) => {
        setToppingSelections(prev => ({ ...prev, [topping]: Number(value) }));
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
                <Form.Select aria-label="Choose size" value={size} onChange={(e) => setSize(e.target.value)}>
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
            <h4 className="text-center mt-4">Choose Proteins</h4>
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
                                        {[...Array(sizeConstraints[size].maxProteins + 1).keys()].map(i => (
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
            <h4 className="text-center mt-4">Choose Toppings</h4>
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
                                        {[...Array(sizeConstraints[size].maxToppings + 1).keys()].map(i => (
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
            <Button variant="success" className="mt-3 px-5 py-2">Order Now</Button>

            {/* No content yet. Could call an external function here to create an
            order object using data stored in state variables. Afterwards chosen options should be reset*/}
        </div>
    );
}

export default CreateBowl;
