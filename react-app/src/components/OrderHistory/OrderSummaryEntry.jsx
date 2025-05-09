function OrderSummaryEntry({ bowl, quantity }) {
  return (
    <tr>
      <td>{bowl.size}</td>
      <td>{bowl.base}</td>
      <td>{bowl.proteines.join(', ')}</td>
      <td>{bowl.ingredients.join(', ')}</td>
      <td>{quantity}</td>
    </tr>
  );
}

export default OrderSummaryEntry;