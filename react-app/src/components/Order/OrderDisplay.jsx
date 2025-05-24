import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OrderSummary from './OrderSummary';
import BowlDisplay from './BowlDisplay';
import { MdOutlineShoppingBag } from "react-icons/md";
import { fetchBowlAvailability } from '../../API/API.js';
import { Bowl, bowl_sizes } from '../../models/bowl.mjs';

function OrderDisplay(props) {
    const [show, setShow] = useState(false);
    const [availability, setAvailability] = useState({}); // Add availability state
    const handleShow = () => setShow(true);

    const [size, setSize] = useState(bowl_sizes.R); // Default to Regular size
    const [base, setBase] = useState("Rice");
    const [proteinSelections, setProteinSelections] = useState({});
    const [toppingSelections, setToppingSelections] = useState({});
    const [quantity, setQuantity] = useState(1);


    const setNumOfBowlAndEditMode = (bowl, num, edit) => {
      if (edit == true) {
        setSize(bowl_sizes[bowl.size])
        setBase(bowl.base)
        setProteinSelections(listToDictConverter(bowl.proteines))
        setToppingSelections(listToDictConverter(bowl.ingredients))
        setQuantity(1)
      } else {
        setSize(bowl_sizes.R)
        setBase("Rice")
        setProteinSelections({})
        setToppingSelections({})
        setQuantity(1)
      }

      props.setNumOfBowl(bowl, num)
    }

    const listToDictConverter = (inputList) => {
      const returnDict = {};
      for (const listItem of inputList) {
        returnDict[listItem] = (returnDict[listItem] || 0) + 1;
      }
      return returnDict
    }

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
        <BowlDisplay addToOrder={props.addToOrder} availability={availability} size={size} setSize={setSize} base={base} setBase={setBase} 
          proteinSelections={proteinSelections} setProteinSelections={setProteinSelections} toppingSelections={toppingSelections} 
          setToppingSelections={setToppingSelections} quantity={quantity} setQuantity={setQuantity}/>
        <Button variant="primary" onClick={handleShow} className="me-2">
             Go to Order
            <MdOutlineShoppingBag/>
        </Button>
        <OrderSummary 
          show={show} 
          setShow={setShow} 
          getBowls={props.getBowls} 
          setNumOfBowlAndEditMode={setNumOfBowlAndEditMode} 
          onSubmitOrder={handleSubmitOrder} // Use the updated submit function
          availability={availability} // Pass availability to OrderSummary
          setAvailability={setAvailability} 
          setNumOfBowl={props.setNumOfBowl}
        />
      </>
    );
}

export default OrderDisplay;