
function OrderHistoryEntry(props){
    const order = props.order;
    // console.log(order);
    return (<>
        <td>{order.id}</td>
        <td>{order.date}</td>
        <td>{order.bowls.length}</td>
        <td>{order.price}</td>
    </>);
}

export default OrderHistoryEntry;