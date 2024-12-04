import React, { useEffect, useState } from 'react';
import './GeneralTrends.css';

/**
 * GeneralTrends page that displays general trends, including daily summaries, peak day data, and summary statistics.
 */
function GeneralTrends() {
  const [dailySum, setDailySum] = useState([]);
  const [peakDays, setPeakDays] = useState([]);
  const [stats, setStats] = useState({});

  //Fetch data from backend API
  useEffect(() => {
    fetch('https://panda-express-pos-backend-nc89.onrender.com/api/GeneralTrends')
      .then(response => response.json())
      .then(data => {
        setDailySum(data.dailySum || []);
        setPeakDays(data.peakDays || []);
        setStats(data.stats || {});
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  /**
   * Formats a date string to 'YYYY-MM-DD' format.
   *
   * @function formatDate
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string, or 'Invalid Date' if input is invalid.
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.warn('Invalid date value:', dateString);
      return 'Invalid Date';
    }
    return date.toISOString().split('T')[0];
  };

  /**
   * Formats a number to two decimal places.
   *
   * @function formatDecimal
   * @param {number|string} value - The number to format.
   * @returns {string} The formatted number to two decimal places, or '0.00' if input is invalid.
   */
  const formatDecimal = (value) => {
    return value ? parseFloat(value).toFixed(2) : '0.00';
  };

  return (
    <>
      <h1 className="section-title">General Trends</h1>
      <hr />
      <div className="general-container">
        <div className="section">
          {/* Daily Summary Table */}
          <h2>Daily Summary</h2>
          <div className="table-container">
            <table className="dailySum-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Sales</th>
                  <th>Total Customers</th>
                  <th>Average Time Between Orders (Minutes)</th>
                </tr>
              </thead>
              <tbody>
                {dailySum.length === 0 ? (
                  <tr><td colSpan="4">No summaries available</td></tr>
                ) : (
                  dailySum.map((summary) => (
                    <tr key={summary.date}>
                      <td>{formatDate(summary.date)}</td>
                      <td>{formatDecimal(summary.total_sales)}</td>
                      <td>{summary.total_customers}</td>
                      <td>{formatDecimal(summary.average_time_between_orders_minutes)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Peak Days Summary */}
        <div className="section">
          <h2>Peak Days Summary</h2>
          <div className="table-container">
            <table className="peak-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Sales</th>
                  <th>Total Customers</th>
                  <th>Average Time Between Orders (Minutes)</th>
                </tr>
              </thead>
              <tbody>
                {peakDays.length === 0 ? (
                  <tr><td colSpan="4">No summaries available</td></tr>
                ) : (
                  peakDays.map((peakDay) => (
                    <tr key={peakDay.date}>
                      <td>{formatDate(peakDay.date)}</td>
                      <td>{formatDecimal(peakDay.total_sales)}</td>
                      <td>{peakDay.total_customers}</td>
                      <td>{formatDecimal(peakDay.average_time_between_orders_minutes)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Stats Bulleted List */}
      <div className="stats-section">
          <h2>Summary Statistics</h2>
          <ul className="stats-list">
            <li>Total Income: ${stats.totalIncome}</li>
            <li>Total Customers: {stats.totalCustomers}</li>
            <li>Average Customers Per Day: {stats.averageCustomers}</li>
            <li>Average Sale Per Customer: ${stats.totalSalesPerCustomer}</li>
            <li>Date with Shortest Time Between Orders: {formatDate(stats.dateShortestTimeBetweenOrders)}</li>
            <li>Date with Longest Time Between Orders: {formatDate(stats.dateLongestTimeBetweenOrders)}</li>
            <li>Date with Most Sales: {formatDate(stats.dateMostSales)}</li>
            <li>Date with Most Customers: {formatDate(stats.dateMostCustomers)}</li>
          </ul>
        </div>  
    </>
  );
}

export default GeneralTrends;