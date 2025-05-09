import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Bowl, generateBowls} from './models/bowl.mjs';
import { Order } from './models/order.mjs';
import NavBar from './components/NavBar';
import ProfileModal from './components/Profile/ProfileModal';
import BowlDisplay from './components/Order/BowlDisplay';
import DisplayOrderHistory from './components/OrderHistory/OrderHistory';
import LoginPage from './components/Profile/LoginDisplay';
// import OrderSummary from './components/Order/OrderSummary';
import OrderDisplay from './components/Order/OrderDisplay';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoadOrders, LoadBowlsOrder, SubmitOrder } from './API/API.js';

import { format } from 'morgan';

function generateOrders() {
  const bowls = generateBowls(10); // Generate 10 random bowls
  let order1 = new Order(1);
  order1.addBowl(bowls[0]);
  order1.addBowl(bowls[1]);
  let order2 = new Order(2);
  order2.addBowl(bowls[2]);
  order2.addBowl(bowls[3]);
  let order3 = new Order(3);
  order3.addBowl(bowls[4]);
  let order4 = new Order(4);
  order4.addBowl(bowls[5]);
  const orders = [order1, order2, order3, order4];
  return orders;
}

function App() {
  const [username, setUsername] = useState('testUser'); // User state
  const [showProfile, setShowProfile] = useState(false); // Profile modal visibility
  const [order, setOrder] = useState(new Order()); // Order in progress
  const [pastOrders, setPastOrders] = useState([]); // Mock past orders

  useEffect(() => {
    const orders = generateOrders();
    setPastOrders(orders);
  }, []);

  const handleDeleteProfile = () => {
    alert('Profile deleted!');
    setUsername(null);
    setShowProfile(false);
  };

  const handleAddToOrder = (bowl, num) => {
    const newOrder = new Order();
    newOrder.bowls = order.bowls;
    for (let i = 0; i < num; i++) {
      newOrder.addBowl(bowl);
    }
    setOrder(newOrder);
  };

  const handleSubmitOrder = (username, orderData) => {
    console.log("Username:", username);
    console.log("Order Data:", JSON.stringify(orderData, null, 2)); // Log the order data in a readable format
    setOrder(new Order()); // Clear the current order after submission
  };

  const getBowlsNums = () => {
    return order.bowls;
  };

  const setNumOfBowl = (bowl, num) => {
    const newOrder = new Order();
    if (num > 0) {
      // Update the quantity of the bowl
      order.changeNumBowls(bowl, num);
      newOrder.bowls = order.bowls;
    } else {
      // Remove the bowl from the order
      newOrder.bowls = order.bowls.filter(([existingBowl]) => existingBowl !== bowl);
    }
    setOrder(newOrder);
  };

  return (
    <Router>
      {/* Navigation Bar */}
      <NavBar
        username={username}
        onDeleteProfile={handleDeleteProfile}
      />

      {/* Main Content */}
      <div className="container mt-4">
        <Routes>
          {/* Main Page: Create Bowl and Current Order */}
          <Route
            path="/"
            element={
              <OrderDisplay
                getBowls={getBowlsNums}
                addToOrder={handleAddToOrder}
                setNumOfBowl={setNumOfBowl}
                submitOrder={handleSubmitOrder}
              />
            }
          />

          {/* Past Orders Page */}
          <Route
            path="/past-orders"
            element={<DisplayOrderHistory orders={pastOrders} />}
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={<LoginPage setUser={setUsername} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
