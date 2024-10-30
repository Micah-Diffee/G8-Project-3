import React from 'react';
import './ZReport.css';

function ZReport() {
  return (

    <>
      <h1 className = "date-title">Current Date</h1>
      <h1 className="zreport-title">Z Report</h1>
      <div className="zreport-container">
        {/* Table for Z Report Data */}
        <div className="table-wrapper">
          <table className="zreport-table">
            <caption>Z Report Overview</caption>
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

export default ZReport;