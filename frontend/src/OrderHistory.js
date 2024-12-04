import React, { useEffect, useState } from 'react';
import './OrderHistory.css'; 

/**
 * Order History page that allows users to view past orders.
 */
function OrderHistory() {
    // State to store the order history data
    const [orders, setOrders] = useState([]);

    /**
     * Fetches the order history from the server.
     */
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/OrderHistory')
            .then(response => response.json())
            .then(data => {
                setOrders(data.orders);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    /**
     * Formats the date to look like ''YYYY-MM-DD'
     * 
     * @function formatDate
     * @param dateString The string that represents a date.
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; 
    };

    /**
     * Formats numbers to two decimal places.
     * 
     * @function formatDecimal
     * @param value A float or double.
     */
    const formatDecimal = (value) => {
        return value ? parseFloat(value).toFixed(2) : '0.00';
    };

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
                                        <td>${formatDecimal(order.order_cost)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;