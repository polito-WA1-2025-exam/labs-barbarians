import {Button, Card, Form, ListGroup} from "react-bootstrap";


function BowlSummary({idx, bowl, numberOfBowls, setNumOfBowl}) {

    return (
        <>
            <Card className="mb-3 shadow-sm">
                <Card.Header>
                    <h5 className="mb-0">Bowl {idx +1}</h5>
                </Card.Header>
                <Card.Body>
                    <div className="row"></div>
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
                        onChange={(e) => setNumOfBowl(bowl, e.target.value)}
                        >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                            {num}
                            </option>
                        ))}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="danger" onClick={() => setNumOfBowl(bowl, 0)}>
                    <i className="bi bi-trash"> Remove Bowl</i>
                    </Button>
                </Card.Body>
            </Card>
        </>
    );
}

export default BowlSummary;