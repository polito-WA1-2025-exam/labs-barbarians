import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { ingredients, proteines } from '../../models/ingredients.mjs';


function IngredientSelection({maxToppings, toppingSelections, setToppingSelections}) {

    const totalSelectedToppings = Object.values(toppingSelections).reduce((sum, qty) => sum + qty, 0);

    const remainingToppings = maxToppings - totalSelectedToppings;
    const additionalToppings = totalSelectedToppings - maxToppings

    const handleToppingChange = (topping, value) => {
        const newQty = Number(value);
        setToppingSelections(prev => ({ ...prev, [topping]: newQty }));
    };

    return(
        <div className="col-md-6">
                        <h4 className="text-center">Choose Toppings </h4>
                        <h5 className="text-center">Included: {maxToppings}</h5>
                        <td className="text-center align-middle">
                            {remainingToppings >= 0 ? (
                            <p className="text-center text-muted">Remaining: {remainingToppings}</p>
                            ):(
                            <p className="text-center text-muted">Additional selections: {additionalToppings}</p>
                            )}        
                        </td>

                        <div className="scrollable-table">
                            <Table striped bordered hover  >
                                <thead>
                                    <tr>
                                        <th scope="col">Topping</th>
                                        <th scope="col">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(ingredients).map((topping) => (
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
                    
                );
}

export default IngredientSelection;