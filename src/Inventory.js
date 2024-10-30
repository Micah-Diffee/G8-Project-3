import React from 'react';
import './Inventory.css';

function Inventory() {
    return (
        <div className="inventory-container">
            <div className="section">
                <h2>Inventory</h2>
                <div className="table-container">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sample rows */}
                            <tr>
                                <td>Small Cup</td>
                                <td>10000</td>
                            </tr>
                            <tr>
                                <td>Medium Cup</td>
                                <td>10000</td>
                            </tr>
                            <tr>
                                <td>Large Cup</td>
                                <td>10000</td>
                            </tr>
                            <tr>
                                <td>Plastic Straws</td>
                                <td>9000</td>
                            </tr>
                            <tr>
                                <td>Napkins</td>
                                <td>25000</td>
                            </tr>
                            <tr>
                                <td>Plastic Forks</td>
                                <td>9000</td>
                            </tr>
                            {/* Add more rows */}
                        </tbody>
                    </table>
                </div>
                <button className="add-button">Add New Item to Inventory</button>
            </div>

            <div className="section">
                <h2>Reorder</h2>
                <div className="table-container">
                    <table className="reorder-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Restock Amount</th>
                                <th>Restock Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Plastic Forks</td>
                                <td>50</td>
                                <td>20.95</td>
                            </tr>
                            {/* Rows below header */}
                        </tbody>
                    </table>
                </div>
                <div className="reorder-buttons">
                    <button className="restock-button">Restock All</button>
                    <button className="restock-button">Custom Restock</button>
                </div>
            </div>
        </div>
    );
}

export default Inventory;
