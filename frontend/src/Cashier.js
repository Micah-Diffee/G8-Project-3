import React, { useEffect, useState } from 'react';
import './Cashier.css';

function Cashier() {
    // State used to manage the selected items & subtotal
    const [selectedItems, setSelectedItems] = useState([]); // items selected during order
    const [subtotal, setSubTotal] = useState(0); // tracking for cost
    const [activeMenu, setActiveMenu] = useState(null); // keeps track of which menu is popped up -> A La Carte, Combo, etc.
    const [prices, setPrices] = useState(null); // storage for menu items from backend
    
    const [comboType, setComboType] = useState(null); // selected combo type
    const [comboSteps, setComboSteps] = useState([]); // stores the current selections in the combo
    const [stepIndex, setStepIndex] = useState(0); // keeps track of entree/side selection step

    // Fetch data from the backend
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/Cashier')
            .then(response => response.json())
            .then(data => {
                // console.log('Data.prices:', data['menu items']);   // testing lines
                setPrices(data['menu items']);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Method that adds item to selectedItems and updates subtotal each time an item is clicked
    const addItem = (itemName) => {
        const item = prices.find(i => i.productname === itemName);
        if (item) {
            setSelectedItems((prevItems) => [...prevItems, item]);
            setSubTotal((prevSubtotal) => prevSubtotal + item.cost);
            setActiveMenu(null);
        }
    };

    // Method that handles which menu to pop up
    const handleMenuClick = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
        if (menuName === "Combo") {
            setComboType(null); // reset combo type when Combo menu opens
            setComboSteps([]);
            setStepIndex(0);
        }
    };

    // Handles combo type selection (Bowl, Plate, Bigger Plate)
    const handleComboSelection = (comboName) => {
        const comboItem = prices.find(item => item.productname === comboName);
        if (comboItem) {
            setComboType(comboItem); // Set combo type as selected item
            setComboSteps([]); // Reset the combo steps
            setStepIndex(0); // Start at the first selection step
        }
    };

    // Handles individual entree/side selection for a combo
    const handleComboStepSelection = (itemName) => {
        const item = prices.find(i => i.productname === itemName);
        if (item) {
            setComboSteps(prevSteps => [...prevSteps, itemName]);
            
            // Check if the combo steps are complete
            if (comboSteps.length + 1 === comboType.entreenumber + comboType.sidenumber) {
                const comboDescription = `${comboType.productname} - ${[...comboSteps, itemName].join(", ")}`; // the ` let you format the line however you want
                const comboItem = { productname: comboDescription, cost: comboType.cost };
                setSelectedItems(prevItems => [...prevItems, comboItem]);
                setSubTotal(prevSubtotal => prevSubtotal + comboType.cost);
                
                // Reset combo state after completion
                setComboType(null);
                setComboSteps([]);
                setStepIndex(0);
                setActiveMenu(null);
            } else {
                setStepIndex(prevIndex => prevIndex + 1);
            }
        }
    };

    const removeItem = (index) => {
        setSelectedItems((prevItems) => {
            const updatedItems = prevItems.filter((_, i) => i !== index);

            // Calculate the new subtotal from the updated items list
            const newSubtotal = updatedItems.reduce((acc, item) => acc + item.cost, 0);
            setSubTotal(newSubtotal);

            return updatedItems;
        });
    };

    // Checkout functionality
    // update inventory and dailytransactions (and customer?) // TODO LATER
    const checkout = () => {
        setSelectedItems([]);
        setSubTotal(0);
    };

    // Logout functionality
    const logout = () => {
        window.location.href = "Login";
    };

    // Functionality of the page
    return (
        <div className="Cashier">
            <div className="logout-wrapper">
            <button className="logout-button" onClick={logout}>Logout</button>
            </div>

            <div className="Cashier-container">
                {/* Left section: buttons for ordering */}
                <div className="selection-section">
                    <button className="menu-button" onClick={() => handleMenuClick("A La Carte")}>A La Carte</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Combo")}>Combo</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Drink")}>Drink</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Appetizer/Dessert")}>Appetizer/Dessert</button>

                    {/* Rendering for menu item pop up */}
                    {activeMenu && ( 
                        <div className="pop-up-menu">
                            <h4>{activeMenu} Items:</h4> {/* Title for the pop-up section */}
                            <ul>
                                {prices && prices
                                    .filter(item => {
                                        switch (activeMenu) {
                                            case "A La Carte":
                                                return (item.entreenumber === 1 && item.sidenumber === 0) || (item.entreenumber === 0 && item.sidenumber === 1);
                                            case "Drink":
                                                return item.drinknumber === 1;
                                            case "Appetizer/Dessert":
                                                return item.appetizernumber === 1;
                                            default:
                                                return false;
                                        }
                                    })
                                    .map((item, index) => (
                                        <li key={index} onClick={() => addItem(item.productname)}>
                                            {item.productname}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    {/* Combo Selection Button */} 
                    {activeMenu === "Combo" && !comboType && (
                        <div className='pop-up-menu'>
                            <button onClick={() => handleComboSelection("Bowl")}>Bowl</button>
                            <button onClick={() => handleComboSelection("Plate")}>Plate</button>
                            <button onClick={() => handleComboSelection("Bigger Plate")}>Bigger Plate</button>
                        </div>
                    )}

                    {/* Combo Item Selection Steps */} 
                    {comboType && (
                        <div className='pop-up-menu'>
                            <h4> {stepIndex < comboType.entreenumber ? `Choose Entree${comboType.entreenumber > 1 ? ` ${stepIndex + 1}` : ""}` : `Choose Side`} </h4>
                            <ul>
                                {prices && prices
                                    .filter(item => (
                                        (stepIndex < comboType.entreenumber && item.entreenumber === 1 && item.sidenumber === 0) || 
                                        (stepIndex >= comboType.entreenumber && item.sidenumber === 1 && item.entreenumber === 0)
                                    ))
                                    .map((item, index) => (
                                        <li key={index} onClick={() => handleComboStepSelection(item.productname)}>
                                            {item.productname}
                                        </li>
                                    ))}
                            </ul>
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
                                    <span>{item.productname}</span>
                                    <span>${item.cost ? item.cost.toFixed(2) : '0.00'}</span>
                                    <button className='remove-item' onClick={() => removeItem(index)}>X</button>
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