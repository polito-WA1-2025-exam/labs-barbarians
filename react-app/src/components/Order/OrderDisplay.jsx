import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OrderSummary from './OrderSummary';
import BowlDisplay from './BowlDisplay';
import { MdOutlineShoppingBag } from "react-icons/md";
import { fetchBowlAvailability } from '../../API/API.js';

function OrderDisplay(props) {
    const [show, setShow] = useState(false);
    const [availability, setAvailability] = useState({}); // Add availability state

    const handleShow = () => setShow(true);

    useEffect(() => {
      fetchBowlAvailability()
          .then(data => {
              console.log("Fetched availability data:", data); // Debugging log
              const availabilityMap = data.reduce((acc, { size, count }) => {
                  acc[size] = count;
                  return acc;
              }, {});
              console.log("Processed availability map:", availabilityMap); // Debugging log
              setAvailability(availabilityMap);
              
          })
          .catch(err => console.error("Error fetching availability:", err));
  }, [setAvailability]);

    const handleSubmitOrder = async (username, orderData) => {
        try {
            await props.submitOrder(username, orderData); // Submit the order
            alert("Order submitted successfully!");

            // Fetch updated availability
            const updatedAvailability = await fetchBowlAvailability();
            const availabilityMap = updatedAvailability.reduce((acc, { size, count }) => {
                acc[size] = count;
                return acc;
            }, {});
            setAvailability(availabilityMap); // Update availability state as a flat object
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Failed to submit the order. Please try again.");
        }
    };

    return (
      <>
        <BowlDisplay addToOrder={props.addToOrder} availability={availability} />
        <Button variant="primary" onClick={handleShow} className="me-2">
             Go to Order
            <MdOutlineShoppingBag/>
        </Button>
        <OrderSummary 
          show={show} 
          setShow={setShow} 
          getBowls={props.getBowls} 
          setNumOfBowl={props.setNumOfBowl} 
          onSubmitOrder={handleSubmitOrder} // Use the updated submit function
          availability={availability} // Pass availability to OrderSummary
          setAvailability={setAvailability} 
        />
      </>
    );
}

export default OrderDisplay;