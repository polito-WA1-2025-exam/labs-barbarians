function OrderHistoryEntry({ order }) {
  return (
    <>
      <td>{order.id}</td>
      <td>{order.date}</td>
      <td>{order.numBowls}</td>
      <td>{order.price.toFixed(2)} €</td>
    </>
  );
}

export default OrderHistoryEntry;