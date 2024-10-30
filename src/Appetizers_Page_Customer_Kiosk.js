import './Appetizers_Page_Customer_Kiosk.css';
import { MenuItemButton } from './Customer_Kiosk_System';

// The function that will generate the appetizers page on the customer kiosk.
export function PageLayoutAppetizersPageCustomerKiosk() {
    return (
        <div class="appetizers_page">
            {/* The title of the appetizers section. */}
            <div><p class="right_column_title">Appetizers</p></div>

            {/* The buttons in the appetizers section. */}
            <div>
                <MenuItemButton buttonName="Chicken Egg Roll" />
                <MenuItemButton buttonName="Veggie Spring Roll" />
                <MenuItemButton buttonName="Cream Cheese Rangoon" />
                <MenuItemButton buttonName="Apple Pie Roll" />
            </div>
        </div>
    );
}