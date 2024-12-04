import React, { useEffect, useState } from 'react';
import './ZReport.css';

/**
 * ZReport displays the Z Report data for a specified date (Sep. 10, 2024), including hourly sales and payment type totals.
 */
function ZReport() {
  const [zreports, setZReports] = useState([]);
  const [totals, setTotals] = useState({ cash: 0, credit: 0, debit: 0, dining_dollars: 0 });

  //Fetch data from the backend API
  useEffect(() => {
    fetch('https://panda-express-pos-backend-nc89.onrender.com/api/ZReport')
      .then(response => response.json())
      .then(data => {
        if (data) {
          
          if (data.zreports) {
            const filteredData = data.zreports.filter(report => {
              return report.hour && typeof report.hour.hours === 'number';
            });

            const formattedData = filteredData.map(report => ({
              hour: formatHour(report.hour),
              totalSales: parseFloat(report.total_sales).toFixed(2), 
            }));
            setZReports(formattedData);
          }

          //Totals data with everything to two decimal places besided transaction which is a whole number
          if (data.totals) {
            setTotals({
              cash: parseFloat(data.totals.cash).toFixed(2),
              credit: parseFloat(data.totals.credit).toFixed(2),
              debit: parseFloat(data.totals.debit).toFixed(2),
              dining_dollars: parseFloat(data.totals.dining_dollars).toFixed(2),
              total_sales: parseFloat(data.totals.total_sales).toFixed(2),
              total_transactions: parseInt(data.totals.total_transactions, 10), 
            });
          }
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  /**
   * Formats an hour object into a displayable string of 'HH:00'.
   *
   * @function formatHour
   * @param {Object} hourObj The hour object containing the full hours property (HH:00:00T00:00:00).
   * @returns {string} The formatted hour string in 'HH:00' format, or 'Invalid Hour' if input is invalid.
   */
  const formatHour = (hourObj) => {
    if (hourObj && typeof hourObj.hours === 'number') {
      // Convert hours to a string in 'HH:00' format for display
      const hourString = hourObj.hours.toString().padStart(2, '0');
      return `${hourString}:00`;
    }
    console.warn('Unexpected hour format:', hourObj);
    return 'Invalid Hour'; 
  };

  return (
    <>
      <div className="zreport-section">
        <h1 className="section-title">Date: 09-10-2024</h1>
        <h1 className="section-title">Z Report</h1>
        <hr />
        {/* Table for Z Report Data */}
        <div className="zreport-table-content">
          <div className="zreport-table-container">
            <table className="zreport-table">
            <thead>
              <tr>
                <th>Hour</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {zreports.length === 0 ? (
                <tr>
                  <td colSpan="2">No orders available</td>
                </tr>
              ) : (
                zreports.map((zreport, index) => (
                  <tr key={index}>
                    <td>{zreport.hour}</td>
                    <td>{zreport.totalSales}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* List of totals for different payment types */}
        <div className="totals-container">
          <hr />
          <h2>Payment Type Totals</h2>
          <ul>
            <li>Cash: {totals.cash}</li>
            <br/>
            <li>Credit: {totals.credit}</li>
            <br/>
            <li>Debit: {totals.debit}</li>
            <br/>
            <li>Dining Dollars: {totals.dining_dollars}</li>
            <br/>
          </ul>
          <h2>Other Totals</h2>
          <ul>
            <li>Total Sales: {totals.total_sales}</li>
            <br/>
            <li>Total Transactions: {totals.total_transactions}</li>
          </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ZReport;