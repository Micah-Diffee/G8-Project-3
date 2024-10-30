import './Drinks_Page_Customer_Kiosk.css';
import { MenuItemButton } from './Customer_Kiosk_System';

// The function that will generate the drinks page on the customer kiosk.
export function PageLayoutDrinksPageCustomerKiosk() {
    return (
        <div class="drinks_page">
            {/* The title of the drinks section. */}
            <div><p class="right_column_title">Drinks</p></div>

            {/* The buttons in the drinks section. */}
            <MenuItemButton buttonName="Small Fountain Drink" />
            <MenuItemButton buttonName="Regular Fountain Drink" />
            <MenuItemButton buttonName="Large Fountain Drink" />
            <MenuItemButton buttonName="Water Cup" />    
        </div>
    );
}