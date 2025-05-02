import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { bowl_sizes } from '../../models/bowl.mjs';


function SizeSelection({size, handleSizeChange}){
    return(
        <div className="col-md-6">
        <Form.Group className="mb-3 w-50 mx-auto">
            <Form.Label><strong>Choose your size</strong></Form.Label>
            <Form.Select
                aria-label="Choose size"
                value={size.str}
                onChange={(e) => handleSizeChange(e.target.value)}
            >
                {Object.values(bowl_sizes).map((size) => (<option value={size.str}> {size.str}</option>))};
            </Form.Select>
        </Form.Group>
    </div>
    );
}

export default SizeSelection;