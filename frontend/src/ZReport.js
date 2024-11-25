import React, { useEffect, useState } from 'react';
import './ZReport.css';

function ZReport() {
  const [zreports, setZReports] = useState([]);
  const [totals, setTotals] = useState({ cash: 0, credit: 0, debit: 0, dining_dollars: 0 });

  // Fetch data from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/ZReport')
      .then(response => response.json())
      .then(data => {
        if (data) {
          console.log('Fetched ZReport data:', data);

          // Handle zreports data
          if (data.zreports) {
            const currentHour = new Date().getHours(); // Get the current hour (0-23)

            const filteredData = data.zreports.filter(report => {
              return report.hour && typeof report.hour.hours === 'number';
            });

            const formattedData = filteredData.map(report => ({
              hour: formatHour(report.hour), // Use updated formatHour function
              totalSales: report.total_sales,
            }));
            setZReports(formattedData);
          }

          // Handle totals data
          if (data.totals) {
            setTotals(data.totals);
          }
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Format hour to a more readable format, if needed
  const formatHour = (hourObj) => {
    if (hourObj && typeof hourObj.hours === 'number') {
      // Convert hours to a string in 'HH:00' format for display
      const hourString = hourObj.hours.toString().padStart(2, '0'); // Ensure two-digit format
      return `${hourString}:00`;
    }
    console.warn('Unexpected hour format:', hourObj);
    return 'Invalid Hour'; // Fallback for unexpected formats
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