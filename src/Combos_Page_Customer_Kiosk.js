import './Combos_Page_Customer_Kiosk.css';
import { MenuItemButton } from './Customer_Kiosk_System';

// The function that will generate the combos page on the customer kiosk.
export function PageLayoutCombosPageCustomerKiosk() {
    return (
        <div class="combos_page">
            {/* The title of the combos section. */}
            <div><p class="right_column_title">Combos</p></div>

            {/* The buttons in the combos section. */}
            <div>
                <MenuItemButton buttonName="Bowl" />
                <MenuItemButton buttonName="Plate" />
                <MenuItemButton buttonName="Bigger Plate" />
            </div>
        </div>
    );
}