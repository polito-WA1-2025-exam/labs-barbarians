import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import OrderHistoryEntry from './OrderHistoryEntry';
import OrderSummary from './OrderSummary';
import {parseJSONToBowl} from '../../models/bowl.mjs';
import { Order } from '../../models/order.mjs';
import { LoadOrders, LoadBowlsOrder } from '../../API/API.js';

function DisplayOrderHistory() {
  const [pastOrders, setPastOrders] = useState([]); // Mock past orders
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setModalShow(true);
  };

  const retriveOrders = (username) =>{
    const pastOrders = [];
    LoadOrders(username)
    .then((ordersJSONs => { 
      ordersJSONs.forEach(orderJSON => {
        const order = new Order(orderJSON.id);
        order.date = orderJSON.date;
        order.price = orderJSON.totPrice;
        LoadBowlsOrder(username,order.id)
        .then(
          loadedBowlsJSON => {
              loadedBowlsJSON.forEach(bowlJSON => {
                const bowl = parseJSONToBowl(bowlJSON);
                for(let i = 0; i < bowlJSON.nrBowls; i++){
                  order.addBowl(bowl);
                }
              });
            }).catch(error => {
              console.error("Error loading bowls for order:", error);
            });
            pastOrders.push(order);
      });
      setPastOrders(pastOrders);
      console.log("Past Orders:", pastOrders);
    }))
  }

  useEffect((username) =>{
    retriveOrders('ali');
  },[])



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
          {pastOrders.length > 0 ? (
            pastOrders.map((order) => (
              <tr key={order.id} onClick={() => handleOrderClick(order)}>
                <OrderHistoryEntry order={order}/>
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