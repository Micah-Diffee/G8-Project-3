import { useState } from 'react';
import { BrowserRouter as Link, Route, Routes, Navigate, Router, useLocation } from 'react-router-dom';
import './Customer_Kiosk_System.css';
import './Customer_Kiosk_Display.css';
import Login from './Manager';

// The global variable will store the current kiosk page the customer is currently utilizing.
var currentKioskPage = 'popular_page_kiosk';

// The global variable will store a list of the current transaction.
var orderedItems = [];

// The global variable will store the total cost of the current transaction.
export var totalCost = 0.0;

// The button will go to the employee login page.
export function EmployeeLoginButton() {
    function handleClick() {
        window.location.href = "Login";
    }
    
    return (
        <button id="Login" className="employee_login_button_design" onClick={handleClick}>Employee Login</button>
    );
}

// The button will navigate to different sections of the kiosk.
export function SideButton({buttonName, className}) {
    function handleClick() {
        // The code will hide the current kiosk page.
        const currentPage = document.querySelector("." + currentKioskPage);
        currentPage.style.display = 'none';

        // The code will visually show the new kiosk page.
        const newPage = document.querySelector("." + className);
        newPage.style.display = 'contents';

        // The code will store the new kiosk page as the current kiosk page.
        currentKioskPage = className;
    }

    return (
        <button class="side_button_design" onClick={handleClick}>{buttonName}</button>
    );
}

// The button will add a menu item to the customer's order.
export function MenuItemButton({buttonName}) {
    function handleClick() {
        
    }

    return (
        <button class="menu_item_button_design" onClick={handleClick}>{buttonName}</button>
    );
}

// The button will go to the checkout page.
export function CheckoutButton() {
    function handleClick() {
        // The code will hide the current kiosk page.
        const currentPage = document.querySelector("." + currentKioskPage);
        currentPage.style.display = 'none';

        // The code will visually show the checkout page.
        const checkoutPage = document.querySelector(".checkout_page_kiosk");
        checkoutPage.style.display = 'contents';

        // The code will store the checkout page as the current kiosk page.
        currentKioskPage = "checkout_page_kiosk";
    }

    return (
        <button class="checkout_button_design" onClick={handleClick}>Checkout</button>
    );
}
