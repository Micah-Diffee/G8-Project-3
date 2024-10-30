import React from 'react';
import './XReport.css';

function XReport() {
  return (

    <>
      <h1 className = "date-title">Current Date</h1>
      <h1 className="xreport-title">X Report</h1>
      <div className="xreport-container">
        {/* Table for X Report Data */}
        <div className="table-wrapper">
          <table className="xreport-table">
            <caption>X Report Overview</caption>
            <thead>
              <tr>
                <th>Hour</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>No Data Available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
    
  );
}

export default XReport;
