import React, { useEffect, useState } from 'react';
import './UpdateMenu.css';

function UpdateMenu() {
    // This state is used to store the prices of all menu items from the backend
    const [prices, setPrices] = useState(null);
    
    // This state is used to store the prices of all menu items from the backend
    const [menuMatch, setMenuMatch] = useState(null); 
    
    // Popup states
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newMenuItem, setNewMenuItem] = useState('');
    const [cost, setCost] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [menuType, setMenuType] = useState('');
    const [inventoryItems, setInventoryItems] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshData, setRefreshData] = useState(false);

    // Editing states
    const [editingRow, setEditingRow] = useState(null); // Track the row being edited
    const [editedData, setEditedData] = useState({}); // Track edited data for a row
    const [rowError, setRowError] = useState(''); // Track errors for the row being edited

    // Editing & Deletion state
    const [selectedRow, setSelectedRow] = useState(null);

    // Fetch data from the backend (Code from slides)
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
    }, [refreshData]); // Trigger the effect when refreshData changes

    // The code will handle queries to the backend of the database (Code from Micah Diffee).
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

    const fetchData = async () => {
        try {
            const priceResponse = await fetch('https://panda-express-pos-backend-nc89.onrender.com/api/Prices');
            const priceData = await priceResponse.json();
            setPrices(priceData['prices']);
            
            const menuMatchResponse = await fetch('https://panda-express-pos-backend-nc89.onrender.com/api/MenuMatch');
            const menuMatchData = await menuMatchResponse.json();
            setMenuMatch(menuMatchData['menuMatch']);
            
            setRefreshData(prev => !prev);  // Optionally toggle state if needed for re-render
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Get data from prices and menuMatch loaded into table
    const getMenuData = ()  => {
        if (!prices || !menuMatch) return[];

        return prices.map(priceItem => {
            const matchingMenuItem = menuMatch.find(
                menu => menu.menuitem === priceItem.productname
            );

            return {
                menuItem: priceItem.productname,
                cost: priceItem.cost,
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

    // Open popup
    const openPopup = () => setIsPopupOpen(true);

    // Close popup
    const closePopup = () => {
        setIsPopupOpen(false);
        setNewMenuItem('');
        setCost('');
        setIsPremium(false);
        setMenuType('');
        setInventoryItems('');
        setErrorMessage('');
    };

    // Handle form submission
    const handleAddItem = async () => {
        if (!newMenuItem || !cost || !menuType) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        if (isNaN(parseFloat(cost)) || parseFloat(cost) <= 0) {
            setErrorMessage('Please enter a valid positive decimal number for cost.');
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
        const menuMatchQuery = `
            INSERT INTO menumatch (menuitem, inventoryitems)
            VALUES ('${newMenuItem}', '${inventoryItems}');
        `;
        
        try {
            // Execute the queries
            await Promise.all([handleQuery(addQuery), handleQuery(menuMatchQuery)]);
            
            // After adding the item, re-fetch the menu data
            fetchData();  // This function should refetch both prices and menuMatch data
            closePopup(); // Close the popup after the data is refreshed
        } catch (error) {
            console.error('Error adding item:', error);
            setErrorMessage('Failed to add the item. Please try again.');
        }
    };

    // Handle row selection
    const handleRowClick = (index, rowData) => {
        if (editingRow !== null) {
            return; // prevents deleting row while editing
        }

        if (selectedRow === index) {
            setSelectedRow(null);
        } else {
            setSelectedRow(index);
        }
    };

    // Handle right-click to enter edit mode
    const handleRightClick = (e, index, rowData) => {
        e.preventDefault(); // Prevent the browser's default context menu
        if (selectedRow !== null) {
            return; // prevents deleting row while editing
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

    // Handle input change for the editable fields
    const handleInputChange = (e, field) => {
        let value = e.target.value;
        if (field === 'isPremium') {
            value = e.target.checked ? 1 : 0; // Convert the checkbox to 1 (true) or 0 (false)
        }
        setEditedData(prevData => ({ ...prevData, [field]: value }));
    };

    // Detects if Enter key was pressed
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveChanges(); // Save changes when Enter is pressed
        }
    };

    // Save changes and update the database
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

    // Handle delete item
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
                            <label>
                                Premium
                                <input
                                    type="checkbox"
                                    checked={isPremium}
                                    onChange={e => setIsPremium(e.target.checked)}
                                />
                            </label>
                        </div>
                        <div className="popup-buttons">
                            {['Entree', 'Side', 'Drink', 'Appetizer'].map(type => (
                                <button
                                    key={type}
                                    className={`popup-button ${menuType === type ? 'selected' : ''}`}
                                    onClick={() => setMenuType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="input-group">
                            <label>Inventory Items:</label>
                            <textarea
                                value={inventoryItems}
                                onChange={e => setInventoryItems(e.target.value)}
                            />
                        </div>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <button
                            className={`confirm-button ${
                                newMenuItem && cost && menuType ? 'enabled' : ''
                            }`}
                            onClick={handleAddItem}
                            disabled={!newMenuItem || !cost || !menuType}
                        >
                            Add Item
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateMenu;
