import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import EmployeeInfo from './EmployeeInfo';
import OrderHistory from './OrderHistory';
import UpdateMenu from './UpdateMenu';
import Inventory from './Inventory';
import GeneralTrends from './GeneralTrends';
import ProductUsage from './ProductUsage';
import ZReport from './ZReport';
import XReport from './XReport';
import Login from './Login';
import Cashier from './Cashier';
import { CustomerKioskDisplay } from './Customer_Kiosk_Display';
import './Manager.css';

/**
 * ManagerContent displays the main content for the manager, including navigation and navigation
 * of different pages such as Inventory, Employee Info, Order History, Trends, and Reports.
 */
function ManagerContent() {

  //Finds location to decide what needs to show on what page
  const location = useLocation();

  // State to track whether the additional bar with buttons should be shown
  const [showTrendsBar, setShowTrendsBar] = useState(false);

  /**
   * Toggles the visibility of the trends bar.
   * 
   * @function handleTrendsClick
   */
  const handleTrendsClick = () => {
    if (!showTrendsBar) {
      setShowTrendsBar((prev) => !prev);
    }
  };

  return (
    <>
      {/* Conditionally render navbar only if not on Login page */}
      {((location.pathname === '/Inventory') || (location.pathname === '/EmployeeInfo') || (location.pathname === '/UpdateMenu')
       || (location.pathname === '/OrderHistory') || (location.pathname === '/GeneralTrends') || (location.pathname === '/ProductUsage') 
       || (location.pathname === '/ZReport') || (location.pathname === '/XReport')) && (
        <div className="menu-bar no-gutters">
          <Link to="/Inventory" className="manager-menu-button">Inventory</Link>
          <Link to="/EmployeeInfo" className="manager-menu-button">Employee Info</Link>
          <Link to="/UpdateMenu" className="manager-menu-button">Update Menu</Link>
          <Link to="/OrderHistory" className="manager-menu-button">Order History</Link>
          <Link to="/GeneralTrends" className="manager-menu-button" onClick={handleTrendsClick}>Trends</Link>
          <Link to="/Login" className="manager-menu-button-logout">Logout</Link>
        </div>
      )}

       {/* Conditional Rendering of the Trends Bar */}
       {showTrendsBar && ((location.pathname === '/GeneralTrends') || (location.pathname === '/ProductUsage') 
       || (location.pathname === '/ZReport') || (location.pathname === '/XReport')) && (
        <div className="trends-bar">
          <Link to="/GeneralTrends" className="trend-option-button">General Trends</Link>
          <Link to="/ProductUsage" className="trend-option-button">Product Usage</Link>
          <Link to="/ZReport" className="trend-option-button">ZReport</Link>
          <Link to="/XReport" className="trend-option-button">XReport</Link>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/CustomerKioskDisplay" />} />
        <Route path="/CustomerKioskDisplay" element={<CustomerKioskDisplay />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/EmployeeInfo" element={<EmployeeInfo />} />
        <Route path="/UpdateMenu" element={<UpdateMenu />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="GeneralTrends" element={<GeneralTrends />} />
        <Route path="/ProductUsage" element={<ProductUsage />} />
        <Route path="/ZReport" element={<ZReport />} />
        <Route path="/XReport" element={<XReport />} />
        <Route path="/Cashier" element={<Cashier />} />
      </Routes>
    </>
  );
}

/**
 * Manager wraps the ManagerContent component within a Router to handle navigation.
 */
export default function Manager() {
  return (
    <Router>
      <ManagerContent />
    </Router>
  );
}