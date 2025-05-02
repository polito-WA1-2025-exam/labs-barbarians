import OrderHistoryEntry from "./OrderHistoryEntry";
import OrderSummary from "./OrderSummary";
import Table from 'react-bootstrap/Table';
import React, { useState } from 'react';
// import Stack from 'react-bootstrap/Stack';

function DisplayOrderHistory(props){

  const orders = props.orders;
  const [displayOrder, setDisplayOrder] = useState(orders[0]);
  const [modalShow, setModalShow] = useState(false);

  const appearOrderSummary = (order) => {
    setDisplayOrder(order);
    setModalShow(true);
  }

    return (
      <>
        <h1 className="text-center mt-5">Order History</h1>
        <Table responsive hover>
          <thead>
            <tr>
              <th>OrderId</th>
              <th>Date</th>
              <th>Number of Bowls</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order =><tr key={order.id} onClick={() => appearOrderSummary(order)}><OrderHistoryEntry order={order} /></tr>)}
          </tbody>
        </Table>
        <OrderSummary order={displayOrder} show={modalShow} onHide={() => setModalShow(false)} />
      </>
    )
}

export default DisplayOrderHistory;