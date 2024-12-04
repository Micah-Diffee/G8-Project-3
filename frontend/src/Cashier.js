import React, { useEffect, useState } from 'react';
import './Cashier.css';

function Cashier() {
    // This state is used to store the prices of all menu items from the backend
    const [prices, setPrices] = useState(null);
    
    // This state is used to store the prices of all menu items from the backend
    const [menuMatch, setMenuMatch] = useState(null); 

    // This state is used to store the dynamic pricing of all menu items from the backend
    const [dynamicPricingData, setDynamicPricingData] = useState(null);

    // This variable holds the price modifier
    var dynamicPriceModifier = 0;
    
    // This state is used to keep track of the selected items in one customer's order
    const [selectedItems, setSelectedItems] = useState([]); 

    // This state is used to keep track of the subtotal for a customer's order
    const [subtotal, setSubTotal] = useState(0);

    // This state is used to store the selected menu that pops up (ex: A La Carte, Combo, etc.)
    const [activeMenu, setActiveMenu] = useState(null); 

    // This state keeps track of the intermediary selected combo type 
    const [comboType, setComboType] = useState(null);

    // This state is used to store the intermediary selections as a combo is being ordered
    const [comboSteps, setComboSteps] = useState([]); 

    // This state is used to keep track of where in the entree/side selections step
    const [stepIndex, setStepIndex] = useState(0); 

    // This state is used to display the payment pop-up visibility
    const [paymentPopupVisible, setPaymentPopupVisible] = useState(false);

    // This state is used to store the payment method chosen by the customer
    const [customerPaymentMethod, setCustomerPaymentMethod] = useState(null);

    // This state to tracks the total premium charge for combos
    const [premiumCharge, setPremiumCharge] = useState(0);

    /**
     * Fetches prices, menuMatch, and dynamic pricing data from the backend.
     * 
     * @function useEffect
     */
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/Cashier')
            .then(response => response.json())
            .then(data => {
                console.log('Data.prices:', data['menu items']);   // testing lines
                setPrices(data['menu items']);
            })
            .catch(error => console.error('Error fetching data:', error));

        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/MenuMatch')
            .then(response => response.json())
            .then(data => {
                console.log('data.MenuMatch:', data['menuMatch']);   // testing lines
                setMenuMatch(data['menuMatch']);
            })
            .catch(error => console.error('Error fetching data:', error));

        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/DynamicPricingTotalSales')
            .then(response => response.json())
            .then(data => {
                console.log('Dynamic Pricing: ', [data.times, data.sales, data.rankings, data.priceMods]);
                setDynamicPricingData([data.times, data.sales, data.rankings, data.priceMods])
            })
            .catch(error => console.error('Error fetching Dynamic Pricing Total Sales:', error));
    }, []);

    /**
     * Sends a query in SQL to the database.
     * 
     * @function handleQuery
     * @param {String} query - The query in SQL that is sent to the database.
     */
    function handleQuery(query) {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/executeQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error executing query:', error));
    };

    // Figures out dynamic pricing modifier
    let hour = new Date().getHours();
    try {
        if (8 <= hour && hour <= 20) {
            dynamicPriceModifier = dynamicPricingData[3][hour-8];
        }
        else {
            dynamicPriceModifier = 0;
        }
    }
    catch (error) {
        console.log("Dyanmic Pricing error", error);
    }

    /**
     * Adds the item to the selectedItems state and updates the subtotal each time an item is added.
     * 
     * @function addItem
     * @param {String} itemName - The product name of the item added.
     */
    const addItem = (itemName) => {
        const item = prices.find(i => i.productname === itemName);
        if (item) {
            setSelectedItems((prevItems) => [...prevItems, item]);
            setSubTotal((prevSubtotal) => prevSubtotal + item.cost + dynamicPriceModifier);
            setActiveMenu(null);
        }
    };

    /**
     * Updates the states needed when the menu pop up is signaled.
     * 
     * @function handleMenuClick
     * @param {String} menuName - The name of the menu type.
     */
    const handleMenuClick = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
        if (menuName === "Combo") {
            setComboType(null); // reset combo type when Combo menu opens
            setComboSteps([]);
            setStepIndex(0);
        }
    };

    /**
     * Helps with picking the combo type of the item selected and sets corresponding states. Options: Bowl, Plate, or Bigger Plate.
     * 
     * @function handleComboSelection
     * @param {String} comboName - The combo type of the item that is being added to the menu.
     */
    const handleComboSelection = (comboName) => {
        const comboItem = prices.find(item => item.productname === comboName);
        if (comboItem) {
            setComboType(comboItem); // Set combo type as selected item
            setComboSteps([]); // Reset the combo steps
            setStepIndex(0); // Start at the first selection step
        }
    };

    /**
     * Handles the individual entree/side selections for adding a combo item to the order.
     * 
     * @function handleComboStepSelection
     * @param {String} itemName - The product name of the selected item in the intermediary step.
     */
    const handleComboStepSelection = (itemName) => {
        const item = prices.find(i => i.productname === itemName);
        if (item) {
            const newSteps = [...comboSteps, itemName];
            setComboSteps(newSteps);
    
            let additionalCharge = 0;
            if (item.premium === 1) {
                additionalCharge = 1.50;
                setPremiumCharge((prevCharge) => prevCharge + additionalCharge);
            }
    
            // Check if all combo steps are selected
            if (newSteps.length === comboType.entreenumber + comboType.sidenumber) {
                const comboDescription = `${comboType.productname} - ${newSteps.join(", ")}`;
                const comboTotalCost = comboType.cost + premiumCharge + additionalCharge; // Include all premiums
    
                const comboItem = {
                    productname: comboDescription,
                    cost: comboTotalCost,
                };
    
                setSelectedItems((prevItems) => [...prevItems, comboItem]);
                setSubTotal((prevSubtotal) => prevSubtotal + comboTotalCost + dynamicPriceModifier);

                // console.log("Premium Item Check:", item.productname, "PremiumNumber:", item.premium);
                // console.log("Updated Premium Charge:", premiumCharge);
                // console.log("Current Combo Steps:", comboSteps);
    
                // Reset states after completing the combo
                setComboType(null);
                setComboSteps([]);
                setStepIndex(0);
                setActiveMenu(null);
                setPremiumCharge(0);
            } else {
                setStepIndex((prevIndex) => prevIndex + 1);
            }
        }
    };

    /**
     * Updates the states needed to delete an item in the order.
     * 
     * @function removeItem
     * @param {number} index - The row number of the item that is being deleted.
     */
    const removeItem = (index) => {
        setSelectedItems((prevItems) => {
            const updatedItems = prevItems.filter((_, i) => i !== index);
            const removedItem = prevItems[index];
            
            // Subtract only the removed item's cost
            const newSubtotal = updatedItems.reduce((acc, item) => acc + item.cost + dynamicPriceModifier, 0);
    
            // Log details for debugging
            console.log("Removed Item:", removedItem.productname);
            console.log("Updated Subtotal:", newSubtotal);
    
            setSubTotal(newSubtotal);
            return updatedItems;
        });
    };
    
    /**
     * Functionality for the checkout that opens the pop up menu to do final checkout.
     * 
     * @function checkout
     */
    const checkout = () => {
        if (selectedItems.length === 0) {
            alert("No items selected for checkout.");
            return;
        }
    
        setPaymentPopupVisible(true); // Show the payment modal
    };

    /**
     * Updates the database with SQL queries for all of the information in the items selected list.
     * 
     * @function handleCompletePayment
     */
    const handleCompletePayment = () => {
        if (!customerPaymentMethod) return;
    
        // Getting the current day and time (Code from Bryce Borchers)
        const currentDateTime = new Date();
        const formattedTime = `${currentDateTime.getHours()}:${currentDateTime.getMinutes()}:${currentDateTime.getSeconds()}`;
        const month = currentDateTime.getMonth() + 1;
        const currentDate = `${currentDateTime.getFullYear()}-${month}-${currentDateTime.getDate()}`;
    
        const randomTransactionID = Math.floor(10000000 + Math.random() * 90000000);
    
        // Daily Transactions updated
        let listOfItems = selectedItems.map(item => item.productname).join(", ");
        console.log(listOfItems);

        let comboItemsList = []; // Array to store combo items
        listOfItems.split(',').forEach(item => {
            item = item.trim(); // Trim any extra spaces

            // Check if the item is a combo type and append it to the comboItems list
            if (item.includes("Bowl")) {
                comboItemsList.push("Bowl");
            } else if (item.includes("Plate")) {
                comboItemsList.push("Plate");
            } else if (item.includes("Bigger Plate")) {
                comboItemsList.push("Bigger Plate");
            }
        });
        let comboItemsString = comboItemsList.join(", ");

        let dailyTransactionQuery = "INSERT INTO dailytransactions VALUES ('" + currentDate + "', '" + formattedTime + "', " + randomTransactionID + ", '" + customerPaymentMethod + "', " + subtotal + ", '" + comboItemsString + "', '" + listOfItems + "', 11111111);";
        handleQuery(dailyTransactionQuery);

        // Inventory updated
        const itemList = [];
        listOfItems.split(",").forEach(item => {
            const trimmedItem = item.trim(); // to take out any extra spacing
            if (trimmedItem.includes(" - ")) {
                const [comboType, entree] = trimmedItem.split(" - ").map(part => part.trim());
                itemList.push(comboType);
                itemList.push(entree);
            }
            else {
                itemList.push(trimmedItem);
            }
        });
        
        itemList.forEach(itemName => {
            const matchedMenuItem = menuMatch?.find(menuItem => menuItem.menuitem === itemName);
            if (matchedMenuItem) {
                
                const inventoryItemsArray = matchedMenuItem.inventoryitems.split(',').map(item => item.trim());
        
                // Loop through each inventory item and execute the query
                inventoryItemsArray.forEach(inventoryItem => {
                    console.log("inventoryitem:", inventoryItem);
                    let updateQuery = `UPDATE inventory SET quantity = quantity - 1 WHERE productname = '${inventoryItem}';`;
                    handleQuery(updateQuery);
                });
            }
        });
    
        // Reset states
        setSelectedItems([]);
        setSubTotal(0);
        setCustomerPaymentMethod(null);
        setPaymentPopupVisible(false);
    };
    
    /**
     * Sets the customer payment method for the final checkout.
     * 
     * @function handlePaymentSelection
     * @param {String} method - The selected payment method for the customer
     */
    const handlePaymentSelection = (method) => {
        setCustomerPaymentMethod(method);
    };

    /**
     * Closes the pop up screen for payment and sets the needed states to their original states.
     * 
     * @function closePaymentPopup
     */
    const closePaymentPopup = () => {
        setPaymentPopupVisible(false);
        setCustomerPaymentMethod(null); // Reset the payment method
    };

    /**
     * Handles the logout to get back to the Login page
     * 
     * @function logout
     */
    const logout = () => {
        window.location.href = "Login";
    };

    // Functionality of the page
    return (
        <div className="Cashier">
            <div className="logout-wrapper">
            <button className="logout-button" onClick={logout}>Logout</button>
            </div>

            {paymentPopupVisible && (
                <div className="payment-popup">
                    <div className="payment-container">
                        <button className="close-payment-popup" onClick={closePaymentPopup}>
                            &times;
                        </button>
                        <h2>Subtotal: ${subtotal.toFixed(2)}</h2>
                        <div className='payment-buttons'>
                            <button className={`payment-button ${customerPaymentMethod === "Cash" ? "selected" : ""}`} onClick={() => handlePaymentSelection("Cash")}>
                                Cash
                            </button>

                            <button className={`payment-button ${customerPaymentMethod === "Credit" ? "selected" : ""}`} onClick={() => handlePaymentSelection("Credit")}>
                                Credit
                            </button>

                            <button className={`payment-button ${customerPaymentMethod === "Debit" ? "selected" : ""}`} onClick={() => handlePaymentSelection("Debit")}>
                                Debit
                            </button>

                            <button className={`payment-button ${customerPaymentMethod === "Dining Dollars" ? "selected" : ""}`} onClick={() => handlePaymentSelection("Dining Dollars")}>
                                Dining Dollars
                            </button>
                        </div>
                        <button
                            className={`confirm-payment-button ${customerPaymentMethod ? "enabled" : ""}`}
                            onClick={handleCompletePayment} // Call the correct function here
                            disabled={!customerPaymentMethod} // Disable if no payment method selected
                        >
                            Complete Payment
                        </button>
                    </div>
                </div>
            )}

            <div className="Cashier-container">
                {/* Left section: buttons for ordering */}
                <div className="selection-section">
                    <button className="menu-button" onClick={() => handleMenuClick("A La Carte")}>A La Carte</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Combo")}>Combo</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Drink")}>Drink</button>
                    <button className="menu-button" onClick={() => handleMenuClick("Appetizer/Dessert")}>Appetizer/Dessert</button>

                    {/* Rendering for menu item pop up */}
                    {activeMenu && ( 
                        <div className="active-menu">
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
                        <div className='combo-menu'>
                            <button onClick={() => handleComboSelection("Bowl")}>Bowl</button>
                            <button onClick={() => handleComboSelection("Plate")}>Plate</button>
                            <button onClick={() => handleComboSelection("Bigger Plate")}>Bigger Plate</button>
                        </div>
                    )}

                    {/* Combo Item Selection Steps */} 
                    {comboType && (
                        <div className='active-menu'>
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
                                    <span>${item.cost ? (item.cost + dynamicPriceModifier).toFixed(2) : '0.00'}</span>
                                    <button className='remove-item' onClick={() => removeItem(index)}>X</button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="subtotal">
                        <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
                    </div>
                    <button className="checkout-button" onClick={checkout}>Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default Cashier;