import React from 'react';
import './ProductUsage.css'; // Import the CSS file for styling

function ProductUsage() {
  return (
    <div className="product-usage-container">
      <h1>Product Usage</h1>

      {/* Table for product usage chart */}
      <div className="table-wrapper">
        <table className="product-usage-table">
          <caption>Product Usage Chart</caption>
          <thead>
            <tr>
              <th>Data</th>
              <th>Data</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No Data</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Generate chart button */}
      <button className="generate-chart-button">Generate Chart</button>
    </div>
  );
}

export default ProductUsage;