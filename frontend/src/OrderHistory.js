import React, { useEffect, useState } from 'react';
import './OrderHistory.css'; 

function OrderHistory() {
    // State to store the order history data
    const [orders, setOrders] = useState([]);

    // Fetch data from the backend
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/OrderHistory')
            .then(response => response.json())
            .then(data => {
                // console.log('Fetched orders:', data); // Log the fetched data
                setOrders(data.orders);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Extract 'YYYY-MM-DD' part
    };

    // Log the current state of orders
    // console.log('Current orders state:', orders);

    return (
        <div className="order-history-section">
            <h2 className="section-title">Order History</h2>
            <hr />
            <div className="order-history-content">
                <div className="history-table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>Combo Item</th>
                                <th>Order Details</th>
                                <th>Order Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr><td colSpan="5">No orders available</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.transaction_id}>
                                        <td>{formatDate(order.date)}</td>
                                        <td>{order.transaction_id}</td>
                                        <td>{order.combo_item}</td>
                                        <td>{order.lists_of_items}</td>
                                        <td>{order.order_cost}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Display orders data as JSON for debugging */}
                {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
            </div>
        </div>
    );
}

export default OrderHistory;