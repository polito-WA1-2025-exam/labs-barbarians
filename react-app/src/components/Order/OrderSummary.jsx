import { Offcanvas, Button } from "react-bootstrap";
import BowlSummary from "./OrderBriefSummary";
import "./OrderSummary.css";
import { fetchBowlAvailability } from '../../API/API.js';

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
    // Map size strings to database keys
    const sizeMap = {
        regular: "R",
        medium: "M",
        big: "L",
    };

    // Calculate the required counts for each size
    const sizeCounts = bowls.reduce((acc, [bowl, quantity]) => {
        const availabilityKey = sizeMap[bowl.size.toLowerCase()]; // Map size to availability key
        if (!availabilityKey) {
            console.error(`Invalid size: ${bowl.size}`);
            return acc;
        }
        acc[availabilityKey] = (acc[availabilityKey] || 0) + quantity;
        return acc;
    }, {});

    console.log("Size counts:", sizeCounts);
    console.log("Availability:", props.availability);

    // Check if there are enough bowls available for each size
    for (const [sizeKey, count] of Object.entries(sizeCounts)) {
        if (count > (props.availability[sizeKey] || 0)) {
            alert(`Cannot submit order. Not enough bowls available for size ${sizeKey}.`);
            return;
        }
    }

    const orderData = {
        order: {
            bowls: bowls.map(([bowl, quantity]) => ({
                size: sizeMap[bowl.size.toLowerCase()], // Map size to database key
                base: bowl.base,
                proteins: bowl.proteines,
                ingredients: bowl.ingredients,
                nrBowls: quantity,
                price: bowl.price,
            })),
        },
        totalPrice: calculateTotalPrice(),
    };

    try {
        await props.onSubmitOrder(props.username, orderData);
        alert("Order submitted successfully!");

        // Fetch updated availability
        const updatedAvailability = await fetchBowlAvailability();
        props.setAvailability(updatedAvailability); // Update availability in parent

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