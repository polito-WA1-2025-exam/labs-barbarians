import { Button, Card, Form, ListGroup } from "react-bootstrap";
import {useEffect} from "react"

function BowlSummary({ idx, bowl, numberOfBowls, setNumOfBowl, availability, setAvaibility, orderQuantities, setOrderQuantities }) {
    console.log("New quantity should be set", orderQuantities)

    const handleQuantityChange = (e) => {
        const newQuantity = Number(e.target.value);

        // Update the order state in the parent component
        setNumOfBowl(bowl, newQuantity);
        

        // Update order quantities when numberOfBowls changes
        setOrderQuantities((prev) => ({
            ...prev,
            [bowl.size]: prev[bowl.size] - numberOfBowls  + newQuantity,
        }));
    };

    const handleRemoveBowl = () => {
        // Remove the bowl from the order in the parent component
        setNumOfBowl(bowl, 0);

    };

    return (
        <>
            <Card className="mb-3 shadow-sm">
                <Card.Header>
                    <h5 className="mb-0">Bowl {idx + 1}</h5>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush" className="mb-3">
                        <ListGroup.Item><strong>Size:</strong> {bowl.size.charAt(0).toUpperCase() + bowl.size.slice(1)}</ListGroup.Item>
                        <ListGroup.Item><strong>Base:</strong> {bowl.base}</ListGroup.Item>
                        <ListGroup.Item><strong>Proteins:</strong> {bowl.proteines.join(", ")}</ListGroup.Item>
                        <ListGroup.Item><strong>Ingredients:</strong> {bowl.ingredients.join(", ")}</ListGroup.Item>
                        <ListGroup.Item><strong>Price:</strong> {bowl.price} €</ListGroup.Item>
                    </ListGroup>

                    <Form.Group className="mb-3" controlId="quantitySelect">
                        <Form.Label><strong>Number of Bowls:</strong></Form.Label>
                        <Form.Select
                            value={numberOfBowls}
                            onChange={handleQuantityChange}
                        >
                            {(() => {
                                if (availability[bowl.size] !== undefined && orderQuantities[bowl.size] !== undefined) {
                                    const maxSelectable = Math.min(
                                        availability[bowl.size] - orderQuantities[bowl.size] + numberOfBowls,
                                        10
                                    );

                                    return [...Array(maxSelectable + 1).keys()]
                                        .slice(1) // Remove 0 from the options
                                        .map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ));
                                } else {
                                    return (
                                        <option value={numberOfBowls}>{numberOfBowls}</option> // Fallback option
                                    );
                                }
                            })()}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="danger" onClick={handleRemoveBowl}>
                        <i className="bi bi-trash"> Remove Bowl</i>
                    </Button>
                </Card.Body>
            </Card>
        </>
    );
}

export default BowlSummary;