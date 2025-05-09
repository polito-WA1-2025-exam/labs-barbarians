import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import OrderHistoryEntry from './OrderHistoryEntry';
import OrderSummary from './OrderSummary';

function DisplayOrderHistory({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setModalShow(true);
  };

  return (
    <>
      <h1 className="text-center mt-5">Order History</h1>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Number of Bowls</th>
            <th>Total Price (€)</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} onClick={() => handleOrderClick(order)}>
                <OrderHistoryEntry order={order} />
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No past orders found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {selectedOrder && (
        <OrderSummary
          order={selectedOrder}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      )}
    </>
  );
}

export default DisplayOrderHistory;