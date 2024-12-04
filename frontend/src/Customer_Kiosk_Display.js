import React, { useEffect, useState, useRef } from 'react';
import './Customer_Kiosk_Display.css';
import axios from 'axios';

// The variable will keep track of the current customer kiosk number.
var customerNumber = 0;

// The variable stores the current language.
var currentLanguage = "English";

// The variable will determine the price modifier.
var dynamicPriceModifier = 0;

// The map will store the inventory item quantities.
const inventoryItemsQuantityMap = new Map([]);
var inventoryItemsQuantityMapPopulated = false;

// The map will store the menu match table.
const menuMatchMap = new Map([]);
var menuMatchMapPopulated = false;

/**
 * The function will display a functional customer kiosk for Panda Express.
 * 
 * @returns {*} The function returns a webpage displaying the customer kiosk for Panda Express.
 */
export function CustomerKioskDisplay() {
    // The state will store the prices data
    const [prices, setPrices] = useState([]);

    // The state will store the menumatch data
    const [menuMatch, setMenuMatch] = useState([]);

    // The state will store the customerInformation data.
    const [customerInformation, setCustomerInformation] = useState([]);

    // The state will store the inventory data.
    const [inventoryData, setInventoryData] = useState([]);

    // The state will get the dynamic pricing data.
    const [dynamicPricingData, setDynamicPricingData] = useState([]);

    // The state to track loading status
    const [loading, setLoading] = useState(true); // Loading is true initially

    // The state to track the error message
    const [error, setError] = useState(null); // Tracks error state

    // The state to track is there is an error connecting to backend
    const [isError, setIsError] = useState(false); // Tracks error state

    /* 
        Try and access the backend and show a loading screen while waiting
        If it cannot connect, show an error screen 
    */
    useEffect(() => {
        const hasVisited = sessionStorage.getItem('visited');
    
        if (!hasVisited) {
          // If first visit, show loading screen and fetch data
          fetch('https://panda-express-pos-backend-nc89.onrender.com/api/Prices')
            .then((response) => response.json())
            .then((data) => {
              if (dynamicPricingData != []) {
                setLoading(false);
                setIsError(false);
                sessionStorage.setItem('visited', 'true'); // Mark session as visited
              }
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              setError("Could not connect to the backend. Please try again later."); // Set error message
              setIsError(true);
              setLoading(false);
            });
        } else {
          // Not first visit, set loading state to false immediately
          setLoading(false);
          setIsError(false);
        }
      }, []);

    // Fetching the prices data from the backend
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/Prices')
            .then(response => response.json())
            .then(data => setPrices(data.prices))
            .catch(error => console.error('Error fetching prices data:', error));
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

    // Fetching the inventory data from the backend
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/InventoryData')
            .then(response => response.json())
            .then(data => setInventoryData(data.inventory))
            .catch(error => console.error('Error fetching inventory data:', error));
    }, []);

    // Fetching the dynamic prices arrays.
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/DynamicPricingTotalSales')
            .then(response => response.json())
            .then(data => setDynamicPricingData([data.times, data.sales, data.rankings, data.priceMods]))
            .catch(error => console.error('Error fetching Dynamic Pricing Total Sales:', error));
    }, []);

    // The code will get the current hour of the day.
    let currentHour = new Date().getHours();
    let currentHourStr = currentHour.toString().concat(":00:00");

    // The code will set the current dynamic pricing modifier.
    try {
        for (let i = 0; i < dynamicPricingData[0].length; i++) {
            if (currentHourStr == dynamicPricingData[0][i]) {
                dynamicPriceModifier = dynamicPricingData[3][i];
            }
        }
    }
    catch (error) {
        console.log("Error with the array not fully retrieving data: ", error);
    }

    // The state will store the current kiosk page the customer is currently utilizing.
    const [currentKioskPage, setCurrentKioskPage] = useState("popular_page_kiosk");

    // The state will store the current checkout button on the customer kisok.
    const [currentCheckoutButton, setCurrentCheckoutButton] = useState("display_checkout_button");

    // The state will store a list of items in the current transaction.
    const [transactionItemList, setTransactionItemList] = useState([]);
    const [transactionItemListDisplay, setTransactionItemListDisplay] = useState([]);

    // The state will store the total cost of the current transaction.
    const [totalCost, setTotalCost] = useState(0);

    // The state will keep track of the number of items that are being ordered.
    const [transactionNumber, setTransactionNumber] = useState(0);

    // The states will store the customer's payment method.
    const [customerPaymentMethod, setCustomerPaymentMethod] = useState("");
    const [customerPaymentMethodTranslation, setCustomerPaymentMethodTranslation] = useState("");

    // The state will store the customer's name.
    const [customerName, setCustomerName] = useState("");

    // The state will store the most recent customer order number.
    const [customerKioskNumber, setCustomerKioskNumber] = useState(0);

    // The following states store the text in the program
    const [employeeLoginTextEnglish, setEmployeeLoginTextEnglish] = useState("Employee Login");
    const [employeeLoginTextTranslation, setEmployeeLoginTextTranslation] = useState("Employee Login");

    const [popularButtonTextEnglish, setPopularButtonTextEnglish] = useState("Popular/Seasonal");
    const [popularButtonTextTranslation, setPopularButtonTextTranslation] = useState("Popular/Seasonal");

    const [combosButtonTextEnglish, setCombosButtonTextEnglish] = useState("Combos");
    const [combosButtonTextTranslation, setCombosButtonTextTranslation] = useState("Combos");

    const [entreesButtonTextEnglish, setEntreesButtonTextEnglish] = useState("Entrees");
    const [entreesButtonTextTranslation, setEntreesButtonTextTranslation] = useState("Entrees");

    const [sidesButtonTextEnglish, setSidesButtonTextEnglish] = useState("Sides");
    const [sidesButtonTextTranslation, setSidesButtonTextTranslation] = useState("Sides");

    const [appetizersButtonTextEnglish, setAppetizersButtonTextEnglish] = useState("Appetizers");
    const [appetizersButtonTextTranslation, setAppetizersButtonTextTranslation] = useState("Appetizers");

    const [drinksButtonTextEnglish, setDrinksButtonTextEnglish] = useState("Drinks");
    const [drinksButtonTextTranslation, setDrinksButtonTextTranslation] = useState("Drinks");

    const [kioskHeadingTextEnglish, setKioskHeadingTextEnglish] = useState("Panda Express Kiosk");
    const [kisokHeadingTextTranslation, setKisokHeadingTextTranslation] = useState("Panda Express Kiosk");

    const [popularMenuItemsTitleEnglish, setPopularMenuItemsTitleEnglish] = useState("Popular Menu Items");
    const [popularMenuItemsTitleTranslation, setPopularMenuItemsTitleTranslation] = useState("Popular Menu Items");

    const [popularMenuItemsHeadingEnglish, setPopularMenuItemsHeadingEnglish] = useState("Popular Items");
    const [popularMenuItemsHeadingTranslation, setPopularMenuItemsHeadingTranslation] = useState("Popular Items");

    const [seasonalMenuItemsHeadingEnglish, setSeasonalMenuItemsHeadingEnglish] = useState("Seasonal Items");
    const [seasonalMenuItemsHeadingTranslation, setSeasonalMenuItemsHeadingTranslation] = useState("Seasonal Items");

    const [popularItemsPageOrangeChickenEnglish, setPopularItemsPageOrangeChickenEnglish] = useState("Orange Chicken");
    const [popularItemsPageOrangeChickenTranslation, setPopularItemsPageOrangeChickenTranslation] = useState("Orange Chicken");

    const [popularItemsPageTeriyakiChickenEnglish, setPopularItemsPageTeriyakiChickenEnglish] = useState("Grilled Teriyaki Chicken");
    const [popularItemsPageTeriyakiChickenTranslation, setPopularItemsPageTeriyakiChickenTranslation] = useState("Grilled Teriyaki Chicken");

    const [popularItemsPageBeijingBeefEnglish, setPopularItemsPageBeijingBeefEnglish] = useState("Beijing Beef");
    const [popularItemsPageBeijingBeefTranslation, setPopularItemsPageBeijingBeefTranslation] = useState("Beijing Beef");

    const [popularItemsPageHotOnesEnglish, setPopularItemsPageHotOnesEnglish] = useState("Hot Ones Blazing Bourbon Chicken");
    const [popularItemsPageHotOnesTranslation, setPopularItemsPageHotOnesTranslation] = useState("Hot Ones Blazing Bourbon Chicken");

    const [combosFirstEntreeTitleEnglish, setCombosFirstEntreeTitleEnglish] = useState("Choose Your First Entree");
    const [combosFirstEntreeTitleTranslation, setCombosFirstEntreeTitleTranslation] = useState("Choose Your First Entree");

    const [combosSecondEntreeTitleEnglish, setCombosSecondEntreeTitleEnglish] = useState("Choose Your Second Entree");
    const [combosSecondEntreeTitleTranslation, setCombosSecondEntreeTitleTranslation] = useState("Choose Your Second Entree");

    const [combosThirdEntreeTitleEnglish, setCombosThirdEntreeTitleEnglish] = useState("Choose Your Third Entree");
    const [combosThirdEntreeTitleTranslation, setCombosThirdEntreeTitleTranslation] = useState("Choose Your Third Entree");

    const [combosSideTitleEnglish, setCombosSideTitleEnglish] = useState("Choose Your Side");
    const [combosSideTitleTranslation, setCombosSideTitleTranslation] = useState("Choose Your Side");

    const [checkoutPageTitleEnglish, setCheckoutPageTitleEnglish] = useState("Checkout");
    const [checkoutPageTitleTranslation, setCheckoutPageTitleTranslation] = useState("Checkout");

    const [emptyCheckoutPageTitleEnglish, setEmptyCheckoutPageTitleEnglish] = useState("You have not added any items to your order");
    const [emptyCheckoutPageTitleTranslation, setEmptyCheckoutPageTitleTranslation] = useState("You have not added any items to your order");

    const [currentTotalTitleEnglish, setCurrentTotalTitleEnglish] = useState("Current Total:");
    const [currentTotalTitleTranslation, setCurrentTotalTitleTranslation] = useState("Current Total:");

    const [proceedToPaymentMethodTitleEnglish, setProceedToPaymentMethodTitleEnglish] = useState("Proceed To Payment Method");
    const [proceedToPaymentMethodTitleTranslation, setProceedToPaymentMethodTitleTranslation] = useState("Proceed To Payment Method");

    const [choosePaymentMethodTitleEnglish, setChoosePaymentMethodTitleEnglish] = useState("Choose a Payment Method");
    const [choosePaymentMethodTitleTranslation, setChoosePaymentMethodTitleTranslation] = useState("Choose a Payment Method");

    const [debitTitleEnglish, setDebitTitleEnglish] = useState("Debit");
    const [debitTitleTranslation, setDebitTitleTranslation] = useState("Debit");

    const [creditTitleEnglish, setCreditTitleEnglish] = useState("Credit");
    const [creditTitleTranslation, setCreditTitleTranslation] = useState("Credit");

    const [cashTitleEnglish, setCashTitleEnglish] = useState("Cash");
    const [cashTitleTranslation, setCashTitleTranslation] = useState("Cash");

    const [diningDollarsTitleEnglish, setDiningDollarsTitleEnglish] = useState("Dining Dollars");
    const [diningDollarsTitleTranslation, setDiningDollarsTitleTranslation] = useState("Dining Dollars");

    const [customerInformationTitleEnglish, setCustomerInformationTitleEnglish] = useState("Customer Information");
    const [customerInformationTitleTranslation, setCustomerInformationTitleTranslation] = useState("Customer Information");

    const [orderNameTitleEnglish, setOrderNameTitleEnglish] = useState("Name for the order:");
    const [orderNameTitleTranslation, setOrderNameTitleTranslation] = useState("Name for the order:");

    const [finalCheckoutButtonTitleEnglish, setFinalCheckoutButtonTitleEnglish] = useState("Final Checkout");
    const [finalCheckoutButtonTitleTranslation, setFinalCheckoutButtonTitleTranslation] = useState("Final Checkout");

    const [checkoutSummaryTitleEnglish, setCheckoutSummaryTitleEnglish] = useState("Checkout Summary");
    const [checkoutSummaryTitleTranslation, setCheckoutSummaryTitleTranslation] = useState("Checkout Summary");

    const [totalCostTitleEnglish, setTotalCostTitleEnglish] = useState("Total Cost:");
    const [totalCostTitleTranslation, setTotalCostTitleTranslation] = useState("Total Cost:");

    const [paymentMethodSummaryTitleEnglish, setPaymentMethodSummaryTitleEnglish] = useState("Payment Method:");
    const [paymentMethodSummaryTitleTranslation, setPaymentMethodSummaryTitleTranslation] = useState("Payment Method:");

    const [nameSummaryTitleEnglish, setNameSummaryTitleEnglish] = useState("Name:");
    const [nameSummaryTitleTranslation, setNameSummaryTitleTranslation] = useState("Name:");

    const [sumbitOrderButtonTitleEnglish, setSumbitOrderButtonTitleEnglish] = useState("Submit Order");
    const [sumbitOrderButtonTitleTranslation, setSumbitOrderButtonTitleTranslation] = useState("Submit Order"); 

    const [cancelOrderButtonTitleEnglish, setCancelOrderButtonTitleEnglish] = useState("Cancel Order");
    const [cancelOrderButtonTitleTranslation, setCancelOrderButtonTitleTranslation] = useState("Cancel Order");

    const [orderConfirmedTitleEnglish, setOrderConfirmedTitleEnglish] = useState("Order Confirmed");
    const [orderConfirmedTitleTranslation, setOrderConfirmedTitleTranslation] = useState("Order Confirmed");

    const [orderNumberTitleEnglish, setOrderNumberTitleEnglish] = useState("Your Order Number is");
    const [orderNumberTitleTranslation, setOrderNumberTitleTranslation] = useState("Your Order Number is");

    const [returnToHomePageTitleEnglish, setReturnToHomePageTitleEnglish] = useState("Return to the Home Page");
    const [returnToHomePageTitleTranslation, setReturnToHomePageTitleTranslation] = useState("Return to the Home Page");

    const [orderTypeTableEnglish, setOrderTypeTableEnglish] = useState("Order Type");
    const [orderTypeTableTranslation, setOrderTypeTableTranslation] = useState("Order Type");

    const [menuItemsTableEnglish, setMenuItemsTableEnglish] = useState("Menu Items");
    const [menuItemsTableTranslation, setMenuItemsTableTranslation] = useState("Menu Items");

    const [costTableEnglish, setCostTableEnglish] = useState("Cost");
    const [costTableTranslation, setCostTableTranslation] = useState("Cost");

    const [removeTableEnglish, setRemoveTableEnglish] = useState("Remove");
    const [removeTableTranslation, setRemoveTableTranslation] = useState("Remove");

    const [priceModifierTitleEnglish, setPriceModifierTitleEnglish] = useState("Price Modifier:");
    const [priceModifierTitleTranslation, setPriceModifierTitleTranslation] = useState("Price Modifier:");

    const [modifierTableTitleEnglish, setModifierTableTitleEnglish] = useState("Modifier");
    const [modifierTableTitleTranslation, setModifierTableTitleTranslation] = useState("Modifier");

    const [customerBackupNameEnglish, setCustomerBackupNameEnglish] = useState("Guest");
    const [customerBackupNameTranslation, setCustomerBackupNameTranslation] = useState("Guest");

    const [pricesMapTranslation, setPricesMapTranslation] = useState(new Map());
    
    if (currentLanguage === "English") {
        prices.map((menuItem => {
            pricesMapTranslation.set(menuItem.productname, menuItem.productname);
        }));
    }

    // The code is going to populate the inventory item map.
    if (inventoryItemsQuantityMapPopulated == false) {
        inventoryData.map((inventoryRow => {
            inventoryItemsQuantityMap.set(inventoryRow.productname, inventoryRow.quantity);
        }));

        if (inventoryItemsQuantityMap.size > 0) {
            inventoryItemsQuantityMapPopulated = true;
        }
    }

    // The code is going to populate the menu match map.
    if (menuMatchMapPopulated == false) {
        menuMatch.map((menuMatchRow => {
            // The code will put all of the menumatch inventory items into a list.
            var inventoryItemsList = menuMatchRow.inventoryitems.split(",");
            for (let i = 0; i < inventoryItemsList.length; i++) {
                if (i != 0) {
                    inventoryItemsList[i] = inventoryItemsList[i].replace(" ", "");
                }
            }

            menuMatchMap.set(menuMatchRow.menuitem, inventoryItemsList);
        }));
        
        if (menuMatchMap.size > 0) {
            menuMatchMapPopulated = true;
        }
    }

    /**
     * The function will create a button that will go to the employee login page.
     * 
     * @function EmployeeLoginButton
     * @returns {*} The function returns a button that will go to the employee login page when the user presses it.
     */
    function EmployeeLoginButton() {
        /**
         * @function handleClick
         * 
         * The function will switch the window to the employee login window.
         */
        function handleClick() {
            window.location.href = "Login";
        }
        
        return (
            <button id="Login" className="employee_login_button_design" onClick={handleClick}>{employeeLoginTextTranslation}</button>
        );
    }

    /**
     * The function will create a button that will translate the text on the customer kiosk from English to Spanish, and it will also translate the text
     * from Spanish to English.
     * 
     * @function TextTranslationButton
     * @param {String} language A specific language. The language parameter can only be "English" or "Spanish".
     * @returns The function returns a button that will will translate the text on the customer kiosk from English to Spanish and vice versa.
     */
    function TextTranslationButton({language}) {

        /**
         * The function will change the text on the customer kiosk
         * 
         * @function handleClick
         */
        async function handleClick() {
            if (language === "Spanish") {
                // The code will hide the spanish button.
                const spanishButton = document.querySelector(".spanish_button_kiosk");
                spanishButton.style.display = 'none';

                // The code will display the english button.
                const englishButton = document.querySelector(".english_button_kiosk");
                englishButton.style.display = 'contents';

                // The code translates the text on the kisok to spanish.
                let translatedTextEmployeeLoginButton = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: employeeLoginTextEnglish, language: "es"});
                setEmployeeLoginTextTranslation(translatedTextEmployeeLoginButton.data[0].translatedText);

                let translatedTextPopularButton = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: popularButtonTextEnglish, language: "es"});
                setPopularButtonTextTranslation(translatedTextPopularButton.data[0].translatedText);

                let translatedTextCombosButton = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: combosButtonTextEnglish, language: "es"});
                setCombosButtonTextTranslation(translatedTextCombosButton.data[0].translatedText);

                let translatedTextEntreesButton = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: entreesButtonTextEnglish, language: "es"});
                setEntreesButtonTextTranslation(translatedTextEntreesButton.data[0].translatedText);

                let translatedTextSidesButton = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: sidesButtonTextEnglish, language: "es"});
                setSidesButtonTextTranslation(translatedTextSidesButton.data[0].translatedText);

                let translatedTextAppetizersButton = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: appetizersButtonTextEnglish, language: "es"});
                setAppetizersButtonTextTranslation(translatedTextAppetizersButton.data[0].translatedText);

                let translatedTextDrinksButton = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: drinksButtonTextEnglish, language: "es"});
                setDrinksButtonTextTranslation(translatedTextDrinksButton.data[0].translatedText);

                let translatedTextKioskHeading = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: kioskHeadingTextEnglish, language: "es"});
                setKisokHeadingTextTranslation(translatedTextKioskHeading.data[0].translatedText);

                let translatedTextPopularMenuItemsTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: popularMenuItemsTitleEnglish, language: "es"});
                setPopularMenuItemsTitleTranslation(translatedTextPopularMenuItemsTitle.data[0].translatedText);

                let translatedTextPopularMenuItemsHeading = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: popularMenuItemsHeadingEnglish, language: "es"});
                setPopularMenuItemsHeadingTranslation(translatedTextPopularMenuItemsHeading.data[0].translatedText);

                let translatedTextSeasonalMenuItemsHeading = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: seasonalMenuItemsHeadingEnglish, language: "es"});
                setSeasonalMenuItemsHeadingTranslation(translatedTextSeasonalMenuItemsHeading.data[0].translatedText);

                let translatedPopularPageOrangeChicken = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: popularItemsPageOrangeChickenEnglish, language: "es"});
                setPopularItemsPageOrangeChickenTranslation(translatedPopularPageOrangeChicken.data[0].translatedText);

                let translatedPopularPageTeriyakiChicken = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: popularItemsPageTeriyakiChickenEnglish, language: "es"});
                setPopularItemsPageTeriyakiChickenTranslation(translatedPopularPageTeriyakiChicken.data[0].translatedText);

                let translatedPopularPageBeijingBeef = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: popularItemsPageBeijingBeefEnglish, language: "es"});
                setPopularItemsPageBeijingBeefTranslation(translatedPopularPageBeijingBeef.data[0].translatedText);

                let translatedPopularPageHotOnes = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: popularItemsPageHotOnesEnglish, language: "es"});
                setPopularItemsPageHotOnesTranslation(translatedPopularPageHotOnes.data[0].translatedText);

                let translatedCombosFirstEntree = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: combosFirstEntreeTitleEnglish, language: "es"});
                setCombosFirstEntreeTitleTranslation(translatedCombosFirstEntree.data[0].translatedText);

                let translatedCombosSecondEntree = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: combosSecondEntreeTitleEnglish, language: "es"});
                setCombosSecondEntreeTitleTranslation(translatedCombosSecondEntree.data[0].translatedText);

                let translatedCombosThirdEntree = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: combosThirdEntreeTitleEnglish, language: "es"});
                setCombosThirdEntreeTitleTranslation(translatedCombosThirdEntree.data[0].translatedText);

                let translatedCombosSide = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: combosSideTitleEnglish, language: "es"});
                setCombosSideTitleTranslation(translatedCombosSide.data[0].translatedText);

                let translatedCheckoutTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: checkoutPageTitleEnglish, language: "es"});
                setCheckoutPageTitleTranslation(translatedCheckoutTitle.data[0].translatedText);

                let translatedEmptyCheckoutTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: emptyCheckoutPageTitleEnglish, language: "es"});
                setEmptyCheckoutPageTitleTranslation(translatedEmptyCheckoutTitle.data[0].translatedText);

                let translatedCurrentTotalTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: currentTotalTitleEnglish, language: "es"});
                setCurrentTotalTitleTranslation(translatedCurrentTotalTitle.data[0].translatedText);

                let translatedProceedToPaymentMethodTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: proceedToPaymentMethodTitleEnglish, language: "es"});
                setProceedToPaymentMethodTitleTranslation(translatedProceedToPaymentMethodTitle.data[0].translatedText);

                let translatedChoosePaymentMethod = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: choosePaymentMethodTitleEnglish, language: "es"});
                setChoosePaymentMethodTitleTranslation(translatedChoosePaymentMethod.data[0].translatedText);

                let translatedDebitTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: debitTitleEnglish, language: "es"});
                setDebitTitleTranslation(translatedDebitTitle.data[0].translatedText);

                let translatedCreditTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: creditTitleEnglish, language: "es"});
                setCreditTitleTranslation(translatedCreditTitle.data[0].translatedText);

                let translatedCashTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: cashTitleEnglish, language: "es"});
                setCashTitleTranslation(translatedCashTitle.data[0].translatedText);

                let translatedDiningDollarsTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: diningDollarsTitleEnglish, language: "es"});
                setDiningDollarsTitleTranslation(translatedDiningDollarsTitle.data[0].translatedText);

                let translatedCustomerInformationTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: customerInformationTitleEnglish, language: "es"});
                setCustomerInformationTitleTranslation(translatedCustomerInformationTitle.data[0].translatedText);

                let translatedOrderNameTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: orderNameTitleEnglish, language: "es"});
                setOrderNameTitleTranslation(translatedOrderNameTitle.data[0].translatedText);

                let translatedFinalCheckoutButtonTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: finalCheckoutButtonTitleEnglish, language: "es"});
                setFinalCheckoutButtonTitleTranslation(translatedFinalCheckoutButtonTitle.data[0].translatedText);

                let translatedCheckoutSummaryTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: checkoutSummaryTitleEnglish, language: "es"});
                setCheckoutSummaryTitleTranslation(translatedCheckoutSummaryTitle.data[0].translatedText);

                let translatedTotalCostTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: totalCostTitleEnglish, language: "es"});
                setTotalCostTitleTranslation(translatedTotalCostTitle.data[0].translatedText);

                let translatedPaymentMethodSummary = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: paymentMethodSummaryTitleEnglish, language: "es"});
                setPaymentMethodSummaryTitleTranslation(translatedPaymentMethodSummary.data[0].translatedText);

                let translatedNameSummary = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: nameSummaryTitleEnglish, language: "es"});
                setNameSummaryTitleTranslation(translatedNameSummary.data[0].translatedText);

                let translatedSubmitOrderTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: sumbitOrderButtonTitleEnglish, language: "es"});
                setSumbitOrderButtonTitleTranslation(translatedSubmitOrderTitle.data[0].translatedText);

                let translatedCancelOrderTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: cancelOrderButtonTitleEnglish, language: "es"});
                setCancelOrderButtonTitleTranslation(translatedCancelOrderTitle.data[0].translatedText);

                let translatedOrderConfirmedTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: orderConfirmedTitleEnglish, language: "es"});
                setOrderConfirmedTitleTranslation(translatedOrderConfirmedTitle.data[0].translatedText);

                let translatedOrderNumberTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: orderNumberTitleEnglish, language: "es"});
                setOrderNumberTitleTranslation(translatedOrderNumberTitle.data[0].translatedText);

                let translatedReturnToHomePageTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: returnToHomePageTitleEnglish, language: "es"});
                setReturnToHomePageTitleTranslation(translatedReturnToHomePageTitle.data[0].translatedText);

                let translatedOrderTypeTable = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: orderTypeTableEnglish, language: "es"});
                setOrderTypeTableTranslation(translatedOrderTypeTable.data[0].translatedText);

                let translatedMenuItemsTable = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: menuItemsTableEnglish, language: "es"});
                setMenuItemsTableTranslation(translatedMenuItemsTable.data[0].translatedText);

                let translatedCostTable = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: costTableEnglish, language: "es"});
                setCostTableTranslation(translatedCostTable.data[0].translatedText);

                let translatedRemoveTable = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: removeTableEnglish, language: "es"});
                setRemoveTableTranslation(translatedRemoveTable.data[0].translatedText);

                let translatedPriceModifierTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: priceModifierTitleEnglish, language: "es"});
                setPriceModifierTitleTranslation(translatedPriceModifierTitle.data[0].translatedText);

                let translatedModifierTableTitle = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: modifierTableTitleEnglish, language: "es"});
                setModifierTableTitleTranslation(translatedModifierTableTitle.data[0].translatedText)

                let translatedCustomerBackupName = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: customerBackupNameEnglish, language: "es"});
                setCustomerBackupNameTranslation(translatedCustomerBackupName.data[0].translatedText);

                prices.map((async menuItem => {
                    let translatedTextMenuItem = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: menuItem.productname, language: "es"});
                    pricesMapTranslation.set(menuItem.productname, translatedTextMenuItem.data[0].translatedText);
                }))

                let temporaryList = [];
                await Promise.all(transactionItemList.map((async orderedItem => {
                    let comboTypeTranslated = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: orderedItem.at(0).at(0), language: "es"});
                    let menuItemsTranslated = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: orderedItem.at(1).at(0), language: "es"});

                    let translatedRow = [[comboTypeTranslated.data[0].translatedText], [menuItemsTranslated.data[0].translatedText], [orderedItem.at(2).at(0)], [orderedItem.at(3).at(0)]];

                    temporaryList.push(translatedRow);
                })));
                setTransactionItemListDisplay(temporaryList);

                currentLanguage = "Spanish";
            }
            else {
                // The code will hide the english button.
                const englishButton = document.querySelector(".english_button_kiosk");
                englishButton.style.display = 'none';

                // The code will display the spanish button.
                const spanishButton = document.querySelector(".spanish_button_kiosk");
                spanishButton.style.display = 'contents';

                // The code translates the text on the kiosk to english.
                setEmployeeLoginTextTranslation(employeeLoginTextEnglish);

                setPopularButtonTextTranslation(popularButtonTextEnglish);

                setCombosButtonTextTranslation(combosButtonTextEnglish);

                setEntreesButtonTextTranslation(entreesButtonTextEnglish);

                setSidesButtonTextTranslation(sidesButtonTextEnglish);

                setAppetizersButtonTextTranslation(appetizersButtonTextEnglish);

                setDrinksButtonTextTranslation(drinksButtonTextEnglish);

                setKisokHeadingTextTranslation(kioskHeadingTextEnglish);

                setPopularMenuItemsTitleTranslation(popularMenuItemsTitleEnglish);

                setPopularMenuItemsHeadingTranslation(popularMenuItemsHeadingEnglish);

                setSeasonalMenuItemsHeadingTranslation(seasonalMenuItemsHeadingEnglish);

                setPopularItemsPageOrangeChickenTranslation(popularItemsPageOrangeChickenEnglish);

                setPopularItemsPageTeriyakiChickenTranslation(popularItemsPageTeriyakiChickenEnglish);

                setPopularItemsPageBeijingBeefTranslation(popularItemsPageBeijingBeefEnglish);

                setPopularItemsPageHotOnesTranslation(popularItemsPageHotOnesEnglish);

                setCombosFirstEntreeTitleTranslation(combosFirstEntreeTitleEnglish);

                setCombosSecondEntreeTitleTranslation(combosSecondEntreeTitleEnglish);

                setCombosThirdEntreeTitleTranslation(combosThirdEntreeTitleEnglish);

                setCombosSideTitleTranslation(combosSideTitleEnglish);

                setCheckoutPageTitleTranslation(checkoutPageTitleEnglish);

                setEmptyCheckoutPageTitleTranslation(emptyCheckoutPageTitleEnglish);

                setCurrentTotalTitleTranslation(currentTotalTitleEnglish);

                setProceedToPaymentMethodTitleTranslation(proceedToPaymentMethodTitleEnglish);

                setChoosePaymentMethodTitleTranslation(choosePaymentMethodTitleEnglish);

                setDebitTitleTranslation(debitTitleEnglish);

                setCreditTitleTranslation(creditTitleEnglish);

                setCashTitleTranslation(cashTitleEnglish);

                setDiningDollarsTitleTranslation(diningDollarsTitleEnglish);

                setCustomerInformationTitleTranslation(customerInformationTitleEnglish);

                setOrderNameTitleTranslation(orderNameTitleEnglish);

                setFinalCheckoutButtonTitleTranslation(finalCheckoutButtonTitleEnglish);

                setCheckoutSummaryTitleTranslation(checkoutSummaryTitleEnglish);

                setTotalCostTitleTranslation(totalCostTitleEnglish);

                setPaymentMethodSummaryTitleTranslation(paymentMethodSummaryTitleEnglish);

                setNameSummaryTitleTranslation(nameSummaryTitleEnglish);

                setSumbitOrderButtonTitleTranslation(sumbitOrderButtonTitleEnglish);

                setCancelOrderButtonTitleTranslation(cancelOrderButtonTitleEnglish);

                setOrderConfirmedTitleTranslation(orderConfirmedTitleEnglish);

                setOrderNumberTitleTranslation(orderNumberTitleEnglish);

                setReturnToHomePageTitleTranslation(returnToHomePageTitleEnglish);

                setOrderTypeTableTranslation(orderTypeTableEnglish);

                setMenuItemsTableTranslation(menuItemsTableEnglish);

                setCostTableTranslation(costTableEnglish);

                setRemoveTableTranslation(removeTableEnglish);

                setPriceModifierTitleTranslation(priceModifierTitleEnglish);

                setModifierTableTitleTranslation(modifierTableTitleEnglish);

                setCustomerBackupNameTranslation(customerBackupNameEnglish);

                let temporaryList = [];
                transactionItemList.map((orderedItem => {
                    let translatedRow = [[orderedItem.at(0).at(0)], [orderedItem.at(1).at(0)], [orderedItem.at(2).at(0)], [orderedItem.at(3).at(0)]];
        
                    temporaryList.push(translatedRow);
                }));
                setTransactionItemListDisplay(temporaryList);

                currentLanguage = "English"
            }
        }

        return (
            <button class="text_translation_button_design" onClick={handleClick}>{language} Text</button>
        );
    }

    /**
     * The function will count the number of commas in a string.
     * 
     * @function countCommas
     * @param {String} inputString The parameter is a string that contains commas.
     * @returns The function returns the number of commas in the string as a Number data type.
     */
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

    /**
     * The function will remove a combo transaction item from the customer's order if he or she did not complete it.
     * 
     * @function removeIncompleteComboOrder
     */
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

    /**
     * The function will navigate to a different menu section in the customer kiosk for Panda Express.
     * 
     * @function SideButton
     * @param {String} buttonName The parameter is the name of the menu section that will be displayed on the button in the customer kiosk for Panda Express.
     * @param {String} className The parameter is the name of a CSS class for the specific menu section.
     * @returns The function returns a button that will change the menu section in the customer kiosk for Panda Express.
     */
    function SideButton({buttonName, className}) {

        /**
         * The function will change the menu section in the customer kiosk.
         * 
         * @function handleClick
         */
        function handleClick() {
            // The code will scroll to the top of the page.
            const rightColumnScrollable = document.querySelector(".right_column_scroll_page");
            rightColumnScrollable.scrollTo(0,0);

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

    /**
     * The function helps align the text on a menu item button.
     * 
     * @function ModifyMenuItemName
     * @param {String} menuItemNameToBeModified The parameter is the text on the button. 
     * @returns The function returns text that is suited to the button.
     */
    function ModifyMenuItemName({menuItemNameToBeModified}) {
        if (menuItemNameToBeModified.length <= 26) {
            return (
                <>
                    <div>{menuItemNameToBeModified}</div>
                    <br></br>
                </>
            );
        }
        else {
            return (
                <>
                    <div>{menuItemNameToBeModified}</div>
                </>
            )
        }
    }

    /**
     * The function will create a button for an item on the Panda Express menu, and it will add the item to a customer's order when it is pressed.
     * 
     * @function MenuItemButton
     * @param {String} menuItemName The name of the item on the Panda Express menu.
     * @param {String} menuItemNameDisplay The translated name of the item on the Panda Express menu that will be displayed on the button.
     * @returns The function returns a button that will allow a customer to add an item to their order.
     */
    function MenuItemButton({menuItemName, menuItemNameDisplay}) {
        // The code is going to store the image into a variable.
        var imageName = "/kiosk_pictures/" + menuItemName + ".png";

        /**
         * The function will add a menu item to a customer's order.
         * 
         * @function handleClick
         */
        function handleClick() {
            // The code will update the transaction number.
            setTransactionNumber(transactionNumber + 1);

            // The code will scroll to the top of the page.
            const rightColumnScrollable = document.querySelector(".right_column_scroll_page");
            rightColumnScrollable.scrollTo(0,0);

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
                        console.log(dynamicPriceModifier);
                        let newCurrentTotal = totalCost + menuItem.cost + dynamicPriceModifier;
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

        // The reference variable will access the image if a load image error occurs.
        const productPictureRef = useRef(null);

        /**
         * The function will handle image errors if an image does not exist. If an image does not exist, the function will set the
         * image to a standard no image available image.
         * 
         * @function handleImageError 
         */
        const handleImageError = () => {
            if (productPictureRef.current) {
                productPictureRef.current.src = "/kiosk_pictures/No_Image_Available.jpg";
            }
        };

        return (
            <button class="menu_item_button_design" onClick={handleClick}>
                <img alt={"The picture displays the " + menuItemName + " menu item."} ref={productPictureRef} src={imageName} width="200" height="200" onError={handleImageError} />

                <br></br>
                <ModifyMenuItemName menuItemNameToBeModified={menuItemNameDisplay} />
            </button>
        );
    }
    
    /**
     * The function will create a button that will display an entree menu item for the customer's first entree for a combo order.
     * 
     * @function FirstEntreeComboButton
     * @param {String} menuItemName The name of the item on the Panda Express menu.
     * @param {String} menuItemNameDisplay The translated name of the item on the Panda Express menu that will be displayed on the button.
     * @returns The function returns a button that will display a specific entree, and it will be added to a customer's combo when he or she clicks it.
     */
    function FirstEntreeComboButton({menuItemName, menuItemNameDisplay}) {
        // The code is going to store the image into a variable.
        var imageName = "/kiosk_pictures/" + menuItemName + ".png";

        /**
         * The function will add the menu item to the customer's combo order, and it will move to the next combo page.
         * 
         * @function handleClick
         */
        function handleClick() {
            // The code will scroll to the top of the page.
            const rightColumnScrollable = document.querySelector(".right_column_scroll_page");
            rightColumnScrollable.scrollTo(0,0);

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

        // The reference variable will access the image if a load image error occurs.
        const productPictureRef = useRef(null);

        /**
         * The function will handle image errors if an image does not exist. If an image does not exist, the function will set the
         * image to a standard no image available image.
         * 
         * @function handleImageError 
         */
        const handleImageError = () => {
            if (productPictureRef.current) {
                productPictureRef.current.src = "/kiosk_pictures/No_Image_Available.jpg";
            }
        };

        return (
            <button class="menu_item_button_design" onClick={handleClick}>
                <img alt={"The picture displays the " + menuItemName + " menu item."} ref={productPictureRef} src={imageName} width="200" height="200" onError={handleImageError} />
                <br></br>
                <ModifyMenuItemName menuItemNameToBeModified={menuItemNameDisplay} />
            </button>
        );
    }

    /**
     * The function will create a button that will display an entree menu item for the customer's second entree for a combo order.
     * 
     * @function SecondEntreeComboButton
     * @param {String} menuItemName The name of the item on the Panda Express menu.
     * @param {String} menuItemNameDisplay The translated name of the item on the Panda Express menu that will be displayed on the button.
     * @returns The function returns a button that will display a specific entree, and it will be added to a customer's combo when he or she clicks it.
     */
    function SecondEntreeComboButton({menuItemName, menuItemNameDisplay}) {
        // The code is going to store the image into a variable.
        var imageName = "/kiosk_pictures/" + menuItemName + ".png";

        /**
         * The function will add the menu item to the customer's combo order, and it will move to the next combo page.
         * 
         * @function handleClick
         */
        function handleClick() {
            // The code will scroll to the top of the page.
            const rightColumnScrollable = document.querySelector(".right_column_scroll_page");
            rightColumnScrollable.scrollTo(0,0);

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

        // The reference variable will access the image if a load image error occurs.
        const productPictureRef = useRef(null);

        /**
         * The function will handle image errors if an image does not exist. If an image does not exist, the function will set the
         * image to a standard no image available image.
         * 
         * @function handleImageError 
         */
        const handleImageError = () => {
            if (productPictureRef.current) {
                productPictureRef.current.src = "/kiosk_pictures/No_Image_Available.jpg";
            }
        };

        return (
            <button class="menu_item_button_design" onClick={handleClick}>
                <img alt={"The picture displays the " + menuItemName + " menu item."} ref={productPictureRef} src={imageName} width="200" height="200" onError={handleImageError} />
                <br></br>
                <ModifyMenuItemName menuItemNameToBeModified={menuItemNameDisplay} />
            </button>
        );
    }

    /**
     * The function will create a button that will display an entree menu item for the customer's third entree for a combo order.
     * 
     * @function ThirdEntreeComboButton
     * @param {String} menuItemName The name of the item on the Panda Express menu.
     * @param {String} menuItemNameDisplay The translated name of the item on the Panda Express menu that will be displayed on the button.
     * @returns The function returns a button that will display a specific entree, and it will be added to a customer's combo when he or she clicks it.
     */
    function ThirdEntreeComboButton({menuItemName, menuItemNameDisplay}) {
        // The code is going to store the image into a variable.
        var imageName = "/kiosk_pictures/" + menuItemName + ".png";

        /**
         * The function will add the menu item to the customer's combo order, and it will move to the next combo page.
         * 
         * @function handleClick
         */
        function handleClick() {
            // Change the page to the side page

            // The code will scroll to the top of the page.
            const rightColumnScrollable = document.querySelector(".right_column_scroll_page");
            rightColumnScrollable.scrollTo(0,0);

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

        // The reference variable will access the image if a load image error occurs.
        const productPictureRef = useRef(null);

        /**
         * The function will handle image errors if an image does not exist. If an image does not exist, the function will set the
         * image to a standard no image available image.
         * 
         * @function handleImageError 
         */
        const handleImageError = () => {
            if (productPictureRef.current) {
                productPictureRef.current.src = "/kiosk_pictures/No_Image_Available.jpg";
            }
        };

        return (
            <button class="menu_item_button_design" onClick={handleClick}>
                <img alt={"The picture displays the " + menuItemName + " menu item."} ref={productPictureRef} src={imageName} width="200" height="200" onError={handleImageError} />
                <br></br>
                <ModifyMenuItemName menuItemNameToBeModified={menuItemNameDisplay} />
            </button>
        );
    }

    /**
     * The function will create a button that will display a side menu item for the customer's side for a combo order.
     * 
     * @function SideComboButton
     * @param {String} menuItemName The name of the item on the Panda Express menu.
     * @param {String} menuItemNameDisplay The translated name of the item on the Panda Express menu that will be displayed on the button.
     * @returns The function returns a button that will display a specific side, and it will be added to a customer's combo when he or she clicks it.
     */
    function SideComboButton({menuItemName, menuItemNameDisplay}) {
        // The code is going to store the image into a variable.
        var imageName = "/kiosk_pictures/" + menuItemName + ".png";

        /**
         * The function will add a side to the customer's combo order, and it will move to the popular items page.
         * 
         * @function handleClick
         */
        function handleClick() {
            // Change the page to the popular items page

            // The code will scroll to the top of the page.
            const rightColumnScrollable = document.querySelector(".right_column_scroll_page");
            rightColumnScrollable.scrollTo(0,0);

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
            let newCurrentTotal = totalCost + transactionItemList.at(transactionItemList.length - 1).at(2).at(0) + dynamicPriceModifier;
            setTotalCost(parseFloat(newCurrentTotal.toFixed(2)));
        }

        // The reference variable will access the image if a load image error occurs.
        const productPictureRef = useRef(null);

        /**
         * The function will handle image errors if an image does not exist. If an image does not exist, the function will set the
         * image to a standard no image available image.
         * 
         * @function handleImageError 
         */
        const handleImageError = () => {
            if (productPictureRef.current) {
                productPictureRef.current.src = "/kiosk_pictures/No_Image_Available.jpg";
            }
        };

        return (
            <button class="menu_item_button_design" onClick={handleClick}>
                <img alt={"The picture displays the " + menuItemName + " menu item."} ref={productPictureRef} src={imageName} width="200" height="200" onError={handleImageError} />
                <br></br>
                <ModifyMenuItemName menuItemNameToBeModified={menuItemNameDisplay} />
            </button>
        );
    }

    /**
     * The function will create a button that will delete an ordered item for the customer's transaction item list. 
     * 
     * @function DeleteItemButton
     * @param {Number} transactionNumberInfo The transaction number for a specific ordered item on a customer's transaction item list.
     * @returns The function returns a button that will delete an ordered item from a customer's transaction item list when he or she clicks it.
     */
    function DeleteItemButton({transactionNumberInfo}) {

        /**
         * The function deletes an ordered item from a customer's transaction item list when he or she clicks it.
         * 
         * @function handleClick
         */
        function handleClick() {
            // The code is going to delete the transaction from the transaction item list.
            for (let i = 0; i < transactionItemList.length; i++) {
                if (transactionItemList.at(i).at(3).at(0) === transactionNumberInfo) {
                    // Updating the current total
                    let newCurrentCost = totalCost - transactionItemList.at(i).at(2).at(0) - dynamicPriceModifier;
                    setTotalCost(parseFloat(newCurrentCost.toFixed(2)));

                    // Removing the item from the list
                    const updatedTransactionItemList = transactionItemList.filter(transaction => transaction !== transactionItemList.at(i));
                    setTransactionItemList(updatedTransactionItemList);

                    // Removing the item from the list
                    const updatedTransactionItemListDisplay = transactionItemListDisplay.filter(transaction => transaction !== transactionItemListDisplay.at(i));
                    setTransactionItemListDisplay(updatedTransactionItemListDisplay);
                }
            }

            // If there are no items in the transactionItemList then go to the empty checkout page.
            if (transactionItemList.length == 1) {
                // The code will hide the current kiosk page.
                const currentPage = document.querySelector("." + currentKioskPage);
                currentPage.style.display = 'none';

                // The code will visually show the empty checkout page.
                const emptyCheckoutPage = document.querySelector(".empty_checkout_page_kiosk");
                emptyCheckoutPage.style.display = 'contents';

                // The code will store the empty checkout page as the current kiosk page.
                setCurrentKioskPage("empty_checkout_page_kiosk");

                // The code will hide the proceed to payment method button.
                const proceedToPaymentMethodButton = document.querySelector("." + currentCheckoutButton);
                proceedToPaymentMethodButton.style.display = 'none';

                // The code will visually show the current checkout button.
                const checkoutButton = document.querySelector(".display_checkout_button");
                checkoutButton.style.display = 'contents';
            }
        }

        return (
            <button class="delete_item_button_design" onClick={handleClick}>❌</button>
        );
    }

    /**
     * The function will create a button that will go to the checkout page when the button is clicked.
     * 
     * @function CheckoutButton
     * @returns The function returns a button that will go the checkout page.
     */
    function CheckoutButton() {

        /**
         * The function will change the current page to the checkout page on the customer kiosk for Panda Express.
         * 
         * @function handleClick
         */
        async function handleClick() {
            // The code will remove a combo transaction item from the customer's order if he or she did not complete it.
            removeIncompleteComboOrder();

            // The code will scroll to the top of the page.
            const rightColumnScrollable = document.querySelector(".right_column_scroll_page");
            rightColumnScrollable.scrollTo(0,0);

            // The code will hide the current kiosk page.
            const currentPage = document.querySelector("." + currentKioskPage);
            currentPage.style.display = 'none';

            if (transactionItemList.length != 0) {
                // Populating transactionItemListDisplay
                if (currentLanguage === "Spanish") {
                    let temporaryList = [];
                    await Promise.all(transactionItemList.map((async orderedItem => {
                        let comboTypeTranslated = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: orderedItem.at(0).at(0), language: "es"});
                        let menuItemsTranslated = await axios.post('https://panda-express-pos-backend-nc89.onrender.com/api/translate', {text: orderedItem.at(1).at(0), language: "es"});

                        let translatedRow = [[comboTypeTranslated.data[0].translatedText], [menuItemsTranslated.data[0].translatedText], [orderedItem.at(2).at(0)], [orderedItem.at(3).at(0)]];

                        temporaryList.push(translatedRow);
                    })));
                    setTransactionItemListDisplay(temporaryList);
                }
                else {
                    let temporaryList = [];
                    transactionItemList.map((orderedItem => {
                        let translatedRow = [[orderedItem.at(0).at(0)], [orderedItem.at(1).at(0)], [orderedItem.at(2).at(0)], [orderedItem.at(3).at(0)]];
            
                        temporaryList.push(translatedRow);
                    }))
                    setTransactionItemListDisplay(temporaryList);
                }

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
            <button class="checkout_button_design" onClick={handleClick}>{checkoutPageTitleTranslation}</button>
        );
    }

    /**
     * The function will create a button that will go to the payment method page when the customer clicks the button.
     * 
     * @function ProceedToPaymentMethodButton
     * @returns The function returns a button that will go to the payment method page when the customer clicks the button.
     */
    function ProceedToPaymentMethodButton() {

        /**
         * The function will go to the payment method page.
         * 
         * @function handleClick
         */
        function handleClick() {
            // The code will hide the main kiosk display.
            const currentPage = document.querySelector(".row_property");
            currentPage.style.display = 'none';

            // The code will visually show the payment method page.
            const paymentMethodPage = document.querySelector(".display_payment_method_page");
            paymentMethodPage.style.display = 'contents';
        }

        return (
            <button class="checkout_button_design" onClick={handleClick}>{proceedToPaymentMethodTitleTranslation}</button>
        )
    }

    /**
     * The function will create a button for a specific payment method.
     * 
     * @function PaymentMethodButton
     * @param {String} paymentMethod The parameter stores the type of payment method in English.
     * @param {String} paymentMethodTranslation The parameter stores the type of payment method in the translated language.
     * @returns The function returns a button that will allow the user to select their preferred payment method.
     */
    function PaymentMethodButton({paymentMethod, paymentMethodTranslation}) {
        // The name of the image depending on the payment method.
        var paymentMethodImageName;

        // The code will match the payment method with its corresponding image.
        if (paymentMethod == "Credit") {
            paymentMethodImageName = "/kiosk_pictures/Credit_Card.jpg";
        }
        else if (paymentMethod == "Debit") {
            paymentMethodImageName = "/kiosk_pictures/Debit_Card.jpg";
        }
        else if (paymentMethod == 'Cash') {
            paymentMethodImageName = "/kiosk_pictures/Cash.jpg";
        }
        else {
            paymentMethodImageName = "/kiosk_pictures/Dining_Dollars.jpeg";
        }

        /**
         * The function will store the user's preferred payment method in the system, and it will display the customer information page.
         * 
         * @function handleClick
         */
        function handleClick() {
            // The code will store the customer's chose payment method.
            setCustomerPaymentMethod(paymentMethod);
            setCustomerPaymentMethodTranslation(paymentMethodTranslation);

            // The code will change the current page to the customer information page.

            // The code will hide the payment method page.
            const paymentMethodPage = document.querySelector(".display_payment_method_page");
            paymentMethodPage.style.display = 'none';

            // The code will visually show the customer information page.
            const customerInfoPage = document.querySelector(".display_customer_information_page");
            customerInfoPage.style.display = 'contents';
        }

        return (
            <button class="payment_method_button_design" onClick={handleClick}>
                <img alt={"The picture displays the payment method of " + paymentMethod} src={paymentMethodImageName} width="40%" height="70%" />
                <br></br>
                {paymentMethodTranslation}
            </button>
        )
    }

    // The code will store the customer's name into the state.
    const changeCustomerName = (event) => {
        setCustomerName(event.target.value);
    }

    /**
     * The function will create the final checkout button, which will change the customer information page to the checkout summary page
     * when the button is clicked.
     * 
     * @function FinalCheckoutButton
     * @returns The function will return a button that will go to the checkout summary page when it is clicked.
     */
    function FinalCheckoutButton() {

        /**
         * The function will switch from the customer information page to the checkout summary page.
         * 
         * @function handleClick
         */
        function handleClick() {
            // The code will change the customer information page to the checkout summary page.

            // The code will check if the customer's name is blank.
            if (customerName == "") {
                setCustomerName(customerBackupNameTranslation); 
            }

            // The code will hide the customer information page.
            const customerInfoPage = document.querySelector(".display_customer_information_page");
            customerInfoPage.style.display = 'none';

            // The code will visually show the checkout summary page.
            const checkoutSummaryPage = document.querySelector(".display_checkout_summary_page");
            checkoutSummaryPage.style.display = 'contents';
        }

        return (
            <button class="final_checkout_button_design" onClick={handleClick}>{finalCheckoutButtonTitleTranslation}</button>
        );
    }

    // The button will either submit the customer's order or cancel the customer's order.

    /**
     * The function will create a button that either submit or cancel the customer's order.
     * 
     * @function SubmitOrder
     * @param {String} userDecision The parameter will determine the type of submit for the button. The parameter can only be "Cancel Order" or
     *                              "Submit Order" for it to work properly.
     * @param {String} userDecisionDisplay The parameter will be displayed on the button in the customer's preferred language.
     *                                     The userDecision and userDecisionDisplay parameters should have the same text, but 
     *                                     the userDecisionDisplay parameter might be in a different language.
     * @returns The function will return a button that will either submit or cancel the customer's order.
     */
    function SubmitOrder({userDecision, userDecisionDisplay}) {
        
        /**
         * The function will either submit or cancel the customer's order.
         * 
         * @function handleClick
         */
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

                // The code is going to subtract the inventory items from the inventory database due to the order.
                
                // Putting all of the menu items into a list
                var productItemsList = productItems.split(",");
                for (let i = 0; i < productItemsList.length; i++) {
                    if (i != 0) {
                        productItemsList[i] = productItemsList[i].replace(" ", "");
                    }
                }
                
                // Subtracting the inventory items from the database.
                for (let i = 0; i < productItemsList.length; i++) {
                    // Getting the list of inventory items from the specific product item.
                    var listOfInventoryItems = menuMatchMap.get(productItemsList.at(i));

                    // Subtracting each inventory item from the database.
                    for (let j = 0; j < listOfInventoryItems.length; j++) {
                        var updatedInventoryItemQuantity = inventoryItemsQuantityMap.get(listOfInventoryItems.at(j)) - 1;
                        inventoryItemsQuantityMap.set(listOfInventoryItems.at(j), updatedInventoryItemQuantity);
                        
                        var updateInventoryDatabaseQuery = "UPDATE inventory SET quantity = " + updatedInventoryItemQuantity + " WHERE productname = '" + listOfInventoryItems.at(j) + "';";
                        handleQuery(updateInventoryDatabaseQuery);
                    }
                }

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
            <button class="final_checkout_button_design" onClick={handleClick}>{userDecisionDisplay}</button>
        )
    }

    /**
     * The function will create a button that will take the customer back to the popular menu items page, and it will reset the order
     * to be an empty order.
     * 
     * @function ReturnToHomeButton
     * @returns The function returns a button that will take the customer back to the popular menu items page and reset the order to be
     *          an empty order when he or she clicks the button.
     */
    function ReturnToHomeButton() {

        /**
         * The function will take the customer back to the popular menu items page, and it will reset the order to be an empty order.
         * 
         * @function handleClick
         */
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
            <button class="return_to_home_button_design" onClick={handleClick}>{returnToHomePageTitleTranslation}</button>
        )
    }

    /**
     * The function will send an SQL query to the database.
     * 
     * @function handleQuery
     * @param {String} query The parameter is an SQL query that will be sent to the database. 
     */
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

    /**
     * The function will display the loading screen.
     * 
     * @function LoadingScreen
     * @returns The function returns the loading screen HTML code.
     */
    const LoadingScreen = () => (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );

    /**
     * The function will display the error screen.
     * 
     * @function ErrorScreen
     * @returns The function returns the error screen HTML code.
     */
    const ErrorScreen = () => (
        <div className="error-message">
            <div className="error-icon">⚠️</div>
            <p className="error-text">{error}</p>
        </div>
    );

    // Displaying the Panda Express customer kisok webpage.
    return (
        <div class="customer-kiosk-display">
        {/* Show loading screen, error screen, or main content */}
        {loading ? (
          <LoadingScreen />
        ) : isError ? (
          <ErrorScreen />
        ) : (
          <>
            {/* The heading of the customer kiosk. */}
            <div class="row_property_header">
                <div class="page_header_left">
                    <img alt={"The picture displays the Panda Express logo."} src='/kiosk_pictures/panda_express_logo.png' width="55%" height="90%" />
                </div>
                <div class="page_header_right">
                    <p>{kisokHeadingTextTranslation}</p>
                </div>
            </div>

            <div class="row_property">
                {/* The left section of the customer kiosk that contains the side buttons to switch between sections. */}
                <div class="left_column">
                    <div class="left_column_scroll_page">
                        <div><EmployeeLoginButton /></div>
                        <div class="spanish_button_kiosk"><TextTranslationButton language={"Spanish"} /></div>
                        <div class="english_button_kiosk"><TextTranslationButton language={"English"} /></div>
                        <div><SideButton buttonName={popularButtonTextTranslation} className="popular_page_kiosk" /></div>
                        <div><SideButton buttonName={combosButtonTextTranslation} className="combos_page_kiosk" /></div>
                        <div><SideButton buttonName={entreesButtonTextTranslation} className="entrees_page_kiosk" /></div>
                        <div><SideButton buttonName={sidesButtonTextTranslation} className="sides_page_kiosk" /></div>
                        <div><SideButton buttonName={appetizersButtonTextTranslation} className="appetizers_page_kiosk" /></div>
                        <div><SideButton buttonName={drinksButtonTextTranslation} className="drinks_page_kiosk" /></div>
                    </div>
                </div>

                {/* The right section of the customer kisok that contains the different menu item sections. */}
                <div class="right_column">
                    <div class="right_column_scroll_page">
                        <div class="popular_page_kiosk">
                            <div class="popular_page">
                                {/* The title of the popular section. */}
                                <div class="right_column_title">{popularMenuItemsTitleTranslation}</div>

                                {/* Popular items heading in the popular section. */}
                                <div class="in_text_headings">{popularMenuItemsHeadingTranslation}</div>

                                {/* The buttons in the popular items section. */}
                                <div>
                                    <MenuItemButton menuItemName="Orange Chicken" menuItemNameDisplay={popularItemsPageOrangeChickenTranslation} />
                                    <MenuItemButton menuItemName="Grilled Teriyaki Chicken" menuItemNameDisplay={popularItemsPageTeriyakiChickenTranslation} />
                                    <MenuItemButton menuItemName="Beijing Beef" menuItemNameDisplay={popularItemsPageBeijingBeefTranslation} />
                                </div>

                                {/* Seasonal items heading in the popular section. */}
                                <div class="in_text_headings">{seasonalMenuItemsHeadingTranslation}</div>

                                {/* The buttons in the seasonal items section. */}
                                <div>
                                    <MenuItemButton menuItemName="Hot Ones Blazing Bourbon Chicken" menuItemNameDisplay={popularItemsPageHotOnesTranslation} />
                                </div>
                            </div>
                        </div>
                        <div class="combos_page_kiosk">
                            <div class="combos_page">
                                {/* The title of the combos section. */}
                                <div class="right_column_title">{combosButtonTextTranslation}</div>
                                
                                <div></div>

                                {/* The buttons in the combos section. */}
                                {prices.map((menuItem => {
                                    if ((menuItem.entreenumber > 1) || (menuItem.productname === "Bowl")) {
                                        return (
                                            <MenuItemButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        );
                                    }
                                }))}
                            </div>
                        </div>
                        <div class="entrees_page_kiosk">
                            <div class="entrees_page">
                                {/* The title of the entrees section. */}
                                <div class="right_column_title">{entreesButtonTextTranslation}</div>

                                <div></div>

                                {/* The buttons in the entrees section. */}
                                {prices.map((menuItem => {
                                    if ((menuItem.entreenumber === 1) && (menuItem.productname !== "Bowl")) {
                                        return (
                                            <MenuItemButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        );
                                    }
                                }))}
                            </div>
                        </div>
                        <div class="appetizers_page_kiosk">
                            <div class="appetizers_page">
                                {/* The title of the appetizers section. */}
                                <div class="right_column_title">{appetizersButtonTextTranslation}</div>

                                <div></div>

                                {/* The buttons in the appetizers section. */}
                                {prices.map((menuItem => {
                                    if (menuItem.appetizernumber === 1) {
                                        return (
                                            <MenuItemButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        );
                                    }
                                }))}
                            </div>
                        </div>
                        <div class="drinks_page_kiosk">
                            <div class="drinks_page">
                                {/* The title of the drinks section. */}
                                <div class="right_column_title">{drinksButtonTextTranslation}</div>

                                <div></div>

                                {/* The buttons in the drinks section. */}
                                {prices.map((menuItem) => {
                                    if (menuItem.drinknumber === 1) {
                                        return (
                                            <MenuItemButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        )
                                    }
                                })}
                            </div>
                        </div>
                        <div class="sides_page_kiosk">
                            <div class="sides_page">
                                {/* The title of the sides section. */}
                                <div class="right_column_title">{sidesButtonTextTranslation}</div>

                                <div></div>

                                {/* The buttons in the sides section. */}
                                {prices.map((menuItem) => {
                                    if ((menuItem.sidenumber === 1) && (menuItem.productname !== "Bowl")
                                        && (menuItem.productname !== "Plate") && (menuItem.productname !== "Bigger Plate")) {
                                        return (
                                            <MenuItemButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        )
                                    }
                                })}
                            </div>
                        </div>
                        <div class="first_entree_combo_kiosk">
                            <div class="entrees_page">
                                {/* The title of the first entree page when the customer orders a combo. */}
                                <div class="right_column_title">{combosFirstEntreeTitleTranslation}</div>

                                <div></div>

                                {/* The buttons for the customers to press, so they can choose their first entree for their combo */}
                                {prices.map((menuItem => {
                                    if ((menuItem.entreenumber === 1) && (menuItem.productname !== "Bowl")) {
                                        return (
                                            <FirstEntreeComboButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        );
                                    }
                                }))}
                            </div>
                        </div>
                        <div class="second_entree_combo_kiosk">
                            <div class="entrees_page">
                                {/* The title of the second entree page when the customer orders a combo. */}
                                <div class="right_column_title">{combosSecondEntreeTitleTranslation}</div>

                                <div></div>

                                {/* The buttons for the customers to press, so they can choose their second entree for their combo */}
                                {prices.map((menuItem => {
                                    if ((menuItem.entreenumber === 1) && (menuItem.productname !== "Bowl")) {
                                        return (
                                            <SecondEntreeComboButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        );
                                    }
                                }))}
                            </div>
                        </div>
                        <div class="third_entree_combo_kiosk">
                            <div class="entrees_page">
                                {/* The title of the Third entree page when the customer orders a combo. */}
                                <div class="right_column_title">{combosThirdEntreeTitleTranslation}</div>

                                <div></div>

                                {/* The buttons for the customers to press, so they can choose their third entree for their combo */}
                                {prices.map((menuItem => {
                                    if ((menuItem.entreenumber === 1) && (menuItem.productname !== "Bowl")) {
                                        return (
                                            <ThirdEntreeComboButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        );
                                    }
                                }))}
                            </div>
                        </div>
                        <div class="side_combo_kiosk">
                            <div class="sides_page">
                                {/* The title of the side page when the customer orders a combo. */}
                                <div class="right_column_title">{combosSideTitleTranslation}</div>

                                <div></div>

                                {/* The buttons for the customers to press, so they can choose their side for their combo. */}
                                {prices.map((menuItem) => {
                                    if ((menuItem.sidenumber === 1) && (menuItem.productname !== "Bowl")
                                        && (menuItem.productname !== "Plate") && (menuItem.productname !== "Bigger Plate")) {
                                        return (
                                            <SideComboButton menuItemName={menuItem.productname} menuItemNameDisplay={pricesMapTranslation.get(menuItem.productname)} />
                                        )
                                    }
                                })}
                            </div>
                        </div>
                        <div class="checkout_page_kiosk">
                            <div class="checkout_page">
                                {/* The title of the checkout page. */}
                                <div class="right_column_title">{checkoutPageTitleTranslation}</div>

                                <div></div>

                                {/* The table will display the customer's order */}
                                <div class="center_table">
                                    <table class="design_table">
                                        {/* The table heading */}
                                        <thead>
                                            <tr>
                                                <th>{orderTypeTableTranslation}</th>
                                                <th>{menuItemsTableTranslation}</th>
                                                <th>{costTableTranslation}</th>
                                                <th>{modifierTableTitleTranslation}</th>
                                                <th>{removeTableTranslation}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactionItemListDisplay.map((orderedItem => (
                                                <tr>
                                                    <td>{orderedItem.at(0).at(0)}</td>
                                                    <td>{orderedItem.at(1).at(0)}</td>
                                                    <td>{orderedItem.at(2).at(0).toFixed(2)} $</td>
                                                    <td>{dynamicPriceModifier.toFixed(2)} $</td>
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
                                <p class="empty_checkout_text">{emptyCheckoutPageTitleTranslation}</p>
                            </div>
                        </div>
                    </div>

                    <div class="row_property_secondary">
                        {/* The current total box at the bottom left of the kiosk page. */}
                        <div class="left_column_secondary">
                            <div>{currentTotalTitleTranslation} {totalCost.toFixed(2)} $</div>
                        </div>

                        {/* The price modifier box at the bottom middle of the kiosk page. */}
                        <div class="middle_column_secondary">
                            <div>{priceModifierTitleTranslation} {dynamicPriceModifier.toFixed(2)} $</div>
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
                    <div class="payment_method_title">{choosePaymentMethodTitleTranslation}</div>
                    <PaymentMethodButton paymentMethod={"Debit"} paymentMethodTranslation={debitTitleTranslation} />
                    <PaymentMethodButton paymentMethod={"Credit"} paymentMethodTranslation={creditTitleTranslation} />
                    <PaymentMethodButton paymentMethod={"Dining Dollars"} paymentMethodTranslation={diningDollarsTitleTranslation} />
                    <PaymentMethodButton paymentMethod={"Cash"} paymentMethodTranslation={cashTitleTranslation} />
                </div>
            </div>

            {/* The code displays the customer information page. */}
            <div class="display_customer_information_page">
                <div class="customer_information_page">
                    <div class="customer_information_title">{customerInformationTitleTranslation}</div>
                    <p class="customer_information_label">{orderNameTitleTranslation} <input type="text" onChange={changeCustomerName} value={customerName} placeholder={customerBackupNameTranslation} /></p>
                    <FinalCheckoutButton />
                </div>
            </div>

            {/* The code displays the checkout summary page. */}
            <div class="display_checkout_summary_page">
                <div class="checkout_summary_page">
                    <div class="customer_information_title">{checkoutSummaryTitleTranslation}</div>

                    {/* The table will display the customer's order */}
                    <div class="center_table">
                        <table class="design_table">
                            {/* The table heading */}
                            <thead>
                                <tr>
                                    <th>{orderTypeTableTranslation}</th>
                                    <th>{menuItemsTableTranslation}</th>
                                    <th>{costTableTranslation}</th>
                                    <th>{modifierTableTitleTranslation}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionItemListDisplay.map((orderedItem => (
                                    <tr>
                                        <td>{orderedItem.at(0).at(0)}</td>
                                        <td>{orderedItem.at(1).at(0)}</td>
                                        <td>{orderedItem.at(2).at(0).toFixed(2)} $</td>
                                        <td>{dynamicPriceModifier.toFixed(2)} $</td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>

                    <p class="customer_information_label">{totalCostTitleTranslation} {totalCost} $</p>
                    <p class="customer_information_label">{paymentMethodSummaryTitleTranslation} {customerPaymentMethodTranslation}</p>
                    <p class="customer_information_label">{nameSummaryTitleTranslation} {customerName}</p>
                    <SubmitOrder userDecision={"Submit Order"} userDecisionDisplay={sumbitOrderButtonTitleTranslation} />
                    <SubmitOrder userDecision={"Cancel Order"} userDecisionDisplay={cancelOrderButtonTitleTranslation} />
                </div>
            </div>

            {/* The code displays the order confirmed page */}
            <div class="display_order_confirmed_page">
                <div class="order_confirmed_page">
                    <div class="customer_information_title">{orderConfirmedTitleTranslation}</div>
                    <p class="customer_information_label">{orderNumberTitleTranslation} {customerKioskNumber}</p>
                    <ReturnToHomeButton />
                </div>
            </div>
            </>
            )}
        </div>
    )
}