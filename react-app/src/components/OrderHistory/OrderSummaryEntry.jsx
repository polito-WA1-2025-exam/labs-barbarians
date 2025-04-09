
function OrderSummaryEntry(props){
    const bowl = props.bowl;
    const quantity = props.quantity;
    console.log(quantity);
    return (<>
        <tr>
            <td>{bowl.size.str}</td>
            <td>{bowl.base}</td>
            <td>{bowl.proteines.join(", ")}</td>
            <td>{bowl.ingredients.join(", ")}</td>
            <td>{quantity}</td>
        </tr>
    </>);
}

export default OrderSummaryEntry;