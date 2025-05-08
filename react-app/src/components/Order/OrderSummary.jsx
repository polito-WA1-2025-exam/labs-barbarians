import './OrderSummary.css';

function OrderSummary(props) {
    const bowls = props.bowls;
    const onSubmitOrder = props.onSubmitOrder;
    const calculateTotalPrice = () => {
        // Calculate the total price for all bowls
        const totalPriceWithoutDiscount = bowls.reduce((total, bowl) => {
            return total + parseFloat(bowl.price); // Sum up the price of all bowls
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
        <>
            <h2>Order Summary</h2>

            <table>
                <thead>
                    <tr>
                        <th>Size</th>
                        <th>Base</th>
                        <th>Proteins</th>
                        <th>Toppings</th>
                        <th>Number of Bowls</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {bowls.map((bowl, index) => (
                        <tr key={index}>
                            <td>{bowl.size}</td>
                            <td>{bowl.base}</td>
                            <td>{Array.isArray(bowl.proteines) ? bowl.proteines.join(', ') : ''}</td>
                            <td>{Array.isArray(bowl.ingredients) ? bowl.ingredients.join(', ') : ''}</td>
                            <td>{bowl.numberOfBowls}</td>
                            <td>{parseFloat(bowl.price).toFixed(2)}€</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Total Price: €{totalPrice.toFixed(2)}</h3>

            <button variant="success" className="button" onClick={handleSubmit}>Submit Order</button>
        </>
    );
}

export default OrderSummary;