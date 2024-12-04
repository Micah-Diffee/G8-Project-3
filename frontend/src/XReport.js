import React, { useEffect, useState } from 'react';
import './XReport.css';

/**
 * XReport displays the X Report data for a specified date (Sep. 10, 2024), including hourly sales up until the current hour and other totals.
 */
function XReport() {
  const [xreports, setXReports] = useState([]);
  const [totals, setTotals] = useState({ cash: 0, credit: 0, debit: 0, dining_dollars: 0 });
  const currentDate = new Date().toISOString().split('T')[0]; 

  //Fetch data from the backend API
  useEffect(() => {
    fetch('https://panda-express-pos-backend-nc89.onrender.com/api/XReport')
      .then(response => response.json())
      .then(data => {
        if (data) {

          //Handle xreports data by getting the current hour and the number of sales up until that hour
          if (data.xreports) {
            const currentHour = new Date().getHours();

            const filteredData = data.xreports.filter(report => {
              return report.hour && typeof report.hour.hours === 'number' && report.hour.hours <= currentHour;
            });

            const formattedData = filteredData.map(report => ({
              hour: formatHour(report.hour),
              totalSales: parseFloat(report.total_sales).toFixed(2), 
            }));
            setXReports(formattedData);
          }

          //Handle totals data with fixed two decimal points and whole number for transactions
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
      //Convert hours to a string in 'HH:00' format for display
      const hourString = hourObj.hours.toString().padStart(2, '0');
      return `${hourString}:00`;
    }
    console.warn('Unexpected hour format:', hourObj);
    return 'Invalid Hour'; 
  };

  return (
    <>
      <div className="xreport-section">
        <h1 className="section-title">Date: {(currentDate)}</h1>
        <h1 className="section-title">X Report</h1>
        <hr />
        {/* Table for X Report Data */}
        <div className="xreport-table-content">
          <div className="xreport-table-container">
            <table className="xreport-table">
              <thead>
                <tr>
                  <th>Hour</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {xreports.length === 0 ? (
                  <tr>
                    <td colSpan="2">No orders available</td>
                  </tr>
                ) : (
                  xreports.map((xreport, index) => (
                    <tr key={index}>
                      <td>{xreport.hour}</td>
                      <td>{xreport.totalSales}</td>
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
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default XReport;