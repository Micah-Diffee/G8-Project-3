import React, { useEffect, useState } from 'react';
import './XReport.css';

function XReport() {
  const [xreports, setXReports] = useState([]);
  const [totals, setTotals] = useState({ cash: 0, credit: 0, debit: 0, dining_dollars: 0 });

  // Fetch data from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/XReport')
      .then(response => response.json())
      .then(data => {
        if (data) {
          console.log('Fetched XReport data:', data);

          // Handle xreports data
          if (data.xreports) {
            const currentHour = new Date().getHours(); // Get the current hour (0-23)

            const filteredData = data.xreports.filter(report => {
              return report.hour && typeof report.hour.hours === 'number' && report.hour.hours <= currentHour;
            });

            const formattedData = filteredData.map(report => ({
              hour: formatHour(report.hour), // Use updated formatHour function
              totalSales: report.total_sales,
            }));
            setXReports(formattedData);
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
      <div className="xreport-section">
        <h1 className="section-title">Date: 09-10-2024</h1>
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