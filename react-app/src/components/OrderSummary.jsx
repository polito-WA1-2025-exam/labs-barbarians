import './OrderSummary.css';

function OrderSummary(props) {

    const bowls = props.bowls

    const SubmitOrder = () => {
        console.log('Order submit button pressed!');
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
                        <td>{bowl.price()} €</td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <button className="button" onClick={SubmitOrder}>Submit Order</button>
            
        </>
    )

}


export default OrderSummary;