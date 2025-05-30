async function LoadOrders(user) {
    try {
        const response = await fetch(`http://localhost:3000/user/${user}/retrieveOrders`, {
            credentials: 'include' // <-- ADD THIS LINE
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orders = await response.json();
        console.log('Orders:', orders);
        return orders;
    } catch (error) {
        console.error('Error in LoadOrders:', error);
        throw error;
    }
}

async function LoadBowlsOrder(username, orderId) {
    try {
        const response = await fetch(`http://localhost:3000/user/${username}/${orderId}/retrieveBowls`, {
            credentials: 'include' // <-- ADD THIS LINE
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Error in LoadOrders:', error);
        throw error;
    }
}

const SubmitOrder = async (username, orderData) => {
    console.log('Submitting order:', orderData);
    try {
        const response = await fetch('http://localhost:3000/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // <-- ADD THIS LINE
            body: JSON.stringify({ username, ...orderData }),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Order submitted successfully! Order ID: ' + result.orderId);
        } else {
            alert('Failed to submit order. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('An error occurred while submitting the order.');
    }
};

export async function fetchBowlAvailability() {
  const response = await fetch('http://localhost:3000/bowlsAvailability', {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

async function logIn(credentials) {
  console.log('Sending login to /api/login:', credentials);
  const response = await fetch(`http://localhost:3000/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials)
  });
  console.log('Login response:', response);
  if (response.ok) {
    const user = await response.json();
    console.log('Received user:', user);
    return user;
  } else {
    const err = await response.text();
    console.log('Login error:', err);
    throw err;
  }
}

async function logout() {
    const response = await fetch(`http://localhost:3000/api/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (response.ok)
        return null;
}

export async function getSession() {
  const response = await fetch('http://localhost:3000/api/session', {
    credentials: 'include'
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Not authenticated');
  }
}
export{LoadOrders, LoadBowlsOrder, SubmitOrder, logIn, logout};