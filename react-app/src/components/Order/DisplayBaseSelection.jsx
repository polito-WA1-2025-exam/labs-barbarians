import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { bases } from '../../models/ingredients.mjs';


function BaseSelection({base, setBase}){
    return(
        <div className="col-md-6">
                {/* Base Selection */}
                
                    <h6 className="text-center"><strong>Choose Your Base</strong></h6>
                    <Form.Group className="mb-3 w-50 mx-auto">
                        <Form.Label><strong>Select Base</strong></Form.Label>
                        <Form.Select
                            aria-label="Choose base"
                            value={base}
                            onChange={(e) => setBase(e.target.value)}>
                            {Object.values(bases).map((base) => (
                                <option key={base} value={base}>
                                    {base}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
    );
}

export default BaseSelection;