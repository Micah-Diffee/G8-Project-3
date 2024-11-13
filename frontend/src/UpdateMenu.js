import React from 'react';
import './UpdateMenu.css';

function UpdateMenu() {
    return (
        <div className="update-menu-section">
            <h2 className="section-title">Update Menu</h2>
            <hr />
            <div className="update-menu-content">
                <div className="menu-table-container">
                    <table className="menu-table">
                        <thead>
                            <tr>
                                <th>Menu Item</th>
                                <th> Cost </th>
                                <th>isPremium</th>
                                <th>isEntree</th>
                                <th>isSide</th>
                                <th>isDrink</th>
                                <th>isAppetizer</th>
                                <th>Inventory Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Orange Chicken</td>
                                <td>5.2</td>
                                <td>0</td>
                                <td>1</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>Sugar Chicken</td>
                            </tr>
                            <tr>
                                <td>Beijing Beef</td>
                                <td>5.2</td>
                                <td>0</td>
                                <td>1</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>Chicken, Beef Sauce</td>
                            </tr>
                            <tr>
                                <td>Sweet Fire Chicken Breast</td>
                                <td>5.2</td>
                                <td>0</td>
                                <td>1</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>Chicken Breast, Sweet Fire Sauce</td>
                            </tr>
                            {/* Add other rows here */}
                        </tbody>
                    </table>
                </div>
                <div className="buttons">
                    <button className="action-button">Add Item</button>
                    <button className="action-button">Delete Item</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateMenu;
