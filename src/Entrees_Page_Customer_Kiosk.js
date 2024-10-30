import './Entrees_Page_Customer_Kiosk.css';
import { MenuItemButton } from './Customer_Kiosk_System';

// The function that will generate the entrees page on the customer kiosk.
export function PageLayoutEntreesPageCustomerKiosk() {
    return (
        <div class="entrees_page">
            {/* The title of the entrees section. */}
            <div><p class="right_column_title">Entrees</p></div>

            {/* The buttons in the entrees section. */}
            <div>
                <MenuItemButton buttonName="Orange Chicken" />
                <MenuItemButton buttonName="Hot Ones Blazing Bourbon Chicken" />
                <MenuItemButton buttonName="Black Pepper Sirloin Steak" />
                <MenuItemButton buttonName="Honey Walnut Shrimp" />
                <MenuItemButton buttonName="Grilled Teriyaki Chicken" />
                <MenuItemButton buttonName="Broccoli Beef" />
                <MenuItemButton buttonName="Kung Pao Chicken" />
                <MenuItemButton buttonName="Honey Sesame Chicken Breast" />
                <MenuItemButton buttonName="Beijing Beef" />
                <MenuItemButton buttonName="Mushroom Chicken" />
                <MenuItemButton buttonName="SweetFire Chicken Breast" />
                <MenuItemButton buttonName="String Bean Chicken Breast" />
                <MenuItemButton buttonName="Black Pepper Chicken" />
                <MenuItemButton buttonName="Pumpkin Spice Chicken" />
            </div>
        </div>
    );
}