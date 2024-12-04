import React, { useEffect, useState } from 'react';
import './UpdateMenu.css';

/**
 * The Update Menu page on the manager view that allows for changing the menu and reflecting it in the database.
 * 
 * @returns {JSX.Element} The Update Menu page.
 */
function UpdateMenu() {
    //BACKEND
    const [prices, setPrices] = useState(null); // Prices storage
    const [menuMatch, setMenuMatch] = useState(null); // MenuMatch storage
    const [inventory, setInventory] = useState(null); // Inventory storage
    
    // Popup states
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Whether add item pop up window is open
    const [newMenuItem, setNewMenuItem] = useState(''); // Stores a new menu item, if creating one
    const [cost, setCost] = useState(''); // Stores price of new menu item
    const [isPremium, setIsPremium] = useState(false); // Stores premium value of new menu item
    const [menuType, setMenuType] = useState(''); // Stores menu type of new menu item
    const [inventoryItems, setInventoryItems] = useState([]); // Stores all inventory items of a new menu item
    const [newInventoryItems, setNewInventoryItems] = useState([]); // Tracks which inventory items are new to the inventory table
    const [isAddingInventoryRow, setIsAddingInventoryRow] = useState(false); // Checks whether or not the user is adding an inventory item in pop up
    const [isAddingExistingItem, setIsAddingExistingItem] = useState(false); // Checks whether the user is adding an existing item or not
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null); // Stores the selected inventory item if the user is creating a new menu item in pop up
    const [currentInventoryRow, setCurrentInventoryRow] = useState(null); // Keeps track of what the current inventory item the user is using when creating a new menu item
    const [errorMessage, setErrorMessage] = useState(''); // Stores error message, if needed
    const [refreshData, setRefreshData] = useState(false); // Determines whether database needs to be refreshed

    // Editing states
    const [editingRow, setEditingRow] = useState(null); // Tracks which row is being edited
    const [editedData, setEditedData] = useState({}); // Tracks edited data for a row
    const [rowError, setRowError] = useState(''); // Tracks errors for the row being edited

    // Editing & Deletion state
    const [selectedRow, setSelectedRow] = useState(null); // Tracks which row is selected to be edited/deleted

    /**
     * Fetches prices, menuMatch and inventory data from the backend.
     * 
     * @function useEffect
     */
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/Prices')
            .then(response => response.json())
            .then(data => {
                // console.log('Data.prices:', data['prices']);
                setPrices(data['prices']);
            })
            .catch(error => console.error('Error fetching data:', error));

        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/MenuMatch')
            .then(response => response.json())
            .then(data => {
                // console.log('data.MenuMatch:', data['menuMatch']); 
                setMenuMatch(data['menuMatch']);
            })
            .catch(error => console.error('Error fetching data:', error));

        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/InventoryData')
            .then(response => response.json())
            .then(data => {
                console.log('data.InventoryData:', data['inventory']); 
                setInventory(data['inventory']);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [refreshData]); // Triggers method when refreshData changes

    /**
     * Sends a query in SQL to the database.
     * 
     * @function handleQuery
     * @param {String} query - The query in SQL that is sent to the database.
     */
    async function handleQuery(query) {
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

    /**
     * Refreshes the data from prices, menuMatch and inventory when needed.
     * 
     * @function fetchData
     */
    const fetchData = async () => {
        try {
            const priceResponse = await fetch('https://panda-express-pos-backend-nc89.onrender.com/api/Prices');
            const priceData = await priceResponse.json();
            setPrices(priceData['prices']);
            
            const menuMatchResponse = await fetch('https://panda-express-pos-backend-nc89.onrender.com/api/MenuMatch');
            const menuMatchData = await menuMatchResponse.json();
            setMenuMatch(menuMatchData['menuMatch']);

            const inventoryResponse = await fetch('https://panda-express-pos-backend-nc89.onrender.com/api/InventoryData');
            const inventoryData = await inventoryResponse.json();
            setInventory(inventoryData['inventory']);
            
            setRefreshData(prev => !prev);  // Toggles state if needed for re-render
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    /**
     * Loads the information from prices and menuMatch states into the table.
     * 
     * @function getMenuData
     * @returns {Array} Information for the table on the page.
     */
    const getMenuData = ()  => {
        if (!prices || !menuMatch) return[];

        return prices.map(priceItem => {
            const matchingMenuItem = menuMatch.find(
                menu => menu.menuitem === priceItem.productname
            );

            return {
                menuItem: priceItem.productname,
                cost: priceItem.cost.toFixed(2),
                isPremium: priceItem.premium,
                isEntree: priceItem.entreenumber,
                isSide: priceItem.sidenumber,
                isDrink: priceItem.drinknumber,
                isAppetizer: priceItem.appetizernumber,
                inventoryItems: matchingMenuItem ? matchingMenuItem.inventoryitems : '',
            };
        })
        .filter(item => !(item.isEntree > 0 && item.isSide > 0)) // filters out combo items (Bowl, Plate, Bigger Plate)
        .sort((a, b) => {
            // Sorts table by menu groupings, then alphabetically
            const order = ['isEntree', 'isSide', 'isDrink', 'isAppetizer'];

            // Sort by type first, using the order array
            for (let key of order) {
                if (b[key] - a[key] !== 0) {
                    return b[key] - a[key];
                }
            }

            // If types are equal, sort alphabetically by menuItem
            return a.menuItem.localeCompare(b.menuItem);
        });
    };

    // Render the table dynamically
    const menuData = getMenuData();

    /**
     * Sets the variable determining whether the pop up is open or not to true.
     * 
     * @function openPopup
     */
    const openPopup = () => setIsPopupOpen(true);

    /**
     * Sets all states used in the pop up menu to a null state.
     * 
     * @function closePopup
     */
    const closePopup = () => {
        setIsPopupOpen(false);
        setNewMenuItem('');
        setCost('');
        setIsPremium(false);
        setMenuType('');
        setInventoryItems([]);
        setNewInventoryItems([]);
        setIsAddingInventoryRow(false);
        setIsAddingExistingItem(false);
        setSelectedInventoryItem(null);
        setCurrentInventoryRow(null);
        setErrorMessage('');
    };

    /**
     * Ensures all fields are filled out when adding a new menu item and executes SQL queries into the database.
     * 
     * @function handleAddItem
     */
    const handleAddItem = async () => {
        if (!newMenuItem || !cost || !menuType) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        if (isNaN(parseFloat(cost)) || parseFloat(cost) <= 0) {
            setErrorMessage('Please enter a valid positive decimal number for cost.');
            return;
        }

        if (newInventoryItems.length === 0 && !inventoryItems) {
            setErrorMessage('Please add or select at least one inventory item.');
            return;
        }

        const isEntree = menuType === 'Entree' ? 1 : 0;
        const isSide = menuType === 'Side' ? 1 : 0;
        const isDrink = menuType === 'Drink' ? 1 : 0;
        const isAppetizer = menuType === 'Appetizer' ? 1 : 0;

        const addQuery = `
            INSERT INTO prices (productname, cost, premium, entreenumber, sidenumber, drinknumber, appetizernumber)
            VALUES ('${newMenuItem}', ${cost}, ${isPremium ? 1 : 0}, ${isEntree}, ${isSide}, ${isDrink}, ${isAppetizer});
        `;

        const invevntoryItemsList = inventoryItems.map(item => item.productname).join(', ');
        const menuMatchQuery = `
            INSERT INTO menumatch (menuitem, inventoryitems)
            VALUES ('${newMenuItem}', '${invevntoryItemsList}');
        `;

        const inventoryQueries = newInventoryItems.map(item => `
            INSERT INTO inventory (productname, cost, quantity, restockamount, stockminimum)
            VALUES ('${item.productname}', ${item.cost}, ${item.quantity}, ${item.restockamount}, ${item.stockminimum});
        `);
        console.log(newInventoryItems);
        
        try {
            // Execute the queries
            await Promise.all([handleQuery(addQuery), handleQuery(menuMatchQuery), ...inventoryQueries.map(query => handleQuery(query))]);
            
            // After adding the item, re-fetch the menu data
            fetchData();  // This function should refetch both prices and menuMatch data
            closePopup(); // Close the popup after the data is refreshed
        } catch (error) {
            console.error('Error adding item:', error);
            setErrorMessage('Failed to add the item. Please try again.');
        }
    };

    /**
     * Determines if the user is adding an existing inventory item to the new menu item.
     * 
     * @function handleAddExistingItem
     */
    const handleAddExistingItem = () => {
        if (isAddingInventoryRow) return;
        setIsAddingInventoryRow(true);
        setIsAddingExistingItem(true);
        setSelectedInventoryItem(null); 
    };

    /**
     * Sends the selected inventory item into the selected inventory item state.
     * 
     * @param {*} item - The selected inventory item from the list of inventory items. 
     * @function handleExistingItemSelect
     */
    const handleExistingItemSelect = (item) => {
        setSelectedInventoryItem(item);
    };
    
    /**
     * If the user is creating a new inventory item, this method opens the corresponding states needed to take in information about the new item.
     * 
     * @function handleCreateNewItem
     */
    const handleCreateNewItem = () => {
        if (isAddingInventoryRow) return;
        setIsAddingInventoryRow(true);
        setCurrentInventoryRow({ productname: "", cost: "", quantity: "", restockamount: "", stockminimum: "" });
    };

    /**
     * When adding an inventory item, this method handles either the adding a current or new inventory item and sets the used variables back to their original states.
     * 
     * @function finalizeInventoryRow
     */
    const finalizeInventoryRow = () => {
        if (!currentInventoryRow && !selectedInventoryItem) return;

        if (isAddingInventoryRow && currentInventoryRow) {
            const { productname, cost, quantity, restockamount, stockminimum } = currentInventoryRow;

            // Validate inputs
            if (!productname.trim() || isNaN(cost) || cost <= 0 || isNaN(quantity) || quantity < 0 || isNaN(restockamount) || restockamount < 1 || isNaN(stockminimum) || stockminimum < 0) {
                alert("Please complete all fields with valid values.");
                return;
            }
    
            // Update the inventory state
            setNewInventoryItems([...newInventoryItems, currentInventoryRow]);
            setInventoryItems([...inventoryItems, currentInventoryRow]);
            setIsAddingInventoryRow(false); // Allow adding new items again
            setCurrentInventoryRow(null); // Reset the current row
        }
        else if (isAddingExistingItem && selectedInventoryItem) {
            // Add the selected inventory item to the state
            setInventoryItems([...inventoryItems, selectedInventoryItem]);
            console.log(inventoryItems);

            // Reset state for adding an existing item
            setIsAddingExistingItem(false); // Disable Add Existing Item row
            setSelectedInventoryItem(null); // Reset selected item
            setIsAddingInventoryRow(false);
            setCurrentInventoryRow(null);
        }
    };

    /**
     * Updates the changed value of inventory items if needed.
     * 
     * @function handleInventoryChange
     * @param {String} field - The attribute in inventory that was changed.
     * @param {String} value - The value the inventory attribute was changed to.
     */
    const handleInventoryChange = (field, value) => {
        setCurrentInventoryRow({
            ...currentInventoryRow,
            [field]: value,
        });
    };

    /**
     * If a row is left-clicked on, sets the correct states to store the row selected. Used for deleting a row.
     * 
     * @function handleRowClick
     * @param {*} index - The index of the row in the table.
     */
    const handleRowClick = (index) => {
        if (editingRow !== null) {
            return; // Prevents deleting row while editing
        }

        if (selectedRow === index) {
            setSelectedRow(null);
        } else {
            setSelectedRow(index);
        }
    };

    /**
     * If a row is right-clicked on, the row is then put into editing mode.
     * 
     * @function handleRightClick
     * @param {*} e - The mouse event that occured.
     * @param {number} index - The index of the row in the table.
     * @param {*} rowData - The information from the selected row. 
     */
    const handleRightClick = (e, index, rowData) => {
        e.preventDefault(); // Prevent the browser's default context menu
        if (selectedRow !== null) {
            return; // Prevents deleting row while editing
        }
        
        if (editingRow === index) {
            // Exit edit mode if the row is already in edit mode
            setEditingRow(null);
            setEditedData({});
            setRowError('');
        } else {
            // Enter edit mode for the row
            setEditingRow(index);
            setEditedData({ ...rowData });
            setRowError('');
        }
    };

    /**
     * Sets the edited data to the appropriate edited field.
     * 
     * @function handleInputChange
     * @param {*} e - The mouse click event that happened to signify the change.
     * @param {String} field - The attribute in inventory that was changed.
     */
    const handleInputChange = (e, field) => {
        let value = e.target.value;
        if (field === 'isPremium') {
            value = e.target.checked ? 1 : 0; // Convert the checkbox to 1 (true) or 0 (false)
        }
        setEditedData(prevData => ({ ...prevData, [field]: value }));
    };

    /**
     * Signals to save the changes when the "Enter" key is pressed.
     * 
     * @function handleKeyDown
     * @param {*} e - The event of the keyboard input that was recorded as "Enter".
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveChanges();
        }
    };

    /**
     * Handles if the "Enter" key was pressed in the adding inventory.
     * 
     * @function handleInventoryKeyDown
     * @param {*} event - The event of the keyboard input recorded as "Enter".
     */
    const handleInventoryKeyDown = (event) => {
        if (event.key === "Enter" && isAddingInventoryRow) {
            finalizeInventoryRow(); // Finalize the inventory row
        }
    };

    /**
     * Once the changes are saved, the database is updated.
     * 
     * @function handleSaveChanges
     */
    const handleSaveChanges = async () => {
        // // Basic validation for cost
        // Update queries
        let updateQuery = "UPDATE prices SET cost = " + editedData.cost + ", premium = " + editedData.isPremium + " WHERE productname = '" + editedData.menuItem + "';";
        let menuMatchQuery = "UPDATE menuMatch SET inventoryitems = '" + editedData.inventoryItems + "' WHERE menuItem = '" + editedData.menuItem + "'";

        try {
            await Promise.all([handleQuery(updateQuery), handleQuery(menuMatchQuery)]);

            fetchData(); // Refresh the data after successful update
            setEditingRow(null); // Exit edit mode
        } catch (error) {
            console.error('Error updating item:', error);
            setRowError('Failed to update item. Please try again.');
        }
    };

    /**
     * Deletes an item, if triggered previously.
     * 
     * @function handleDeleteItem
     */
    const handleDeleteItem = async () => {
        if (selectedRow === null) return;

        const itemToDelete = menuData[selectedRow].menuItem;
        let deletePriceQuery = "DELETE FROM prices WHERE productname = '" + itemToDelete + "'";
        let deleteMeuMatchQuery = "DELETE FROM menumatch WHERE menuitem = '" + itemToDelete + "'";

        try {
            // Execute the queries
            await Promise.all([handleQuery(deletePriceQuery), handleQuery(deleteMeuMatchQuery)]);
            
            // After deleting the item, re-fetch the menu data
            fetchData();  // This function should refetch both prices and menuMatch data
            setSelectedRow(null);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

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
                            {menuData.length > 0 ? (
                                menuData.map((item, index) => (
                                    <tr key={index}
                                        className={selectedRow === index ? 'selected-row' : ''}
                                        onClick={() => handleRowClick(index)} // Left click to select
                                        onContextMenu={(e) => handleRightClick(e, index, item)} // Right click to edit
                                        onKeyDown={(e) => handleKeyDown(e)}
                                    >
                                        <td>{item.menuItem}</td>
                                        <td>
                                            {editingRow === index ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editedData.cost}
                                                    onChange={(e) => handleInputChange(e, 'cost')}
                                                />
                                            ) : (
                                                item.cost
                                            )}
                                        </td>
                                        <td>
                                            {editingRow === index ? (
                                                <input
                                                    type="checkbox"
                                                    checked={editedData.isPremium === 1} // If the isPremium is 1, the checkbox will be checked
                                                    onChange={(e) => handleInputChange(e, 'isPremium')}
                                                />
                                            ) : (
                                                item.isPremium === 1 ? 'Yes' : 'No' // Display Yes or No in normal view
                                            )}
                                        </td>
                                        <td>{item.isEntree}</td>
                                        <td>{item.isSide}</td>
                                        <td>{item.isDrink}</td>
                                        <td>{item.isAppetizer}</td>
                                        <td>
                                            {editingRow === index ? (
                                                <input
                                                    type="text"
                                                    value={editedData.inventoryItems}
                                                    onChange={(e) => handleInputChange(e, 'inventoryItems')}
                                                />
                                            ) : (
                                                item.inventoryItems
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">Loading...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {rowError && <p style={{ color: 'red' }}>{rowError}</p>}
                <div className="buttons">
                    <button className="action-button" onClick={openPopup}>Add Item</button>
                    <button className="action-button" onClick={handleDeleteItem} disabled={selectedRow === null}>Delete Item</button>
                </div>
            </div>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <button className="close-popup" onClick={closePopup}>
                            &times;
                        </button>
                        <h2>Add Item</h2>
                        <div className="input-group">
                            <label>New Menu Item: </label>
                            <input
                                type="text"
                                value={newMenuItem}
                                onChange={e => setNewMenuItem(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Cost: </label>
                            $<input
                                type="text"
                                value={cost}
                                onChange={e => setCost(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Premium<input
                                type="checkbox"
                                checked={isPremium}
                                onChange={e => setIsPremium(e.target.checked)}
                            /></label>
                        </div>
                        <div className="popup-buttons">
                            {['Entree', 'Side', 'Drink', 'Appetizer'].map(type => (
                                <button key={type} className={`popup-button ${menuType === type ? 'selected' : ''}`} onClick={() => setMenuType(type)}>{type}</button>
                            ))}
                        </div>
                        <label className="inventory-label">Inventory Items:</label>
                        <div className="input-group">
                            {/* New Inventory Items Table */}
                            <div className="inventory-table-container" onKeyDown={isAddingInventoryRow ? handleInventoryKeyDown : null} tabIndex={0}>
                                <table className="inventory-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Cost</th>
                                            <th>In Stock</th>
                                            <th>Restock Amount</th>
                                            <th>Stock Minimum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.productname}</td>
                                                <td>{item.cost}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.restockamount}</td>
                                                <td>{item.stockminimum}</td>
                                            </tr>
                                        ))}
                                        {isAddingExistingItem && (
                                            <tr>
                                                <td>
                                                    <select
                                                        value={selectedInventoryItem ? selectedInventoryItem.productname : ""}
                                                        onChange={(e) => handleExistingItemSelect(inventory.find(item => item.productname === e.target.value))}
                                                    >
                                                        <option value="">Select Product</option>
                                                        {inventory.map((item, index) => (
                                                            <option key={index} value={item.productname}>{item.productname}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                {/* Disabled other columns */}
                                                <td>{selectedInventoryItem ? selectedInventoryItem.cost : ""}</td>
                                                <td>{selectedInventoryItem ? selectedInventoryItem.quantity : ""}</td>
                                                <td>{selectedInventoryItem ? selectedInventoryItem.restockamount : ""}</td>
                                                <td>{selectedInventoryItem ? selectedInventoryItem.stockminimum : ""}</td>
                                            </tr>
                                        )}
                                        {isAddingInventoryRow && currentInventoryRow && (
                                            <tr>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={currentInventoryRow.productname}
                                                        onChange={(e) => handleInventoryChange("productname", e.target.value)}
                                                        placeholder="Name"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={currentInventoryRow.cost}
                                                        onChange={(e) => handleInventoryChange("cost", e.target.value)}
                                                        placeholder="$$"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={currentInventoryRow.quantity}
                                                        onChange={(e) => handleInventoryChange("quantity", e.target.value)}
                                                        placeholder="Quantity"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={currentInventoryRow.restockamount}
                                                        onChange={(e) => handleInventoryChange("restockamount", e.target.value)}
                                                        placeholder="Restock"
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        value={currentInventoryRow.stockminimum}
                                                        onChange={(e) => handleInventoryChange("stockminimum", e.target.value)}
                                                        placeholder="Minimum"
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="popup-buttons">
                                    <button className="popup-button" onClick={handleAddExistingItem} disabled={isAddingInventoryRow}>Add Existing Item</button>
                                    <button className="popup-button" onClick={handleCreateNewItem} disabled={isAddingInventoryRow}>Create New Item</button>
                                </div>
                            </div>
                        </div>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <button className={`confirm-button ${newMenuItem && cost && menuType ? 'enabled' : ''}`} onClick={handleAddItem} disabled={!newMenuItem || !cost || !menuType}>Add</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateMenu;
