import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, useRef } from 'react';

const proteinsList = ["Salmon", "Tuna", "Chicken", "Tofu"];
const toppingsList = ["Avocado", "Ananas", "Cashew Nuts", "Mango", "Peppers"];

function CreateBowl({ addToOrder }) {
    const [size, setSize] = useState("R");
    const [base, setBase] = useState("Rice");
    const [proteinSelections, setProteinSelections] = useState({});
    const [toppingSelections, setToppingSelections] = useState({});
    const [quantity, setQuantity] = useState(1);

    const sizeConstraints = {
        R: { maxProteins: 1, maxToppings: 4 },
        M: { maxProteins: 2, maxToppings: 4 },
        L: { maxProteins: 3, maxToppings: 6 },
    };

    const totalSelectedProteins = Object.values(proteinSelections).reduce((sum, qty) => sum + qty, 0);
    const totalSelectedToppings = Object.values(toppingSelections).reduce((sum, qty) => sum + qty, 0);

    const maxProteins = sizeConstraints[size].maxProteins;
    const maxToppings = sizeConstraints[size].maxToppings;

    const remainingProteins = maxProteins - totalSelectedProteins;
    const remainingToppings = maxToppings - totalSelectedToppings;

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        const newMaxProteins = sizeConstraints[newSize].maxProteins;
        const newMaxToppings = sizeConstraints[newSize].maxToppings;

        let adjustedProteins = {};
        let remainingProteins = newMaxProteins;
        for (let protein of Object.keys(proteinSelections)) {
            if (remainingProteins > 0) {
                let allowed = Math.min(proteinSelections[protein], remainingProteins);
                adjustedProteins[protein] = allowed;
                remainingProteins -= allowed;
            }
        }

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

    const handleAddBowl = () => {
        const selectedProteins = Object.keys(proteinSelections).filter(protein => proteinSelections[protein] > 0);
        const selectedToppings = Object.keys(toppingSelections).filter(topping => toppingSelections[topping] > 0);

        const newBowl = {
            size,
            base,
            proteines: selectedProteins,
            ingredients: selectedToppings,
            numberOfBowls: quantity,
            price: () => {
                if (size === "R") return 9;
                if (size === "M") return 11;
                if (size === "L") return 14;
                return 0;
            },
        };

        addToOrder(newBowl);
    };

    return (
        <div className="container content-padding">
            <h2 className="text-center mb-4">Create Your PokéBowl</h2>

            <div className="row">
                {/* Size Selection */}
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Choose your size</strong></Form.Label>
                        <Form.Select
                            aria-label="Choose size"
                            value={size}
                            onChange={(e) => handleSizeChange(e.target.value)}
                        >
                            <option value="R">Regular</option>
                            <option value="M">Medium</option>
                            <option value="L">Large</option>
                        </Form.Select>
                    </Form.Group>
                </div>

                {/* Base Selection */}
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Choose your base</strong></Form.Label>
                        <Form.Select
                            aria-label="Choose base"
                            value={base}
                            onChange={(e) => setBase(e.target.value)}
                        >
                            <option value="Rice">Rice</option>
                            <option value="Black Rice">Black Rice</option>
                            <option value="Salad">Salad</option>
                        </Form.Select>
                    </Form.Group>
                </div>
            </div>

            {/* Proteins and Toppings Side by Side */}
            <div className="row mt-4">
                {/* Proteins Table */}
                <div className="col-md-6">
                    <h4 className="text-center">Choose Proteins (Max: {maxProteins})</h4>
                    <p className="text-center text-muted">Remaining: {remainingProteins}</p>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th scope="col">Protein</th>
                                <th scope="col">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proteinsList.map((protein) => (
                                <tr key={protein}>
                                    <td>{protein}</td>
                                    <td>
                                        <Form.Select
                                            value={proteinSelections[protein] || 0}
                                            onChange={(e) => handleProteinChange(protein, e.target.value)}
                                        >
                                            {[...Array(maxProteins + 1).keys()].map(i => (
                                                <option key={i} value={i}>{i}</option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {/* Toppings Table */}
                <div className="col-md-6">
                    <h4 className="text-center text-nowrap">Choose Toppings (Max: {maxToppings})</h4>
                    <p className="text-center text-muted">Remaining: {remainingToppings}</p>
                    <div className="scrollable-table">
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
                                            <Form.Select
                                                value={toppingSelections[topping] || 0}
                                                onChange={(e) => handleToppingChange(topping, e.target.value)}
                                            >
                                                {[...Array(maxToppings + 1).keys()].map(i => (
                                                    <option key={i} value={i}>{i}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Number of Bowls Selection */}
            <Form.Group className="mb-3 w-50 mx-auto">
                <Form.Label><strong>Number of bowls</strong></Form.Label>
                <Form.Select
                    aria-label="Choose number of bowls"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Form.Select>
            </Form.Group>

            {/* Submit Button */}
            <div className="text-center">
                <Button variant="success" className="mt-3 px-5 py-2" onClick={handleAddBowl}>
                    Add Bowl to Order
                </Button>
            </div>
        </div>
    );
}

export default CreateBowl;
