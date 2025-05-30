import { Offcanvas, Button } from "react-bootstrap";
import BowlSummary from "./OrderBriefSummary";
import { bowl_sizes } from "../../models/bowl.mjs";


function OrderSummary(props) {
    const bowls = props.getBowls();

    const calculateTotalPrice = () => {
        return bowls.reduce((total, [bowl, quantity]) => {
            return total + bowl.price * quantity;
        }, 0);
    };

    const handleSubmit = async () => {
        const sizeCounts = bowls.reduce((acc, [bowl, quantity]) => {
            acc[bowl.size] = (acc[bowl.size] || 0) + quantity;
            return acc;
        }, {});

        for (const [sizeKey, count] of Object.entries(sizeCounts)) {
            if (count > (props.availability[sizeKey] || 0)) {
                alert(`Cannot submit order. Not enough bowls available for size ${bowl_sizes[sizeKey].label}.`);
                return;
            }
        }

        const orderData = {
            order: {
                bowls: bowls.map(([bowl, quantity]) => ({
                    size: bowl.size,
                    base: bowl.base,
                    proteins: bowl.proteines,
                    ingredients: bowl.ingredients,
                    nrBowls: quantity,
                    price: bowl.price,
                })),
            },
            totalPrice: calculateTotalPrice(),
        };

        await props.onSubmitOrder(props.username, orderData);
    };

    return (
        <Offcanvas show={props.show} onHide={() => props.setShow(false)} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {bowls.map(([bowl, quantity], index) => (
                    <BowlSummary
                        key={index}
                        idx={index}
                        bowl={bowl}
                        numberOfBowls={quantity}
                        setNumOfBowl={props.setNumOfBowl}
                        availability={props.availability}
                        setAvaibility={props.setAvaibility}
                        orderQuantities={props.orderQuantities}
                        setOrderQuantities={props.setOrderQuantities} 
                    />
                ))}
                <h3>Total Price: €{calculateTotalPrice().toFixed(2)}</h3>
                <Button variant="success" onClick={handleSubmit}>
                    Submit Order
                </Button>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default OrderSummary;