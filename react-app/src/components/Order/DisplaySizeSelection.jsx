import React from 'react';
import Form from 'react-bootstrap/Form';
import { bowl_sizes } from '../../models/bowl.mjs';

function SizeSelection({ size, handleSizeChange }) {
    return (
        <div className="col-md-6">
            <h6 className="text-center"><strong>Choose Your Size</strong></h6>
            <Form.Group className="mb-3 w-55 mx-auto">
                <Form.Label>Select Size</Form.Label>
                <Form.Select
                    aria-label="Choose size"
                    value={size.key}
                    onChange={(e) => handleSizeChange(e.target.value)}
                >
                    {Object.values(bowl_sizes).map((size) => (
                        <option key={size.key} value={size.key}>
                            {size.label}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </div>
    );
}

export default SizeSelection;