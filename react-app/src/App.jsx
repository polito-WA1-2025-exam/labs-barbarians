import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Bowl, parseJSONToBowl } from './models/bowl.mjs';
import { Order } from './models/order.mjs';
import NavBar from './components/NavBar';
import ProfileModal from './components/Profile/ProfileModal';
import BowlDisplay from './components/Order/BowlDisplay';
import DisplayOrderHistory from './components/OrderHistory/OrderHistory';
import LoginPage from './components/Profile/LoginDisplay';
import OrderDisplay from './components/Order/OrderDisplay';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SubmitOrder, LoadOrders, LoadBowlsOrder, logIn, logout, getSession } from './API/API.js';

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [order, setOrder] = useState(new Order());
  const [pastOrders, setPastOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [orderQuantities, setOrderQuantities] = useState({ R: 0, M: 0, L: 0 });

  const navigate = useNavigate();

  const handleAddToOrder = (bowl, num) => {
    const newOrder = new Order();
    newOrder.bowls = order.bowls;

    for (let i = 0; i < num; i++) {
      newOrder.addBowl(bowl);
    }

    setOrderQuantities(prev => ({
      ...prev,
      [bowl.size]: (prev[bowl.size] || 0) + num,
    }));

    setOrder(newOrder);
  };

  const handleSubmitOrder = (username, orderData) => {
    SubmitOrder(username, orderData);
    setOrder(new Order());
  };

  const getBowlsNums = () => {
    return order.bowls;
  };

  const setNumOfBowl = (bowl, num) => {
    const newOrder = new Order();
    if (num > 0) {
      order.changeNumBowls(bowl, num);
      newOrder.bowls = order.bowls;
    } else {
      newOrder.bowls = order.bowls.filter(([existingBowl]) => existingBowl !== bowl);
    }
    setOrder(newOrder);
  };

  const retriveOrders = (username) => {
    const pastOrders = [];
    LoadOrders(username)
      .then((ordersJSONs => {
        ordersJSONs.forEach(orderJSON => {
          const order = new Order(orderJSON.id);
          order.date = orderJSON.date;
          order.price = orderJSON.totPrice;
          order.nrBowls = orderJSON.nrBowls;
          LoadBowlsOrder(username, order.id)
            .then(loadedBowlsJSON => {
              loadedBowlsJSON.forEach(bowlJSON => {
                const bowl = parseJSONToBowl(bowlJSON);
                order.addBowl(bowl, bowlJSON.nrBowls);
              });
            }).catch(error => {
              console.error("Error loading bowls for order:", error);
            });
          pastOrders.push(order);
        });
        setPastOrders(pastOrders);
      }))
  };

  useEffect(() => {
  getSession()
    .then(data => {
      setUsername(data.username);
      setLoggedIn(true);
    })
    .catch(() => {
      setUsername('');
      setLoggedIn(false);
    });
}, []);

  const handleLogin = async (credentials) => {
    console.log('Login credentials:', credentials);
    try {
      const loginUser = await logIn(credentials);
      console.log('Backend returned:', loginUser);
      setLoggedIn(true);
      setUsername(loginUser.username); // Use .username as returned by backend
      setMessage({ msg: `Welcome, ${loginUser.username}!`, type: 'success' });
      navigate('/'); // Redirect to main page
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setUsername('');
    setMessage('');
  };

  return (
    <>
      {/* Navigation Bar */}
      <NavBar
        username={username}
        handleLogout={handleLogout}
        setUser={setUsername}
        setShowProfile={setShowProfile}
        loggedIn={loggedIn}
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
                username={username}
                orderQuantities={orderQuantities}
                setOrderQuantities={setOrderQuantities}
                loggedIn={loggedIn} // Pass loggedIn to OrderDisplay
              />
            }
          />

          {/* Past Orders Page */}
          <Route
            path="/past-orders"
            element={
              <DisplayOrderHistory
                username={username}
                retriveOrders={retriveOrders}
                orders={pastOrders}
                setOrders={setPastOrders}
              />
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={<LoginPage handleLogin={handleLogin} setUser={setUsername} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
