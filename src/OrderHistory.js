import React from 'react';
import './OrderHistory.css';

function OrderHistory() {
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
                                <th>Combo Type</th>
                                <th>Order Details</th>
                                <th>Order Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2024-02-21</td>
                                <td>15287496</td>
                                <td>Bowl</td>
                                <td>Orange Chicken, Fried Rice</td>
                                <td>9.64</td>
                            </tr>
                            <tr>
                                <td>2024-08-15</td>
                                <td>78926574</td>
                                <td>A La Carte</td>
                                <td>Sweet Fire Chicken Breast</td>
                                <td>5.28</td>
                            </tr>
                            <tr>
                                <td>2024-09-05</td>
                                <td>39871568</td>
                                <td>A La Carte</td>
                                <td>Beijing Beef</td>
                                <td>5.28</td>
                            </tr>
                            {/* Add other rows here */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;
