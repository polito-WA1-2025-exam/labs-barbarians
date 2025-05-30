import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OrderSummary from './OrderSummary';
import BowlDisplay from './BowlDisplay';
import { fetchBowlAvailability } from '../../API/API.js';

function OrderDisplay(props) {
    const [show, setShow] = useState(false);
    const [availability, setAvailability] = useState({ R: 0, M: 0, L: 0 }); 
    

    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchBowlAvailability()
            .then(data => {
                const availabilityMap = data.reduce((acc, { size, count }) => {
                    acc[size] = count;
                    return acc;
                }, {});
                setAvailability(availabilityMap);
            })
            .catch(err => console.error("Error fetching availability:", err));
    }, []);
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
            <BowlDisplay
                addToOrder={props.addToOrder}
                availability={availability}
                orderQuantities={props.orderQuantities} 
                setOrderQuantities={props.setOrderQuantities} 
            />
            <Button variant="primary" onClick={handleShow} className="me-2">
                Go to Order
            </Button>
            <OrderSummary
                show={show}
                setShow={setShow}
                getBowls={props.getBowls}
                setNumOfBowl={props.setNumOfBowl}
                onSubmitOrder={handleSubmitOrder}
                availability={availability}
                setAvailability={setAvailability}
                orderQuantities={props.orderQuantities}
                setOrderQuantities={props.setOrderQuantities} 
            />
        </>
    );
}

export default OrderDisplay;