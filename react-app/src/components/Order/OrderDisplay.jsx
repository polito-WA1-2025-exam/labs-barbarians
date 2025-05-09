import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import OrderSummary from './OrderSummary';
import BowlDisplay from './BowlDisplay';
import { MdOutlineShoppingBag } from "react-icons/md";

function OrderDisplay(props) {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    return (
      <>
        <BowlDisplay addToOrder={props.addToOrder} />
        <Button variant="primary" onClick={handleShow} className="me-2">
             Go to Order
            <MdOutlineShoppingBag/>
        </Button>
        <OrderSummary 
          show={show} 
          setShow={setShow} 
          getBowls={props.getBowls} 
          setNumOfBowl={props.setNumOfBowl} 
          onSubmitOrder={props.submitOrder} // Pass the submitOrder function
        />
      </>
    );
}

export default OrderDisplay;