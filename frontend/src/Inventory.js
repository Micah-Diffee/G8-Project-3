import React, { useEffect, useState } from 'react';
import './Inventory.css';

function Inventory() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCustomRestockOpen, setIsCustomRestockOpen] = useState(false);
    const [isCostPopupOpen, setIsCostPopupOpen] = useState(false);
    const [restockTotalCost, setRestockTotalCost] = useState(0);
    const [formData, setFormData] = useState({
        productname: '',
        quantity: '',
        restockamount: '',
        cost: '',
        stockminimum: ''
    });
    const [restockData, setRestockData] = useState({
        productname: '',
        restockquantity: ''
    });

    // Fetch Inventory Data
    useEffect(() => {
        fetch('http://localhost:5000/api/InventoryData')
            .then(response => response.json())
            .then(data => {
                setInventoryItems(data.inventory);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Add New Inventory Item
    const handleAdd = () => {
        setIsFormOpen(true);
    };

    // Gathers information from Add Item form and adds the new item to the database
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { productname, cost, quantity, restockamount, stockminimum } = formData;

        // Makes sure input is valid
        if (!productname || !quantity || !restockamount || !cost) {
            alert("Please fill in all fields.");
            return;
        }
        if (!/^\d+$/.test(quantity) || !/^\d+$/.test(restockamount) || !/^\d+$/.test(stockminimum) || !/^\d*\.?\d+$/.test(cost)) {
            alert("Quantity, Restock Amount, and Stock Minimum must be whole numbers, and Cost must be a valid number.");
            return;
        }

        // Insterts new item into the database
        const SQLcommand = `INSERT INTO inventory VALUES ('${productname}', '${cost}', '${quantity}', '${restockamount}', '${stockminimum}')`;
        handleQuery(SQLcommand);

        const newItem = { productname, cost, quantity, restockamount, stockminimum };
        setInventoryItems((prevItems) => [...prevItems, newItem]);

        setIsFormOpen(false);
        setFormData({ productname: '', cost: '', quantity: '', restockamount: '', stockminimum: '' });
    };
    
    // Function to handle the Restock All button click
    const handleRestockAll = () => {
        let totalCost = 0;
        let count = 0;

        // Updates the database with the new quantity for each item if below their respective minimums
        inventoryItems.forEach((item) => {
            if (parseInt(item.quantity) < parseInt(item.stockminimum)) {
                const newTotalQuantity = parseInt(item.quantity) + parseInt(item.restockamount);
                const restockCost = item.cost * item.restockamount;
                totalCost += restockCost;

                const SQLcommand = `UPDATE inventory SET quantity = ${newTotalQuantity} WHERE productname = '${item.productname}'`;
                handleQuery(SQLcommand);
                
                setInventoryItems((prevItems) =>
                    prevItems.map((prevItem) =>
                        prevItem.productname === item.productname
                            ? { ...prevItem, quantity: newTotalQuantity.toString() }
                            : prevItem
                    )
                );
                count += 1;
            }
        });

        // Opes popup to display restock cost if there was an update
        setRestockTotalCost(totalCost.toFixed(2));
        if (count > 0) {
            setIsCostPopupOpen(true);
        }
    };

    // Function to handle Custom Restock button click
    const handleCustomRestock = () => {
        setIsCustomRestockOpen(true);
    };

    // Handles when the custom restock form is submitted
    const handleCustomRestockSubmit = (e) => {
        e.preventDefault();
        const { productname, restockquantity } = restockData;

        // Makes sure input is valid
        if (!productname || !restockquantity) {
            alert("Please fill in all fields.");
            return;
        }
        if (!/^\d+$/.test(restockquantity)) {
            alert("Restock quantity must be a whole number.");
            return;
        }

        const item = inventoryItems.find((item) => item.productname === productname);

        if (!item) {
            alert("Product not found.");
            return;
        }

        const newTotalQuantity = parseInt(item.quantity) + parseInt(restockquantity);
        const totalCost = item.cost * restockquantity;

        // Updates database with new quantity
        const SQLcommand = `UPDATE inventory SET quantity = ${newTotalQuantity} WHERE productname = '${productname}';`;
        handleQuery(SQLcommand);

        setInventoryItems((prevItems) =>
            prevItems.map((prevItem) =>
                prevItem.productname === productname
                    ? { ...prevItem, quantity: newTotalQuantity.toString() }
                    : prevItem
            )
        );

        setIsCustomRestockOpen(false);
        setRestockData({ productname: '', restockquantity: '' });

        // Opes popup to display restock cost
        setRestockTotalCost(totalCost.toFixed(2));
        setIsCostPopupOpen(true);
    };

    const handleQuery = (query) => {
        fetch('http://localhost:5000/executeQuery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error executing query:', error));
    };

    // Handle closing the add item form
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormData({ productname: '', quantity: '', restockamount: '', cost: '' });
    };
    // Handle closing the custom restock form
    const handleCloseCustomRestock = () => {
        setIsCustomRestockOpen(false);
        setRestockData({ productname: '', restockquantity: '' });
    };
    // Handle closing the total cost popup
    const handleCloseCostPopup = () => {
        setIsCostPopupOpen(false);
    };

    return (
        <div className="inventory-container">

            {/* Inventory Table */}
            <div className="section">
                <h2>Inventory</h2>
                <div className="table-container">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryItems.map((item) => (
                                <tr key={item.productname}>
                                    <td>{item.productname}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="add-button" onClick={handleAdd}>Add New Item to Inventory</button>
            </div>

            {/* Reorder Table */}
            <div className="section">
                <h2>Reorder</h2>
                <div className="table-container">
                    <table className="reorder-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Restock Amount</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryItems
                                .filter((item) => parseInt(item.quantity) < parseInt(item.stockminimum))
                                .map((item) => (
                                    <tr key={item.productname}>
                                        <td>{item.productname}</td>
                                        <td>{item.restockamount}</td>
                                        <td>{(item.cost * item.restockamount).toFixed(2)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="reorder-buttons">
                    <button className="restock-button" onClick={handleRestockAll}>Restock All</button>
                    <button className="restock-button" onClick={handleCustomRestock}>Custom Restock</button>
                </div>
            </div>

            {/* Form for adding a new item */}
            {isFormOpen && (
                <div className="form-popup">
                    <form className="form-container" onSubmit={handleFormSubmit}>
                        <h1>Add Inventory Item</h1>
                        <hr />

                        <label><b>Product Name</b></label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={formData.productname}
                            onChange={(e) => setFormData({ ...formData, productname: e.target.value })}
                            required
                        />

                        <label><b>Cost</b></label>
                        <input
                            type="text"
                            placeholder="Enter cost"
                            value={formData.cost}
                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            required
                        />

                        <label><b>Quantity</b></label>
                        <input
                            type="text"
                            placeholder="Enter quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />

                        <label><b>Restock Amount</b></label>
                        <input
                            type="text"
                            placeholder="Enter restock amount"
                            value={formData.restockamount}
                            onChange={(e) => setFormData({ ...formData, restockamount: e.target.value })}
                            required
                        />

                        <label><b>Minimum Stock</b></label>
                        <input
                            type="text"
                            placeholder="Enter stock minimum"
                            value={formData.stockminimum}
                            onChange={(e) => setFormData({ ...formData, stockminimum: e.target.value })}
                            required
                        />

                        <button type="submit" className="btn">Add Item</button>
                        <button type="button" className="btn cancel" onClick={handleCloseForm}>Close</button>
                    </form>
                </div>
            )}

            {/* Form for custom restock */}
            {isCustomRestockOpen && (
                <div className="form-popup">
                    <form className="form-container" onSubmit={handleCustomRestockSubmit}>
                        <h1>Custom Restock</h1>
                        <hr />

                        <label><b>Product Name</b></label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={restockData.productname}
                            onChange={(e) => setRestockData({ ...restockData, productname: e.target.value })}
                            required
                        />

                        <label><b>Restock Quantity</b></label>
                        <input
                            type="text"
                            placeholder="Enter restock quantity"
                            value={restockData.restockquantity}
                            onChange={(e) => setRestockData({ ...restockData, restockquantity: e.target.value })}
                            required
                        />

                        <button type="submit" className="btn">Restock</button>
                        <button type="button" className="btn cancel" onClick={handleCloseCustomRestock}>Close</button>
                    </form>
                </div>
            )}

            {/* Popup for displaying the total restocking cost */}
            {isCostPopupOpen && (
                <div className="form-popup">
                <form className="form-container">
                    <h1>Restock Cost:</h1>
                    <hr />

                    <h2><b>${restockTotalCost}</b></h2>
                    <button type="button" className="btn cancel" onClick={handleCloseCostPopup}>Close</button>
                </form>
                </div>
            )}
        </div>
    );
}

export default Inventory;
