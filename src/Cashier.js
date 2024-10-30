import React, { useState } from 'react';
import './Cashier.css';

function Cashier() {
    // State used to manage the selected items & subtotal
    const [selectedItems, setSelectedItems] = useState([]);
    const [subtotal, setSubTotal] = useState(0);
    const [activeMenu, setActiveMenu] = useState(null);

    // Prices for each menu type
    // ***pulled from database
    const prices = {
        "Sugar Chicken": 5.99,
        "Sour Chicken": 4.99,
        "Chicken Bowl": 7.99,
        "Beef Bowl": 8.99,
        "Veggie Bowl": 6.99,
        "Chicken Plate": 9.99,
        "Family Meal": 12.99, 
        "Party Tray": 11.99
    };

    // Shows menu items that will pop up when each menu type pushed
    // ***pulled from database
    const additionalMenus = {
        "A La Carte": ["Sugar Chicken", "Sour Chicken"],
        "Bowl": ["Chicken Bowl", "Beef Bowl", "Veggie Bowl"],
        "Plate": ["Chicken Plate"],
        "Bigger Plate": ["Family Meal", "Party Tray"]
    };

    // Method that adds item to selected items and updates subtotal
    const addItem = (itemName) => {
        setSelectedItems((prevItems) => [...prevItems, itemName]);
        setSubTotal((prevSubtotal) => prevSubtotal + prices[itemName]);
    };

    // Method that handles which menu to pop up
    const handleMenuClick = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    // Checkout functionality
    // ***update inventory and dailytransactions (and customer?)
    const checkout = () => {
        setSelectedItems([]);
        setSubTotal(0);
    };

    // Logout functionality
    // *** connect to login page after being logged out
    const logout = () => {
        window.location.href = "Login";
    };

    return (
        <div className="Cashier">
            <div className="logout-wrapper">
            <button className="logout-button" onClick={logout}>Logout</button>
            </div>
            <div className="Cashier-container">
                {/* Left section: buttons for ordering */}
                <div className="selection-section">
                    {/* Likely needs to be done in a loop when connected to database? */}
                    <button className="menu-button" onClick={() => handleMenuClick("A La Carte")}>A La Carte</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Bowl")}>Bowl</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Plate")}>Plate</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Bigger Plate")}>Bigger Plate</button>

                    {/* Rendering for menu item pop up */}
                    {activeMenu && ( 
                        <div className="pop-up-menu">
                            <h4>{activeMenu} Items:</h4>
                            <u1>
                                {additionalMenus[activeMenu].map((item, index) => (
                                    <li key={index} onClick={() => addItem(item)}>{item}</li>
                                ))}
                            </u1>
                        </div>
                    )}
                </div>

                {/* Right section: items selected & subtotal */}
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="order-items">
                        {selectedItems.length === 0 ? (
                            <p>No items selected</p>
                        ) : (
                            selectedItems.map((item, index) => (
                                <div key={index} className="order-item">
                                    <span>{item}</span>
                                    <span>${prices[item].toFixed(2)}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="subtotal">
                        <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
                    </div>
                    <button className="checkout-button" onClick={() => checkout()}>Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default Cashier;