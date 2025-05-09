import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Bowl, generateBowls} from './models/bowl.mjs';
import { Order } from './models/order.mjs';
import NavBar from './components/NavBar';
import ProfileModal from './components/ProfileModal';
import CreateBowl from './components/create_bowl';
import DisplayOrderHistory from './components/OrderHistory/OrderHistory';
import LoginPage from './components/login';
import OrderSummary from './components/OrderSummary';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { format } from 'morgan';

function generateOrders(){
  const bowls = generateBowls(10);
  let order1 = new Order(1);
  order1.addBowl(bowls[2]);
  order1.addBowl(bowls[0]);
  order1.addBowl(bowls[1]);
  order1.addBowl(bowls[2]);
  order1.addBowl(bowls[3]);
  let order2 = new Order(2);
  order2.addBowl(bowls[4]);
  order2.addBowl(bowls[5]);
  order2.addBowl(bowls[6]);
  let order3 = new Order(3);
  order3.addBowl(bowls[7]);
  order3.addBowl(bowls[8]);
  let order4 = new Order(4);
  order4.addBowl(bowls[9]);
  const orders = [order1, order2, order3, order4];
  return orders;
}


function App() {
  const [username, setUsername] = useState('testUser'); // User state
  const [showProfile, setShowProfile] = useState(false); // Profile modal visibility
  const [currentOrder, setCurrentOrder] = useState([]); // Current order in progress
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

  const handleAddToOrder = (bowl) => {
    setCurrentOrder((prevOrder) => [...prevOrder, bowl]);
  };

  return (
    <Router>
      {/* Navigation Bar */}
      <NavBar username={username} setUser={setUsername} setShowProfile={setShowProfile} />

      {/* Profile Modal */}
      <ProfileModal
        show={showProfile}
        onHide={() => setShowProfile(false)}
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
              <>
                <CreateBowl addToOrder={handleAddToOrder} />
                <OrderSummary bowls={currentOrder} />
              </>
            }
          />

          {/* Past Orders Page */}
          <Route
            path="/past-orders"
            element={
              <DisplayOrderHistory orders={pastOrders} />
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={
              <LoginPage setUser={setUsername} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
