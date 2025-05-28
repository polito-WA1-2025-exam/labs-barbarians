function OrderHistoryEntry({ order }) {

  return (
    <>
      <td>{order.id}</td>
      <td>{order.date}</td>
      <td>{order.nrBowls}</td>
      <td>{order.price.toFixed(2)} €</td>
    </>
  );
}

export default OrderHistoryEntry;