import './Customer_Kiosk_Display.css';
import { PageLayoutPopularPageCustomerKiosk } from './Popular_Page_Customer_Kiosk.js';
import { PageLayoutCombosPageCustomerKiosk } from './Combos_Page_Customer_Kiosk.js';
import { PageLayoutEntreesPageCustomerKiosk } from './Entrees_Page_Customer_Kiosk.js';
import { PageLayoutAppetizersPageCustomerKiosk } from './Appetizers_Page_Customer_Kiosk.js';
import { PageLayoutDrinksPageCustomerKiosk } from './Drinks_Page_Customer_Kiosk.js';
import { PageLayoutSidesPageCustomerKiosk } from './Sides_Page_Customer_Kiosk.js';
import { PageLayoutCheckoutPageCustomerKiosk } from './Checkout_Page_Customer_Kiosk.js';
import { EmployeeLoginButton } from './Customer_Kiosk_System';
import { SideButton } from './Customer_Kiosk_System';
import { CheckoutButton } from './Customer_Kiosk_System';
import { totalCost } from './Customer_Kiosk_System.js';


// The function will display the customer kiosk.
export function CustomerKioskDisplay() {
    return (
        <div>
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
                    <div class="popular_page_kiosk"><PageLayoutPopularPageCustomerKiosk /></div>
                    <div class="combos_page_kiosk"><PageLayoutCombosPageCustomerKiosk /></div>
                    <div class="entrees_page_kiosk"><PageLayoutEntreesPageCustomerKiosk /></div>
                    <div class="appetizers_page_kiosk"><PageLayoutAppetizersPageCustomerKiosk /></div>
                    <div class="drinks_page_kiosk"><PageLayoutDrinksPageCustomerKiosk /></div>
                    <div class="sides_page_kiosk"><PageLayoutSidesPageCustomerKiosk /></div>
                    <div class="checkout_page_kiosk"><PageLayoutCheckoutPageCustomerKiosk /></div>
                </div>
            </div>
            <div class="row_property">

                {/* The current total box at the bottom left of the kiosk page. */}
                <div class="left_column_secondary">
                    <p>Current Total: {totalCost}</p>
                </div>

                {/* The checkout button at the bottom right of the kiosk page. */}
                <div class="right_column_secondary">
                    <div><CheckoutButton /></div>
                </div>
            </div>
        </div>
    )
}