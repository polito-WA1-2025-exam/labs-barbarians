import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Bowl} from './models/bowl.mjs';
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
import {  SubmitOrder } from './API/API.js';

import { format } from 'morgan';



function App() {
  const [username, setUsername] = useState('test123'); // User state
  const [showProfile, setShowProfile] = useState(false); // Profile modal visibility
  const [order, setOrder] = useState(new Order()); // Order in progress
  const [pastOrders, setPastOrders] = useState([]); // Mock past orders
  const [orderQuantities, setOrderQuantities] = useState({ R: 0, M: 0, L: 0 }); 
  

 

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

    // Update order quantities
    setOrderQuantities(prev => ({
        ...prev,
        [bowl.size]: (prev[bowl.size] || 0) + num, // Increment the quantity for the bowl size
    }));

    setOrder(newOrder);
  };

  const handleSubmitOrder = (username, orderData) => {
    //console.log("Username:", username);
    //console.log("Order Data:", JSON.stringify(orderData, null, 2)); // Log the order data in a readable format
    SubmitOrder(username,orderData);
    setOrder(new Order()); // Clear the current order after submission
  };

  const getBowlsNums = () => {
    return order.bowls;
  };

  const setNumOfBowl = (bowl, num) => {
    // Only update the order state, not orderQuantities
    const newOrder = new Order();
    if (num > 0) {
        order.changeNumBowls(bowl, num);
        newOrder.bowls = order.bowls;
    } else {
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
                orderQuantities={orderQuantities} 
                setOrderQuantities={setOrderQuantities} 
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
