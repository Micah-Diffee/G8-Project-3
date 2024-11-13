import React, { useEffect, useState } from 'react';
import './Customer_Kiosk_Display.css';

// The variable will keep track of the current customer kiosk number.
var customerNumber = 0;

// The function will display the customer kiosk.
export function CustomerKioskDisplay() {
    // The state will store the prices data
    const [prices, setPrices] = useState([]);

    // The state will store the menumatch data
    const [menuMatch, setMenuMatch] = useState([]);

    // The state will store the customerInformation data.
    const [customerInformation, setCustomerInformation] = useState([]);

    // The state to track loading status
    const [loading, setLoading] = useState(true); // Loading is true initially

    // Fetching the prices data from the backend
    useEffect(() => {
        setLoading(true);  // Set loading to true initially
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/Prices')
            .then(response => response.json())
            .then(data => {
                setPrices(data.prices);  // Set the prices data
                setLoading(false);  // Set loading to false after data is loaded
            })
            .catch(error => {
                console.error('Error fetching prices data:', error);
                setLoading(false);  // Ensure loading is set to false even if an error occurs
            });
    }, []);

    // Fetching the menumatch data from the backend
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/MenuMatch')
            .then(response => response.json())
            .then(data => setMenuMatch(data.menuMatch))
            .catch(error => console.error('Error fetching menu match data:', error));
    }, []);

    // Fetching the customerInformation data from the backend
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/CustomerInformation')
            .then(response => response.json())
            .then(data => setCustomerInformation(data.customerInformation))
            .catch(error => console.error('Error fetching customer information data:', error));
    }, []);

    // The state will store the current kiosk page the customer is currently utilizing.
    const [currentKioskPage, setCurrentKioskPage] = useState("popular_page_kiosk");

    // The state will store the current checkout button on the customer kisok.
    const [currentCheckoutButton, setCurrentCheckoutButton] = useState("display_checkout_button");

    // The state will store a list of items in the current transaction.
    const [transactionItemList, setTransactionItemList] = useState([]);

    // The state will store the total cost of the current transaction.
    const [totalCost, setTotalCost] = useState(0);

    // The state will keep track of the number of items that are being ordered.
    const [transactionNumber, setTransactionNumber] = useState(0);

    // The state will store the customer's payment method.
    const [customerPaymentMethod, setCustomerPaymentMethod] = useState("");

    // The state will store the customer's name.
    const [customerName, setCustomerName] = useState("");

    // The state will store the most recent customer order number.
    const [customerKioskNumber, setCustomerKioskNumber] = useState(0);

    // The button will go to the employee login page.
    function EmployeeLoginButton() {
        function handleClick() {
            window.location.href = "Login";
        }
        
        return (
            <button id="Login" className="employee_login_button_design" onClick={handleClick}>Employee Login</button>
        );
    }

    // The function will count the number of commas in a string.
    function countCommas(inputString) {
        let numberOfCommas = 0;

        // The code will count the commas in the string.
        for (let i = 0; i < inputString.length; i++) {
            if (inputString.at(i) == ',') {
                numberOfCommas++;
            }
        }

        return numberOfCommas;
    }

    // The function will remove a combo transaction item from the customer's order if he or she did not complete it.
    function removeIncompleteComboOrder() {
        // The code will remove a combo transaction item from the customer's order if he or she did not complete it.
        if (transactionItemList.length != 0) {
            // The code is checking if the combo type is a bowl.
            if (transactionItemList.at(transactionItemList.length - 1).at(0).at(0) === "Bowl") {
                if (countCommas(transactionItemList.at(transactionItemList.length - 1).at(1).at(0)) < 1) {
                    // Removing the item from the list
                    const updatedTransactionItemList = transactionItemList.filter(transaction => transaction !== transactionItemList.at(transactionItemList.length - 1));
                    setTransactionItemList(updatedTransactionItemList);
                }
            }

            // The code is checking if the combo type is a plate.
            else if (transactionItemList.at(transactionItemList.length - 1).at(0).at(0) === "Plate") {
                if (countCommas(transactionItemList.at(transactionItemList.length - 1).at(1).at(0)) < 2) {
                    // Removing the item from the list
                    const updatedTransactionItemList = transactionItemList.filter(transaction => transaction !== transactionItemList.at(transactionItemList.length - 1));
                    setTransactionItemList(updatedTransactionItemList);
                }
            }

            // The code is checking if the combo type is a bigger plate.
            else if (transactionItemList.at(transactionItemList.length - 1).at(0).at(0) === "Bigger Plate") {
                if (countCommas(transactionItemList.at(transactionItemList.length - 1).at(1).at(0)) < 3) {
                    // Removing the item from the list
                    const updatedTransactionItemList = transactionItemList.filter(transaction => transaction !== transactionItemList.at(transactionItemList.length - 1));
                    setTransactionItemList(updatedTransactionItemList);
                }
            }
        }
    }

    // The button will navigate to different sections of the kiosk.
    function SideButton({buttonName, className}) {
        function handleClick() {
            // The code will hide the current kiosk page.
            const currentPage = document.querySelector("." + currentKioskPage);
            currentPage.style.display = 'none';

            // The code will visually show the new kiosk page.
            const newPage = document.querySelector("." + className);
            newPage.style.display = 'contents';

            // The code will store the new kiosk page as the current kiosk page.
            setCurrentKioskPage(className);

            // The code will revert the normal checkout button if the proceed to payment method button is visible.
            if (currentCheckoutButton === "display_proceed_to_payment_method_button") {
                // The code will hide the proceed to payment method button.
                const proceedToPaymentMethodButton = document.querySelector("." + currentCheckoutButton);
                proceedToPaymentMethodButton.style.display = 'none';

                // The code will visually show the checkout button.
                const checkoutButton = document.querySelector(".display_checkout_button");
                checkoutButton.style.display = 'contents';

                // The code will store the checkout button as the current checkout button.
                setCurrentCheckoutButton("display_checkout_button");
            }
            
            // The code will remove a combo transaction item from the customer's order if he or she did not complete it.
            removeIncompleteComboOrder();
        }

        return (
            <button class="side_button_design" onClick={handleClick}>{buttonName}</button>
        );
    }

    // The button will add a menu item to the customer's order.
    function MenuItemButton({menuItemName}) {
        function handleClick() {
            // The code will update the transaction number.
            setTransactionNumber(transactionNumber + 1);

            //handleQuery("UPDATE inventory SET quantity = 27000 WHERE productname = 'Water Cup';");
            if ((menuItemName === "Bowl") || (menuItemName === "Plate") || (menuItemName === "Bigger Plate")) {
                prices.map((menuItem) => {
                    if (menuItem.productname === menuItemName) {
                        // Adding a bowl, plate, or bigger plate to the transaction item list
                        transactionItemList.push([[menuItemName], [""], [menuItem.cost], [transactionNumber]]);

                        // The code will hide the current kiosk page.
                        const currentPage = document.querySelector("." + currentKioskPage);
                        currentPage.style.display = 'none';

                        // The code will visually show the new kiosk page.
                        const newPage = document.querySelector(".first_entree_combo_kiosk");
                        newPage.style.display = 'contents';

                        // The code will store the new kiosk page as the current kiosk page.
                        setCurrentKioskPage("first_entree_combo_kiosk");
                    }
                })
            }
            else {
                // Adding the item to the inventory page
                prices.map((menuItem) => {
                    if (menuItem.productname === menuItemName) {
                        // Adding the product name to the transaction item list
                        transactionItemList.push([["A La Carte"], [menuItem.productname], [menuItem.cost], [transactionNumber]]);

                        // Adding the price of the item to the current total
                        let newCurrentTotal = totalCost + menuItem.cost;
                        setTotalCost(parseFloat(newCurrentTotal.toFixed(2)));
                    }
                })

                // Changing the page back to the popular items page

                // The code will hide the current kiosk page.
                const currentPage = document.querySelector("." + currentKioskPage);
                currentPage.style.display = 'none';

                // The code will visually show the new kiosk page.
                const newPage = document.querySelector(".popular_page_kiosk");
                newPage.style.display = 'contents';

                // The code will store the new kiosk page as the current kiosk page.
                setCurrentKioskPage("popular_page_kiosk");
            }
        }

        return (
            <button class="menu_item_button_design" onClick={handleClick}>{menuItemName}</button>
        );
    }

    // The button will add the first entree to the customer's combo order.
    function FirstEntreeComboButton({menuItemName}) {
        function handleClick() {
            // Changing the page based on the type of combo.
            if (transactionItemList.at(transactionItemList.length - 1).at(0).at(0) === "Bowl") {
                // Change the page to the side page

                // The code will hide the current kiosk page.
                const currentPage = document.querySelector("." + currentKioskPage);
                currentPage.style.display = 'none';

                // The code will visually show the new kiosk page.
                const newPage = document.querySelector(".side_combo_kiosk");
                newPage.style.display = 'contents';

                // The code will store the new kiosk page as the current kiosk page.
                setCurrentKioskPage("side_combo_kiosk");
            }
            else {
                // Change the page to the second entree page.

                // The code will hide the current kiosk page.
                const currentPage = document.querySelector("." + currentKioskPage);
                currentPage.style.display = 'none';

                // The code will visually show the new kiosk page.
                const newPage = document.querySelector(".second_entree_combo_kiosk");
                newPage.style.display = 'contents';

                // The code will store the new kiosk page as the current kiosk page.
                setCurrentKioskPage("second_entree_combo_kiosk");
            }

            // The code adds the menu item to the order.
            transactionItemList[transactionItemList.length - 1][1][0] = transactionItemList.at(transactionItemList.length - 1).at(1).at(0).concat(menuItemName);

            // The code will check if the entree item has a premium.
            prices.map((menuItem => {
                if (menuItem.productname === menuItemName) {
                    if (menuItem.premium === 1) {
                        transactionItemList[transactionItemList.length - 1][2][0] = transactionItemList.at(transactionItemList.length - 1).at(2).at(0) + 1.5;
                    }
                }
            }))
        }

        return (
            <button class="menu_item_button_design" onClick={handleClick}>{menuItemName}</button>
        );
    }

    // The button will add the second entree to the customer's combo order.
    function SecondEntreeComboButton({menuItemName}) {
        function handleClick() {
            // Changing the page based on the type of combo.
            if (transactionItemList.at(transactionItemList.length - 1).at(0).at(0) === "Plate") {
                // Change the page to the side page

                // The code will hide the current kiosk page.
                const currentPage = document.querySelector("." + currentKioskPage);
                currentPage.style.display = 'none';

                // The code will visually show the new kiosk page.
                const newPage = document.querySelector(".side_combo_kiosk");
                newPage.style.display = 'contents';

                // The code will store the new kiosk page as the current kiosk page.
                setCurrentKioskPage("side_combo_kiosk");
            }
            else {
                // Change the page to the third entree page.

                // The code will hide the current kiosk page.
                const currentPage = document.querySelector("." + currentKioskPage);
                currentPage.style.display = 'none';

                // The code will visually show the new kiosk page.
                const newPage = document.querySelector(".third_entree_combo_kiosk");
                newPage.style.display = 'contents';

                // The code will store the new kiosk page as the current kiosk page.
                setCurrentKioskPage("third_entree_combo_kiosk");
            }

            // The code adds the menu item to the order.
            transactionItemList[transactionItemList.length - 1][1][0] = transactionItemList.at(transactionItemList.length - 1).at(1).at(0).concat(", " + menuItemName);

            // The code will check if the entree item has a premium.
            prices.map((menuItem => {
                if (menuItem.productname === menuItemName) {
                    if (menuItem.premium === 1) {
                        transactionItemList[transactionItemList.length - 1][2][0] = transactionItemList.at(transactionItemList.length - 1).at(2).at(0) + 1.5;
                    }
                }
            }))
        }

        return (
            <button class="menu_item_button_design" onClick={handleClick}>{menuItemName}</button>
        );
    }

    // The button will add the third entree to the customer's combo order.
    function ThirdEntreeComboButton({menuItemName}) {
        function handleClick() {
            // Change the page to the side page

            // The code will hide the current kiosk page.
            const currentPage = document.querySelector("." + currentKioskPage);
            currentPage.style.display = 'none';

            // The code will visually show the new kiosk page.
            const newPage = document.querySelector(".side_combo_kiosk");
            newPage.style.display = 'contents';

            // The code will store the new kiosk page as the current kiosk page.
            setCurrentKioskPage("side_combo_kiosk");

            // The code adds the menu item to the order.
            transactionItemList[transactionItemList.length - 1][1][0] = transactionItemList.at(transactionItemList.length - 1).at(1).at(0).concat(", " + menuItemName);

            // The code will check if the entree item has a premium.
            prices.map((menuItem => {
                if (menuItem.productname === menuItemName) {
                    if (menuItem.premium === 1) {
                        transactionItemList[transactionItemList.length - 1][2][0] = transactionItemList.at(transactionItemList.length - 1).at(2).at(0) + 1.5;
                    }
                }
            }))
        }

        return (
            <button class="menu_item_button_design" onClick={handleClick}>{menuItemName}</button>
        );
    }

    // The button will add the side to the customer's combo order.
    function SideComboButton({menuItemName}) {
        function handleClick() {
            // Change the page to the popular items page

            // The code will hide the current kiosk page.
            const currentPage = document.querySelector("." + currentKioskPage);
            currentPage.style.display = 'none';

            // The code will visually show the new kiosk page.
            const newPage = document.querySelector(".popular_page_kiosk");
            newPage.style.display = 'contents';

            // The code will store the new kiosk page as the current kiosk page.
            setCurrentKioskPage("popular_page_kiosk");

            // The code adds the menu item to the order.
            transactionItemList[transactionItemList.length - 1][1][0] = transactionItemList.at(transactionItemList.length - 1).at(1).at(0).concat(", " + menuItemName);

            // The code adds the price of the combo to the current total.
            let newCurrentTotal = totalCost + transactionItemList.at(transactionItemList.length - 1).at(2).at(0);
            setTotalCost(parseFloat(newCurrentTotal.toFixed(2)));
        }

        return (
            <button class="menu_item_button_design" onClick={handleClick}>{menuItemName}</button>
        );
    }

    // The button will delete an ordered item from the customer's transaction item list.
    function DeleteItemButton({transactionNumberInfo}) {
        function handleClick() {
            // The code is going to delete the transaction from the transaction item list.
            for (let i = 0; i < transactionItemList.length; i++) {
                if (transactionItemList.at(i).at(3).at(0) === transactionNumberInfo) {
                    // Updating the current total
                    let newCurrentCost = totalCost - transactionItemList.at(i).at(2).at(0);
                    setTotalCost(parseFloat(newCurrentCost.toFixed(2)));

                    // Removing the item from the list
                    const updatedTransactionItemList = transactionItemList.filter(transaction => transaction !== transactionItemList.at(i));
                    setTransactionItemList(updatedTransactionItemList);
                }
            }
        }

        return (
            <button onClick={handleClick}>X</button>
        );
    }

    // The button will go to the checkout page.
    function CheckoutButton() {
        function handleClick() {
            // The code will remove a combo transaction item from the customer's order if he or she did not complete it.
            removeIncompleteComboOrder();

            // The code will hide the current kiosk page.
            const currentPage = document.querySelector("." + currentKioskPage);
            currentPage.style.display = 'none';

            if (transactionItemList.length != 0) {
                // The code will visually show the checkout page.
                const checkoutPage = document.querySelector(".checkout_page_kiosk");
                checkoutPage.style.display = 'contents';

                // The code will store the checkout page as the current kiosk page.
                setCurrentKioskPage("checkout_page_kiosk");

                // The code will hide the current checkout button.
                const checkoutButton = document.querySelector("." + currentCheckoutButton);
                checkoutButton.style.display = 'none';

                // The code will visually show the proceed to payment method button.
                const proceedToPaymentMethodButton = document.querySelector(".display_proceed_to_payment_method_button");
                proceedToPaymentMethodButton.style.display = 'contents';

                // The code will store the proceed to payment method button as the current checkout button.
                setCurrentCheckoutButton("display_proceed_to_payment_method_button");
            }
            else {
                // The code will visually show the empty checkout page.
                const emptyCheckoutPage = document.querySelector(".empty_checkout_page_kiosk");
                emptyCheckoutPage.style.display = 'contents';

                // The code will store the empty checkout page as the current kiosk page.
                setCurrentKioskPage("empty_checkout_page_kiosk");
            }
        }

        return (
            <button class="checkout_button_design" onClick={handleClick}>Checkout</button>
        );
    }

    // The button will go to the payment method page.
    function ProceedToPaymentMethodButton() {
        function handleClick() {
            // The code will hide the main kiosk display.
            const currentPage = document.querySelector(".row_property");
            currentPage.style.display = 'none';

            // The code will visually show the payment method page.
            const paymentMethodPage = document.querySelector(".display_payment_method_page");
            paymentMethodPage.style.display = 'contents';
        }

        return (
            <button class="checkout_button_design" onClick={handleClick}>Proceed To Payment Method</button>
        )
    }

    // The button will select a payment method for the user.
    function PaymentMethodButton({paymentMethod}) {
        function handleClick() {
            // The code will store the customer's chose payment method.
            setCustomerPaymentMethod(paymentMethod);

            // The code will change the current page to the customer information page.

            // The code will hide the payment method page.
            const paymentMethodPage = document.querySelector(".display_payment_method_page");
            paymentMethodPage.style.display = 'none';

            // The code will visually show the customer information page.
            const customerInfoPage = document.querySelector(".display_customer_information_page");
            customerInfoPage.style.display = 'contents';
        }

        return (
            <button class="payment_method_button_design" onClick={handleClick}>{paymentMethod}</button>
        )
    }

    // The code will store the customer's name into the state.
    const changeCustomerName = (event) => {
        setCustomerName(event.target.value);
    }

    // The button will change the page to the checkout summary page.
    function FinalCheckoutButton() {
        function handleClick() {
            // The code will change the customer information page to the checkout summary page.

            // The code will hide the customer information page.
            const customerInfoPage = document.querySelector(".display_customer_information_page");
            customerInfoPage.style.display = 'none';

            // The code will visually show the checkout summary page.
            const checkoutSummaryPage = document.querySelector(".display_checkout_summary_page");
            checkoutSummaryPage.style.display = 'contents';
        }

        return (
            <button onClick={handleClick}>Final Checkout</button>
        );
    }

    // The button will either submit the customer's order or cancel the customer's order.
    function SubmitOrder({userDecision}) {
        function handleClick() {
            // The code will cancel the customer's order and return to the popular page.
            if (userDecision === "Cancel Order") {
                // The code will zero out all of the customer's order information.
                setCurrentKioskPage("popular_page_kiosk");
                setCurrentCheckoutButton("display_checkout_button");
                setTransactionItemList([]);
                setTotalCost(0);
                setTransactionNumber(0);
                setCustomerPaymentMethod("");
                setCustomerName("");

                // The code will change the page back to the main kiosk page.

                // The code will hide the checkout summary page.
                const checkoutSummaryPage = document.querySelector(".display_checkout_summary_page");
                checkoutSummaryPage.style.display = 'none';

                // The code will show the main kiosk page.
                const mainKioskPage = document.querySelector(".row_property");
                mainKioskPage.style.display = 'flex';

                // The code will hide the checkout page.
                const checkoutPage = document.querySelector(".checkout_page_kiosk");
                checkoutPage.style.display = 'none';

                // The code will display the popular page.
                const popularPage = document.querySelector(".popular_page_kiosk");
                popularPage.style.display = 'contents';

                // The code will hide the proceed to payment button.
                const proceedToPaymentButton = document.querySelector(".display_proceed_to_payment_method_button");
                proceedToPaymentButton.style.display = 'none';

                // The code will display the checkout button.
                const checkoutButton = document.querySelector(".display_checkout_button");
                checkoutButton.style.display = 'contents';
            }

            // The code will submit the customer's order.
            else if (userDecision === "Submit Order") {
                // The code will get the next customer kiosk number.
                if (customerKioskNumber === 0) {
                    customerInformation.map((customer) => {
                        customerNumber++;
                    })
                }  

                // Handle database queries
                setCustomerKioskNumber(customerNumber);
                
                // Getting the current day and time
                const currentDateTime = new Date();

                const hours = currentDateTime.getHours();
                const minutes = currentDateTime.getMinutes();
                const seconds = currentDateTime.getSeconds();
                const formattedTime = hours + ":" + minutes + ":" + seconds;

                const year = currentDateTime.getFullYear();
                const month = currentDateTime.getMonth() + 1;
                const day = currentDateTime.getDate();
                const currentDate = year + "-" + month + "-" + day;
                
                // The code will store the customer's information into the database.
                const randomTransactionID = Math.floor(Math.random() * 90000000) + 10000000;
                
                let customerInfoQuery = "INSERT INTO customerinformation VALUES (\'" + customerName + "\'," + customerNumber + ",\'" + currentDate + "\');";
                handleQuery(customerInfoQuery);

                // The code will store the current transaction in the database.
                let productItems = "";
                for (let i = 0; i < transactionItemList.length; i++) {
                    if (i == (transactionItemList.length - 1)) {
                        productItems = productItems.concat(transactionItemList.at(i).at(1).at(0));
                    }
                    else {
                        productItems = productItems.concat(transactionItemList.at(i).at(1).at(0));
                        productItems = productItems.concat(", ");
                    }
                }

                let comboItems = "";
                for (let i = 0; i < transactionItemList.length; i++) {
                    if (i == (transactionItemList.length - 1)) {
                        comboItems = comboItems.concat(transactionItemList.at(i).at(0).at(0));
                    }
                    else {
                        comboItems = comboItems.concat(transactionItemList.at(i).at(0).at(0));
                        comboItems = comboItems.concat(", ");
                    }
                }

                let dailyTransactionQuery = "INSERT INTO dailytransactions VALUES (\'" + currentDate + "\',\'" + formattedTime + "\'," + randomTransactionID + ",\'" + customerPaymentMethod + "\'," + totalCost + ",\'" + comboItems + "\',\'" + productItems + "\',0);";
                handleQuery(dailyTransactionQuery);

                // Switch to the order confirmation page.

                // The code will hide the checkout summary page.
                const checkoutSummaryPage = document.querySelector(".display_checkout_summary_page");
                checkoutSummaryPage.style.display = 'none';

                // The code will visually show the order confirmation page.
                const orderConfirmationPage = document.querySelector(".display_order_confirmed_page");
                orderConfirmationPage.style.display = 'contents';

                customerNumber++;
            }
        }

        return (
            <button onClick={handleClick}>{userDecision}</button>
        )
    }

    // The button will return the user to the home page and reset the order information.
    function ReturnToHomeButton() {
        function handleClick() {
            // The code will zero out all of the customer's order information.
            setCurrentKioskPage("popular_page_kiosk");
            setCurrentCheckoutButton("display_checkout_button");
            setTransactionItemList([]);
            setTotalCost(0);
            setTransactionNumber(0);
            setCustomerPaymentMethod("");
            setCustomerName("");

            // The code will change the page back to the main kiosk page.

            // The code will hide the checkout summary page.
            const orderConfirmationPage = document.querySelector(".display_order_confirmed_page");
            orderConfirmationPage.style.display = 'none';

            // The code will show the main kiosk page.
            const mainKioskPage = document.querySelector(".row_property");
            mainKioskPage.style.display = 'flex';

            // The code will hide the checkout page.
            const checkoutPage = document.querySelector(".checkout_page_kiosk");
            checkoutPage.style.display = 'none';

            // The code will display the popular page.
            const popularPage = document.querySelector(".popular_page_kiosk");
            popularPage.style.display = 'contents';

            // The code will hide the proceed to payment button.
            const proceedToPaymentButton = document.querySelector(".display_proceed_to_payment_method_button");
            proceedToPaymentButton.style.display = 'none';

            // The code will display the checkout button.
            const checkoutButton = document.querySelector(".display_checkout_button");
            checkoutButton.style.display = 'contents';
        }   
        
        return (
            <button onClick={handleClick}>Return to the Home Page</button>
        )
    } 

    // The code will handle queries to the backend of the database (Thanks to Micah for the following code).
    function handleQuery(query) {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/executeQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error executing query:', error));
    }

    // Loading screen component
    const LoadingScreen = () => (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );

    // Displaying the webpage.
    return (
        <div>
            {/* Show loading screen while fetching data */}
            {loading ? (<LoadingScreen />) : ( <>
            {/* The heading of the customer kiosk. */}
            <header className="page_header">
                <p>Panda Express Kiosk</p>
            </header>
            <div class="row_property">
                {/* The left section of the customer kiosk that contains the side buttons to switch between sections. */}
                <div class="left_column">
                    <div><EmployeeLoginButton /></div>
                    <div><SideButton buttonName="Special/Popular" className="popular_page_kiosk" /></div>
                    <div><SideButton buttonName="Combos" className="combos_page_kiosk" /></div>
                    <div><SideButton buttonName="Entrees" className="entrees_page_kiosk" /></div>
                    <div><SideButton buttonName="Sides" className="sides_page_kiosk" /></div>
                    <div><SideButton buttonName="Appetizers" className="appetizers_page_kiosk" /></div>
                    <div><SideButton buttonName="Drinks" className="drinks_page_kiosk" /></div>
                </div>

                {/* The right section of the customer kisok that contains the different menu item sections. */}
                <div class="right_column">
                    <div class="popular_page_kiosk">
                        <div class="popular_page">
                            {/* The title of the popular section. */}
                            <div><p class="right_column_title">Popular</p></div>

                            {/* Popular items heading in the popular section. */}
                            <div><p class="in_text_headings">Popular Items</p></div>

                            {/* The buttons in the popular items section. */}
                            <div>
                                <MenuItemButton menuItemName="Orange Chicken" />
                                <MenuItemButton menuItemName="Grilled Teriyaki Chicken" />
                                <MenuItemButton menuItemName="Beijing Beef" />
                            </div>

                            {/* Seasonal items heading in the popular section. */}
                            <div><p class="in_text_headings">Seasonal Items</p></div>

                            {/* The buttons in the seasonal items section. */}
                            <div>
                                <MenuItemButton menuItemName="Hot Ones Blazing Bourbon Chicken" />
                                <MenuItemButton menuItemName="Pumpkin Spice Chicken" />
                            </div>
                        </div>
                    </div>
                    <div class="combos_page_kiosk">
                        <div class="combos_page">
                            {/* The title of the combos section. */}
                            <div><p class="right_column_title">Combos</p></div>

                            {/* The buttons in the combos section. */}
                            {prices.map((menuItem => {
                                if ((menuItem.entreenumber > 1) || (menuItem.productname === "Bowl")) {
                                    return (
                                        <MenuItemButton menuItemName={menuItem.productname}/>
                                    );
                                }
                            }))}
                        </div>
                    </div>
                    <div class="entrees_page_kiosk">
                        <div class="entrees_page">
                            {/* The title of the entrees section. */}
                            <div><p class="right_column_title">Entrees</p></div>

                            {/* The buttons in the entrees section. */}
                            {prices.map((menuItem => {
                                if ((menuItem.entreenumber === 1) && (menuItem.productname !== "Bowl")) {
                                    return (
                                        <MenuItemButton menuItemName={menuItem.productname}/>
                                    );
                                }
                            }))}
                        </div>
                    </div>
                    <div class="appetizers_page_kiosk">
                        <div class="appetizers_page">
                            {/* The title of the appetizers section. */}
                            <div><p class="right_column_title">Appetizers</p></div>

                            {/* The buttons in the appetizers section. */}
                            {prices.map((menuItem => {
                                if (menuItem.appetizernumber === 1) {
                                    return (
                                        <MenuItemButton menuItemName={menuItem.productname}/>
                                    );
                                }
                            }))}
                        </div>
                    </div>
                    <div class="drinks_page_kiosk">
                        <div class="drinks_page">
                            {/* The title of the drinks section. */}
                            <div><p class="right_column_title">Drinks</p></div>

                            {/* The buttons in the drinks section. */}
                            {prices.map((menuItem) => {
                                if (menuItem.drinknumber === 1) {
                                    return (
                                        <MenuItemButton menuItemName={menuItem.productname}/>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <div class="sides_page_kiosk">
                        <div class="sides_page">
                            {/* The title of the sides section. */}
                            <div><p class="right_column_title">Sides</p></div>

                            {/* The buttons in the sides section. */}
                            {prices.map((menuItem) => {
                                if ((menuItem.sidenumber === 1) && (menuItem.productname !== "Bowl")
                                    && (menuItem.productname !== "Plate") && (menuItem.productname !== "Bigger Plate")) {
                                    return (
                                        <MenuItemButton menuItemName={menuItem.productname}/>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <div class="first_entree_combo_kiosk">
                        <div class="entrees_page">
                            {/* The title of the first entree page when the customer orders a combo. */}
                            <div><p class="right_column_title">Choose Your First Entree</p></div>

                            {/* The buttons for the customers to press, so they can choose their first entree for their combo */}
                            {prices.map((menuItem => {
                                if ((menuItem.entreenumber === 1) && (menuItem.productname !== "Bowl")) {
                                    return (
                                        <FirstEntreeComboButton menuItemName={menuItem.productname}/>
                                    );
                                }
                            }))}
                        </div>
                    </div>
                    <div class="second_entree_combo_kiosk">
                        <div class="entrees_page">
                            {/* The title of the second entree page when the customer orders a combo. */}
                            <div><p class="right_column_title">Choose Your Second Entree</p></div>

                            {/* The buttons for the customers to press, so they can choose their second entree for their combo */}
                            {prices.map((menuItem => {
                                if ((menuItem.entreenumber === 1) && (menuItem.productname !== "Bowl")) {
                                    return (
                                        <SecondEntreeComboButton menuItemName={menuItem.productname}/>
                                    );
                                }
                            }))}
                        </div>
                    </div>
                    <div class="third_entree_combo_kiosk">
                        <div class="entrees_page">
                            {/* The title of the Third entree page when the customer orders a combo. */}
                            <div><p class="right_column_title">Choose Your Third Entree</p></div>

                            {/* The buttons for the customers to press, so they can choose their third entree for their combo */}
                            {prices.map((menuItem => {
                                if ((menuItem.entreenumber === 1) && (menuItem.productname !== "Bowl")) {
                                    return (
                                        <ThirdEntreeComboButton menuItemName={menuItem.productname}/>
                                    );
                                }
                            }))}
                        </div>
                    </div>
                    <div class="side_combo_kiosk">
                        <div class="sides_page">
                            {/* The title of the side page when the customer orders a combo. */}
                            <div><p class="right_column_title">Choose Your Side</p></div>

                            {/* The buttons for the customers to press, so they can choose their side for their combo. */}
                            {prices.map((menuItem) => {
                                if ((menuItem.sidenumber === 1) && (menuItem.productname !== "Bowl")
                                    && (menuItem.productname !== "Plate") && (menuItem.productname !== "Bigger Plate")) {
                                    return (
                                        <SideComboButton menuItemName={menuItem.productname}/>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <div class="checkout_page_kiosk">
                        <div class="checkout_page">
                            {/* The title of the checkout page. */}
                            <div><p class="right_column_title">Checkout</p></div>

                            {/* The table will display the customer's order */}
                            <div class="center_table">
                                <table class="design_table">
                                    {/* The table heading */}
                                    <thead>
                                        <tr>
                                            <th>Order Type</th>
                                            <th>Menu Items</th>
                                            <th>Cost</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactionItemList.map((orderedItem => (
                                            <tr>
                                                <td>{orderedItem.at(0).at(0)}</td>
                                                <td>{orderedItem.at(1).at(0)}</td>
                                                <td>{orderedItem.at(2).at(0)} $</td>
                                                <td><DeleteItemButton transactionNumberInfo={orderedItem.at(3).at(0)} /></td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* The kiosk will display an empty checkout page. */}
                    <div class="empty_checkout_page_kiosk">
                        <div class="empty_checkout_page">
                            <p>You have not added any items to your order</p>
                        </div>
                    </div>

                    <div class="row_property">
                        {/* The current total box at the bottom left of the kiosk page. */}
                        <div class="left_column_secondary">
                            <p>Current Total: {totalCost} $</p>
                        </div>

                        {/* The checkout button at the bottom right of the kiosk page. */}
                        <div class="right_column_secondary">
                            <div class="display_checkout_button">
                                <div><CheckoutButton /></div>
                            </div>
                            <div class="display_proceed_to_payment_method_button">
                                <div><ProceedToPaymentMethodButton /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The code displays the payment method page. */}
            <div class="display_payment_method_page">
                <div class="payment_method_page">
                    <p class="payment_method_title">Choose a Payment Method</p>
                    <PaymentMethodButton paymentMethod={"Debit"} />
                    <PaymentMethodButton paymentMethod={"Credit"} />
                    <PaymentMethodButton paymentMethod={"Dining Dollars"} />
                    <PaymentMethodButton paymentMethod={"Cash"} />
                </div>
            </div>

            {/* The code displays the customer information page. */}
            <div class="display_customer_information_page">
                <div class="customer_information_page">
                    <p class="customer_information_title">Customer Information</p>
                    <p>Name for the order: <input type="text" onChange={changeCustomerName} value={customerName} /></p>
                    <FinalCheckoutButton />
                </div>
            </div>

            {/* The code displays the checkout summary page. */}
            <div class="display_checkout_summary_page">
                <div class="checkout_summary_page">
                    <p>Checkout Summary</p>

                    {/* The table will display the customer's order */}
                    <div class="center_table">
                        <table class="design_table">
                            {/* The table heading */}
                            <thead>
                                <tr>
                                    <th>Order Type</th>
                                    <th>Menu Items</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionItemList.map((orderedItem => (
                                    <tr>
                                        <td>{orderedItem.at(0).at(0)}</td>
                                        <td>{orderedItem.at(1).at(0)}</td>
                                        <td>{orderedItem.at(2).at(0)} $</td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>

                    <p>Total Cost: {totalCost} $</p>
                    <p>Payment Method: {customerPaymentMethod}</p>
                    <p>Name: {customerName}</p>
                    <SubmitOrder userDecision={"Submit Order"} />
                    <SubmitOrder userDecision={"Cancel Order"} />
                </div>
            </div>

            {/* The code displays the order confirmed page */}
            <div class="display_order_confirmed_page">
                <div class="order_confirmed_page">
                    <p>Order Confirmed</p>
                    <p>Your Order Number is {customerKioskNumber}</p>
                    <ReturnToHomeButton />
                </div>
            </div>
            </>
            )}
        </div>
    )
}