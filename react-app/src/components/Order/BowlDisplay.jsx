import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';

const proteinsList = ["Salmon", "Tuna", "Chicken", "Tofu"];
const toppingsList = ["Avocado", "Ananas", "Cashew Nuts", "Mango", "Peppers"];

function BowlDisplay({ addToOrder }) {
    const [size, setSize] = useState("R");
    const [base, setBase] = useState("Rice");
    const [proteinSelections, setProteinSelections] = useState({});
    const [toppingSelections, setToppingSelections] = useState({});
    const [quantity, setQuantity] = useState(1);

    const sizeConstraints = {
        R: { maxProteins: 1, maxToppings: 4, basePrice: 9 },
        M: { maxProteins: 2, maxToppings: 4, basePrice: 11 },
        L: { maxProteins: 3, maxToppings: 6, basePrice: 14 },
    };

    const totalSelectedProteins = Object.values(proteinSelections).reduce((sum, qty) => sum + qty, 0);
    const totalSelectedToppings = Object.values(toppingSelections).reduce((sum, qty) => sum + qty, 0);

    const maxProteins = sizeConstraints[size].maxProteins;
    const maxToppings = sizeConstraints[size].maxToppings;

    const remainingProteins = maxProteins - totalSelectedProteins;
    const remainingToppings = maxToppings - totalSelectedToppings;

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setProteinSelections({});
        setToppingSelections({});
    };

    const handleProteinChange = (protein, value) => {
        const newQty = Number(value);
        setProteinSelections(prev => ({ ...prev, [protein]: newQty }));
    };

    const handleToppingChange = (topping, value) => {
        const newQty = Number(value);
        setToppingSelections(prev => ({ ...prev, [topping]: newQty }));
    };

    const calculatePrice = () => {
        const basePrice = sizeConstraints[size].basePrice;
        const extraToppings = Math.max(0, totalSelectedToppings - maxToppings);
        const extraToppingsCost = extraToppings * (basePrice * 0.2); // 20% of base price per extra topping
        let totalPrice = (basePrice + extraToppingsCost) * quantity;


       

        return totalPrice.toFixed(2); // Return price with 2 decimal places
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
            price: calculatePrice(),
        };

        addToOrder(newBowl);
    };

    const totalPrice = calculatePrice();

    return (
        <div className="container-fluid content-padding">
            <h2 className="text-center mb-4">Create Your PokéBowl</h2>

            {/* Size Selection */}
            <div className="row">
                <div className="col-md-6">
                <Form.Group className="mb-3 w-50 mx-auto">
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

            {/*  Proteins, and Toppings Side by Side */}
                <div className="col-md-6">
                {/* Base Selection */}
                
                    <h6 className="text-center"><strong>Choose Your Base</strong></h6>
                    <Form.Group className="mb-3 w-50 mx-auto">
                        <Form.Label><strong>Select Base</strong></Form.Label>
                        <Form.Select
                            aria-label="Choose base"
                            value={base}
                            onChange={(e) => setBase(e.target.value)}>
                            <option value="Rice">Rice</option>
                            <option value="Black Rice">Black Rice</option>
                            <option value="Salad">Salad</option>
                        </Form.Select>
                    </Form.Group>
                </div>
            </div>
            
                {/* Proteins Table */}
                <div className="row mt-6">
                <div className="col-md-6">
                    <h4 className="text-center">Choose Proteins </h4>
                    <h5 className="text-center ">Max: {maxProteins}</h5>
                    <p className="text-center text-muted">Remaining: {remainingProteins}</p>
                    <div classname="table-responsive">
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
                                            disabled={remainingProteins === 0 && !(proteinSelections[protein] > 0)}
                                        >
                                            {[...Array(maxProteins +1 ).keys()].map((i) => (
                                                <option key={i} value={i}>
                                                    {i}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    </div>
                </div>

                {/* Toppings Table */}
                <div className="col-md-6">
                    <h4 className="text-center">Choose Toppings </h4>
                    <h5 classnmae="text-center ">Max: {maxToppings}</h5>
                    <p className="text-center text-muted">Remaining: {remainingToppings}</p>
                    <div className="scrollable-table">
                        <div className="table-responsive">
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
                                                {[...Array(maxToppings + 1).keys()].map((i) => (
                                                    <option key={i} value={i}>
                                                        {i}
                                                    </option>
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
