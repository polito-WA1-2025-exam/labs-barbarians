async function LoadOrders(user) {
    try {
        const response = await fetch(`http://localhost:3000/user/${user}/retrieveOrders`);

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

async function LoadBowlsOrder(username,orderId){

    try{
        const response = await fetch(`http://localhost:3000/user/${username}/${orderId}/retrieveBowls`)
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
    try {
        const response = await fetch('http://localhost:3000/bowlsAvailability');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching bowl availability:', error);
        throw error;
    }
}

export{LoadOrders, LoadBowlsOrder, SubmitOrder}