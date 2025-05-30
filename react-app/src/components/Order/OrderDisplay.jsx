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
        if (props.loggedIn) {
            fetchBowlAvailability()
                .then(data => {
                    const availabilityMap = data.reduce((acc, { size, count }) => {
                        acc[size] = count;
                        return acc;
                    }, {});
                    setAvailability(availabilityMap);
                })
                .catch(err => console.error("Error fetching availability:", err));
        }
    }, [props.loggedIn]);

    const handleSubmitOrder = async (username, orderData) => {
        try {
            await props.submitOrder(username, orderData);
            alert("Order submitted successfully!");
            // Refresh availability after order
            const updatedAvailability = await fetchBowlAvailability();
            const availabilityMap = updatedAvailability.reduce((acc, { size, count }) => {
                acc[size] = count;
                return acc;
            }, {});
            setAvailability(availabilityMap);
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
                username={props.username}
                orderQuantities={props.orderQuantities}
                setOrderQuantities={props.setOrderQuantities}
            />
        </>
    );
}

export default OrderDisplay;