import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { proteines } from '../../models/ingredients.mjs';

function ProteinSelection({maxProteins, proteinSelections, setProteinSelections}) {
    console.log(maxProteins)

    const totalSelectedProteins = Object.values(proteinSelections).reduce((sum, qty) => sum + qty, 0);
    const remainingProteins = maxProteins - totalSelectedProteins;

    const handleProteinChange = (protein, value) => {
        const newQty = Number(value);
        setProteinSelections(prev => ({ ...prev, [protein]: newQty }));
    };

    return(
        <div className="col-md-6">
                            <h4 className="text-center">Choose Proteins </h4>
                            <h5 className="text-center ">Max: {maxProteins}</h5>
                            <p className="text-center text-muted">Remaining: {remainingProteins}</p>
                            <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th scope="col">Protein</th>
                                        <th scope="col">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(proteines).map((protein) => (
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
    )
}

export default ProteinSelection;