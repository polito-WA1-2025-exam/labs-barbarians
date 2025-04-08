import React, { useState } from 'react';
import NavBar from './components/NavBar';
import ProfileModal from './components/ProfileModal';
import DisplayOrderHistory from './components/OrderHistory/OrderHistory';
import {Bowl, generateBowls} from './models/bowl.mjs';
import { Order } from './models/order.mjs';
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
  const [username, setUsername] = useState('testUser'); // Replace with null for no user
  const [showProfile, setShowProfile] = useState(false); // State to control profile popup visibility

  const handleDeleteProfile = () => {
    alert('Profile deleted!');
    setUsername(null); // Clear the username state
    setShowProfile(false); // Close the profile popup
  };
  const orders = generateOrders();
// Test props
  const bowls = [
    {
      size: 'Large',
      base: 'Rice',
      proteines: ['Chicken'],
      ingredients: ['Avocado', 'Mango'],
      price: () => 12.99,
    },
    {
      size: 'Medium',
      base: 'Salad',
      proteines: ['Salmon'],
      ingredients: ['Tomatoes', 'Corn'],
      price: () => 10.99,
    },
  ];

  return (
    <>
      <NavBar username={username} setUser={setUsername} setShowProfile={setShowProfile} />
      <ProfileModal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        username={username}
        onDeleteProfile={handleDeleteProfile}
      />
      <OrderSummary bowls={bowls}/>
      <DisplayOrderHistory orders={orders} />
    </>
  );
}

export default App;
