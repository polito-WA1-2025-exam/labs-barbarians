import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import OrderSummaryEntry from './OrderSummaryEntry';

function OrderSummary({ order, ...props }) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Order Summary
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Size</th>
              <th>Base</th>
              <th>Proteins</th>
              <th>Ingredients</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {order.bowls.map(([bowl, quantity], index) => (
              <OrderSummaryEntry key={index} bowl={bowl} quantity={quantity} />
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default OrderSummary;