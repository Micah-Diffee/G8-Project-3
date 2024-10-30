import './Sides_Page_Customer_Kiosk.css';
import { MenuItemButton } from './Customer_Kiosk_System';

// The function that will generate the sides page on the customer kiosk.
export function PageLayoutSidesPageCustomerKiosk() {
    return (
        <div class="sides_page">
            {/* The title of the sides section. */}
            <div><p class="right_column_title">Sides</p></div>

            {/* The buttons in the sides section. */}
            <div>
                <MenuItemButton buttonName="Super Greens" />
                <MenuItemButton buttonName="Chow Mein" />
                <MenuItemButton buttonName="Fried Rice" />
                <MenuItemButton buttonName="White Steamed Rice" />
            </div>
        </div>
    );
}