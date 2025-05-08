
function OrderHistoryEntry(props){
    const order = props.order;
    console.log(order);
    return (<>
        <td>{order.id}</td>
        <td>{order.date}</td>
        <td>{order.nrBowls}</td>
        <td>{order.totPrice}</td>
    </>);
}

export default OrderHistoryEntry;