import Form from 'react-bootstrap/Form';

function create() {
    return(
        
        <Form.Select aria-label="Choose size">
        <option>Open this select menu</option>
        <option value="1">Regular</option>
        <option value="2">Medium</option>
        <option value="3">Large</option>
        </Form.Select>
    );

}
export default create