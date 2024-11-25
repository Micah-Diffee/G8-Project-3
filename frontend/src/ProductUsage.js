import React, { useState } from 'react';
import './ProductUsage.css';

function ProductUsage() {

  //State to control form visibility and form data
  const [isInventoryFormOpen, setIsInventoryFormOpen] = useState(false);
  const [inventoryFormData, setInventoryFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });

  //State to store fetched inventory data
  const [inventoryData, setInventoryData] = useState(null); 

  //Handlers for opening form
  const handleOpenInventoryForm = () => {
    setIsInventoryFormOpen(true);
  };

  //Handlers for closing form
  const handleCloseInventoryForm = () => {
    setIsInventoryFormOpen(false);
    setInventoryFormData({startDate: '', endDate: '', startTime: '', endTime: ''});
  };

  //Fetch inventory usage data based on date range
  const fetchProductUsage = async () => {
    const {startDate, endDate, startTime, endTime} = inventoryFormData;

    try {
      //Construct the query parameters for start/end date/time
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        startTime,
        endTime
      }).toString();

      const response = await fetch(`https://panda-express-pos-backend-nc89.onrender.com/api/ProductUsage?${queryParams}`);
      const data = await response.json();

      //Update the inventory data state
      setInventoryData(data.inventoryUsage || {});
    } catch (error) {
      console.error('Error fetching product usage data:', error);
    } 
  };

  //Handler for form submission by closing the form and fetching inventory data
  const handleInventoryFormSubmit = (e) => {
    e.preventDefault();

    const {startDate, endDate, startTime, endTime} = inventoryFormData;

    //Check if endTime is before startTime on the same date
    if (startDate === endDate && endTime < startTime) {
        alert("End time cannot be earlier than start time on the same date.");
        return; 
    }

    //Check if endDate is before startDate
    if (endDate < startDate) {
      alert("End date cannot be earlier than start date.");
      return;
    }


    handleCloseInventoryForm();
    fetchProductUsage();
  };

  return (
    <div className="product-usage-container">
      <h2 className="section-title">Product Usage Chart</h2>
      <hr />
      <div className="product-usage-content">
        {/* Table for product usage chart */}
        <div className="table-container">
          <table className="product-usage-table">
            <thead>
              <tr>
                <th>Inventory Item Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
               {inventoryData && Object.keys(inventoryData).length > 0 ? (
                Object.entries(inventoryData)
                //Sorts the items in the product usage chart in alphabetical order
                  .sort(([itemA], [itemB]) => itemA.localeCompare(itemB)) 
                  .map(([itemName, quantity], index) => (
                    <tr key={index}>
                      <td>{itemName}</td>
                      <td>{quantity}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center' }}>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate chart button */}
      <div className="buttons">
        <button className="generate-chart-button" onClick={handleOpenInventoryForm}>Generate Product Usage Chart</button>
      </div>

      {/* Inventory form popup */}
      {isInventoryFormOpen && (
        <div className="form-popup">
          <form className="form-container" onSubmit={handleInventoryFormSubmit}>
            <h1>Add Date Range</h1>
            <hr />

            {/*Limits start date to range between Sep. 27 2023 - 2024*/}
            <div className="form-group">
              <label htmlFor="startDate"><b>Start Date: </b></label>
              <input
                type="date"
                name="startDate"
                value={inventoryFormData.startDate}
                min="2023-10-27"
                max="2024-10-27"
                onChange={(e) => setInventoryFormData({ ...inventoryFormData, startDate: e.target.value })}
                required
              />
            </div>

            {/*Limits start time to be in working hours (8am to 9pm)*/}
            <div className="form-group">
              <label htmlFor="startTime"><b>Start Time: </b></label>
              <input
                type="time"
                name="startTime"
                value={inventoryFormData.startTime}
                min="08:00:00"
                max="20:59:59"
                onChange={(e) => setInventoryFormData({ ...inventoryFormData, startTime: e.target.value })}
                required
              />
            </div>

            {/*Limits end date to range between Sep. 27 2023 - 2024*/}
            <div className="form-group">
              <label htmlFor="endDate"><b>End Date: </b></label>
              <input
                type="date"
                name="endDate"
                value={inventoryFormData.endDate}
                min="2023-10-27"
                max="2024-10-27"
                onChange={(e) => setInventoryFormData({ ...inventoryFormData, endDate: e.target.value })}
                required
              />
            </div>

            {/*Limits end time to be in working hours (8am to 9pm)*/}
            <div className="form-group">
              <label htmlFor="endTime"><b>End Time: </b></label>
              <input
                type="time"
                name="endTime"
                value={inventoryFormData.endTime}
                min="08:00:00"
                max="20:59:59"
                onChange={(e) => setInventoryFormData({ ...inventoryFormData, endTime: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn">Submit</button>
            <button type="button" className="btn cancel" onClick={handleCloseInventoryForm}>Close</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductUsage;