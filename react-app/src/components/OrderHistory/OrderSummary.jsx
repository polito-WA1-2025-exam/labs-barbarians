import Modal from 'react-bootstrap/Modal';
// Removed unused Button import
import Table from 'react-bootstrap/Table';
import OrderSummaryEntry from './OrderSummaryEntry';

function OrderSummary(props){

    const order = props.order;

    return (
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Order Summmary
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
          <thead>
            <tr>
              <th>Size</th>
              <th>Base</th>
              <th>Proteins</th>
              <th>Toppings</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {order?.bowls?.map((bowl, index) => <OrderSummaryEntry key={index} bowl={bowl[0]} quantity={bowl[1]} />)}
          </tbody>
          </Table>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer> */}
      </Modal>
    );
}

export default OrderSummary; 