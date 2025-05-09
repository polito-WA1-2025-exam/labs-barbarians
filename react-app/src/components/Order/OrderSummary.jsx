import { Card, ListGroup} from "react-bootstrap";
import Offcanvas from 'react-bootstrap/Offcanvas';
import BowlSummary from './OrderBriefSummary';
import './OrderSummary.css';

function OrderSummary(props) {
    const bowls = props.getBowls();

    const handleClose = () => props.setShow(false);

    const calculateTotalPrice = () => {
        // Calculate the total price for all bowls
        const totalPriceWithoutDiscount = bowls.reduce((total, bowl) => {
            return total + parseFloat(bowl[0].price * bowl[1]); // Sum up the price of all bowls
        }, 0);

        // Calculate the total number of bowls
        const totalBowls = bowls.reduce((total, bowl) => total + bowl.numberOfBowls, 0);

        // Apply a 10% discount if more than 5 bowls are ordered
        if (totalBowls >= 4) {
            return totalPriceWithoutDiscount * 0.9; // Apply 10% discount
        }

        return totalPriceWithoutDiscount;
    };

    const totalPrice = calculateTotalPrice();

    const handleSubmit = () => {
        const orderData = {
            order: {
            bowls: bowls.map((bowl) => ({
                size: bowl.size,
                base: bowl.base,
                proteins: bowl.proteines,
                ingredients: bowl.ingredients,
                nrBowls: Number(bowl.numberOfBowls), 
                price: parseFloat(bowl.price), 
            })),
            },
            totalPrice: parseFloat(totalPrice.toFixed(2)), // Ensure totalPrice is a number
        };

        onSubmitOrder(props.username,orderData); // Call the function passed from App.jsx
    };

    return (
        <Offcanvas show={props.show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>   
            {bowls.map((bowl, index) => (<BowlSummary key={index} idx={index} bowl={bowl[0]} numberOfBowls={bowl[1]} setNumOfBowl={props.setNumOfBowl}/>))}
            <h3>Total Price: €{totalPrice.toFixed(2)}</h3>
            <button variant="success" className="button" onClick={handleSubmit}>Submit Order</button>
          </Offcanvas.Body>
        </Offcanvas>
    );
}


export default OrderSummary;