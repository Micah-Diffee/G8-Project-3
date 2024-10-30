import './Popular_Page_Customer_Kiosk.css';
import { MenuItemButton } from './Customer_Kiosk_System';

// The function that will generate the popular page on the customer kiosk.
export function PageLayoutPopularPageCustomerKiosk() {
    return (
        <div class="popular_page">
            {/* The title of the popular section. */}
            <div><p class="right_column_title">Popular</p></div>

            {/* Popular items heading in the popular section. */}
            <div><p class="in_text_headings">Popular Items</p></div>

            {/* The buttons in the popular items section. */}
            <div>
                <MenuItemButton buttonName="Orange Chicken" />
                <MenuItemButton buttonName="Grilled Teriyaki Chicken" />
                <MenuItemButton buttonName="Beijing Beef" />
            </div>

            {/* Seasonal items heading in the popular section. */}
            <div><p class="in_text_headings">Seasonal Items</p></div>

            {/* The buttons in the seasonal items section. */}
            <div>
                <MenuItemButton buttonName="Hot Ones Blazing Bourbon Chicken" />
                <MenuItemButton buttonName="Pumpkin Spice Chicken" />
            </div>
        </div>
    );
}