import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import {Bowl, parseJSONToBowl} from './models/bowl.mjs';
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
import { use } from 'react';




function App() {
  const [username, setUsername] = useState('ali'); // User state
  const [showProfile, setShowProfile] = useState(false); // Profile modal visibility
  const [order, setOrder] = useState(new Order()); // Order in progress
  const [pastOrders, setPastOrders] = useState([]); // Mock past orders
  
 

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
    //console.log("Username:", username);
    //console.log("Order Data:", JSON.stringify(orderData, null, 2)); // Log the order data in a readable format
    SubmitOrder(username,orderData);
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
                order.addBowl(bowl)
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
            element={
            <DisplayOrderHistory 
              orders={pastOrders} 
              retriveOrders={retriveOrders}/>}
              
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
