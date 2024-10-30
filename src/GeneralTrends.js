import React from 'react';
import './GeneralTrends.css';

function GeneralTrends() {
  return (
    <>
      <h1 className="page-title">General Trends</h1>
      <div className="general-trends-container">
        <div className="tables-container">
          {/* Daily Summary Table */}
          <div className="table-wrapper">
            <table className="general-table">
              <caption>Daily Summary</caption>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Data</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No Data Available</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Peak Table */}
          <div className="table-wrapper">
            <table className="general-table">
              <caption>Peak Days</caption>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Data</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No Data Available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>  
    </>
    
  );
}

export default GeneralTrends;