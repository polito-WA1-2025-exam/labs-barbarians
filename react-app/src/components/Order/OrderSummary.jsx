import { Offcanvas, Button } from "react-bootstrap";
import BowlSummary from "./OrderBriefSummary";
import "./OrderSummary.css";

function OrderSummary(props) {
  const bowls = props.getBowls();

  const handleClose = () => props.setShow(false);

  const calculateTotalPrice = () => {
    return bowls.reduce((total, [bowl, quantity]) => {
      return total + bowl.price * quantity; // Multiply price by quantity
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const handleSubmit = async () => {
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
      totalPrice: totalPrice,
    };

    try {
      await props.onSubmitOrder(props.username, orderData); 
      alert("Order submitted successfully!");
      props.setShow(false); 
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit the order. Please try again.");
    }
  };

  return (
    <Offcanvas show={props.show} onHide={handleClose} placement="end">
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
          />
        ))}
        <h3>Total Price: €{totalPrice.toFixed(2)}</h3>
        <Button variant="success" className="button" onClick={handleSubmit}>
          Submit Order
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default OrderSummary;