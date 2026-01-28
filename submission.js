import { runPayment } from "backend/payment.jsw";
import { createProducts } from "backend/products.jsw";
import wixPayFrontend from "wix-pay-frontend";
import wixLocation from "wix-location";


let prodNameInput, prodDescInput, errorText;


// Checkout fields
const fieldIdz = ["#email", "#firstName", "#lastName", "#phone", "#country", "#state"];


// Tax rates
const STATE_TAX_RATES = {
    "Alabama": 0.0946,
    "Alaska": 0.0182,
    "Arizona": 0.0852,
    "Arkansas": 0.0946,
    "California": 0.0899,
    "Colorado": 0.0789,
    "Connecticut": 0.0635,
    "Delaware": 0.0,
    "Florida": 0.0698,
    "Georgia": 0.0749,
    "Hawaii": 0.045,
    "Idaho": 0.0603,
    "Illinois": 0.0896,
    "Indiana": 0.07,
    "Iowa": 0.0694,
    "Kansas": 0.0869,
    "Kentucky": 0.06,
    "Louisiana": 0.1011,
    "Maine": 0.055,
    "Maryland": 0.06,
    "Massachusetts": 0.0625,
    "Michigan": 0.06,
    "Minnesota": 0.0814,
    "Mississippi": 0.0706,
    "Missouri": 0.0844,
    "Montana": 0.0,
    "Nebraska": 0.0698,
    "Nevada": 0.0824,
    "New Hampshire": 0.0,
    "New Jersey": 0.066,
    "New Mexico": 0.0767,
    "New York": 0.0854,
    "North Carolina": 0.07,
    "North Dakota": 0.0709,
    "Ohio": 0.0729,
    "Oklahoma": 0.0906,
    "Oregon": 0.0,
    "Pennsylvania": 0.0634,
    "Rhode Island": 0.07,
    "South Carolina": 0.0749,
    "South Dakota": 0.0611,
    "Tennessee": 0.0961,
    "Texas": 0.082,
    "Utah": 0.0742,
    "Vermont": 0.0639,
    "Virginia": 0.0577,
    "Washington": 0.0951,
    "West Virginia": 0.0659,
    "Wisconsin": 0.0572,
    "Wyoming": 0.0556,
    "District of Columbia": 0.06
};

const INTERNATIONAL_TAX_RATE = 0.15;

const COUNTRIES = [
    { label: "United States", value: "USA" },
    { label: "Afghanistan", value: "AF" },
    { label: "Albania", value: "AL" },
    { label: "Algeria", value: "DZ" },
    { label: "Andorra", value: "AD" },
    { label: "Angola", value: "AO" },
    { label: "Antigua and Barbuda", value: "AG" },
    { label: "Argentina", value: "AR" },
    { label: "Armenia", value: "AM" },
    { label: "Australia", value: "AU" },
    { label: "Austria", value: "AT" },
    { label: "Azerbaijan", value: "AZ" },
    { label: "Bahamas", value: "BS" },
    { label: "Bahrain", value: "BH" },
    { label: "Bangladesh", value: "BD" },
    { label: "Barbados", value: "BB" },
    { label: "Belarus", value: "BY" },
    { label: "Belgium", value: "BE" },
    { label: "Belize", value: "BZ" },
    { label: "Benin", value: "BJ" },
    { label: "Bhutan", value: "BT" },
    { label: "Bolivia", value: "BO" },
    { label: "Bosnia and Herzegovina", value: "BA" },
    { label: "Botswana", value: "BW" },
    { label: "Brazil", value: "BR" },
    { label: "Brunei", value: "BN" },
    { label: "Bulgaria", value: "BG" },
    { label: "Burkina Faso", value: "BF" },
    { label: "Burundi", value: "BI" },
    { label: "Cabo Verde", value: "CV" },
    { label: "Cambodia", value: "KH" },
    { label: "Cameroon", value: "CM" },
    { label: "Canada", value: "CA" },
    { label: "Central African Republic", value: "CF" },
    { label: "Chad", value: "TD" },
    { label: "Chile", value: "CL" },
    { label: "China", value: "CN" },
    { label: "Colombia", value: "CO" },
    { label: "Comoros", value: "KM" },
    { label: "Congo", value: "CG" },
    { label: "Costa Rica", value: "CR" },
    { label: "Croatia", value: "HR" },
    { label: "Cuba", value: "CU" },
    { label: "Cyprus", value: "CY" },
    { label: "Czech Republic", value: "CZ" },
    { label: "Denmark", value: "DK" },
    { label: "Djibouti", value: "DJ" },
    { label: "Dominica", value: "DM" },
    { label: "Dominican Republic", value: "DO" },
    { label: "Ecuador", value: "EC" },
    { label: "Egypt", value: "EG" },
    { label: "El Salvador", value: "SV" },
    { label: "Equatorial Guinea", value: "GQ" },
    { label: "Eritrea", value: "ER" },
    { label: "Estonia", value: "EE" },
    { label: "Eswatini", value: "SZ" },
    { label: "Ethiopia", value: "ET" },
    { label: "Fiji", value: "FJ" },
    { label: "Finland", value: "FI" },
    { label: "France", value: "FR" },
    { label: "Gabon", value: "GA" },
    { label: "Gambia", value: "GM" },
    { label: "Georgia", value: "GE" },
    { label: "Germany", value: "DE" },
    { label: "Ghana", value: "GH" },
    { label: "Greece", value: "GR" },
    { label: "Grenada", value: "GD" },
    { label: "Guatemala", value: "GT" },
    { label: "Guinea", value: "GN" },
    { label: "Guinea-Bissau", value: "GW" },
    { label: "Guyana", value: "GY" },
    { label: "Haiti", value: "HT" },
    { label: "Honduras", value: "HN" },
    { label: "Hungary", value: "HU" },
    { label: "Iceland", value: "IS" },
    { label: "India", value: "IN" },
    { label: "Indonesia", value: "ID" },
    { label: "Iran", value: "IR" },
    { label: "Iraq", value: "IQ" },
    { label: "Ireland", value: "IE" },
    { label: "Israel", value: "IL" },
    { label: "Italy", value: "IT" },
    { label: "Jamaica", value: "JM" },
    { label: "Japan", value: "JP" },
    { label: "Jordan", value: "JO" },
    { label: "Kazakhstan", value: "KZ" },
    { label: "Kenya", value: "KE" },
    { label: "Kiribati", value: "KI" },
    { label: "Korea, North", value: "KP" },
    { label: "Korea, South", value: "KR" },
    { label: "Kuwait", value: "KW" },
    { label: "Kyrgyzstan", value: "KG" },
    { label: "Laos", value: "LA" },
    { label: "Latvia", value: "LV" },
    { label: "Lebanon", value: "LB" },
    { label: "Lesotho", value: "LS" },
    { label: "Liberia", value: "LR" },
    { label: "Libya", value: "LY" },
    { label: "Liechtenstein", value: "LI" },
    { label: "Lithuania", value: "LT" },
    { label: "Luxembourg", value: "LU" },
    { label: "Madagascar", value: "MG" },
    { label: "Malawi", value: "MW" },
    { label: "Malaysia", value: "MY" },
    { label: "Maldives", value: "MV" },
    { label: "Mali", value: "ML" },
    { label: "Malta", value: "MT" },
    { label: "Marshall Islands", value: "MH" },
    { label: "Mauritania", value: "MR" },
    { label: "Mauritius", value: "MU" },
    { label: "Mexico", value: "MX" },
    { label: "Micronesia", value: "FM" },
    { label: "Moldova", value: "MD" },
    { label: "Monaco", value: "MC" },
    { label: "Mongolia", value: "MN" },
    { label: "Montenegro", value: "ME" },
    { label: "Morocco", value: "MA" },
    { label: "Mozambique", value: "MZ" },
    { label: "Myanmar", value: "MM" },
    { label: "Namibia", value: "NA" },
    { label: "Nauru", value: "NR" },
    { label: "Nepal", value: "NP" },
    { label: "Netherlands", value: "NL" },
    { label: "New Zealand", value: "NZ" },
    { label: "Nicaragua", value: "NI" },
    { label: "Niger", value: "NE" },
    { label: "Nigeria", value: "NG" },
    { label: "North Macedonia", value: "MK" },
    { label: "Norway", value: "NO" },
    { label: "Oman", value: "OM" },
    { label: "Pakistan", value: "PK" },
    { label: "Palau", value: "PW" },
    { label: "Panama", value: "PA" },
    { label: "Papua New Guinea", value: "PG" },
    { label: "Paraguay", value: "PY" },
    { label: "Peru", value: "PE" },
    { label: "Philippines", value: "PH" },
    { label: "Poland", value: "PL" },
    { label: "Portugal", value: "PT" },
    { label: "Qatar", value: "QA" },
    { label: "Romania", value: "RO" },
    { label: "Russia", value: "RU" },
    { label: "Rwanda", value: "RW" },
    { label: "Saint Kitts and Nevis", value: "KN" },
    { label: "Saint Lucia", value: "LC" },
    { label: "Saint Vincent and the Grenadines", value: "VC" },
    { label: "Samoa", value: "WS" },
    { label: "San Marino", value: "SM" },
    { label: "Sao Tome and Principe", value: "ST" },
    { label: "Saudi Arabia", value: "SA" },
    { label: "Senegal", value: "SN" },
    { label: "Serbia", value: "RS" },
    { label: "Seychelles", value: "SC" },
    { label: "Sierra Leone", value: "SL" },
    { label: "Singapore", value: "SG" },
    { label: "Slovakia", value: "SK" },
    { label: "Slovenia", value: "SI" },
    { label: "Solomon Islands", value: "SB" },
    { label: "Somalia", value: "SO" },
    { label: "South Africa", value: "ZA" },
    { label: "South Sudan", value: "SS" },
    { label: "Spain", value: "ES" },
    { label: "Sri Lanka", value: "LK" },
    { label: "Sudan", value: "SD" },
    { label: "Suriname", value: "SR" },
    { label: "Sweden", value: "SE" },
    { label: "Switzerland", value: "CH" },
    { label: "Syria", value: "SY" },
    { label: "Taiwan", value: "TW" },
    { label: "Tajikistan", value: "TJ" },
    { label: "Tanzania", value: "TZ" },
    { label: "Thailand", value: "TH" },
    { label: "Timor-Leste", value: "TL" },
    { label: "Togo", value: "TG" },
    { label: "Tonga", value: "TO" },
    { label: "Trinidad and Tobago", value: "TT" },
    { label: "Tunisia", value: "TN" },
    { label: "Turkey", value: "TR" },
    { label: "Turkmenistan", value: "TM" },
    { label: "Tuvalu", value: "TV" },
    { label: "Uganda", value: "UG" },
    { label: "Ukraine", value: "UA" },
    { label: "United Arab Emirates", value: "AE" },
    { label: "United Kingdom", value: "GB" },
    { label: "Uruguay", value: "UY" },
    { label: "Uzbekistan", value: "UZ" },
    { label: "Vanuatu", value: "VU" },
    { label: "Vatican City", value: "VA" },
    { label: "Venezuela", value: "VE" },
    { label: "Vietnam", value: "VN" },
    { label: "Yemen", value: "YE" },
    { label: "Zambia", value: "ZM" },
    { label: "Zimbabwe", value: "ZW" }
];


$w.onReady(() => {
    // Inputs
    prodNameInput = $w("#prodName");
    prodDescInput = $w("#prodDesc");
    errorText = $w("#errorTextAddProduct");


    // Init repeater
    $w("#prodList").data = [];


    $w("#prodList").onItemReady(($item, itemData) => {
        // $item("#prodNameText").text = itemData.name;
        // $item("#prodDescText").text = itemData.description;


        if (itemData.images?.length) {
            // $item("#prodImage").src = itemData.images[0].fileUrl;
        }


        $item("#deleteProductBtn").onClick(() => {
            deleteProduct(itemData._id);
        });
    });


    // BUTTON HANDLERS
    $w("#addProductToCartBtn").enable();
    $w("#addProductToCartBtn").onClick(addProductToCart);
    $w("#payButton").onClick(payButtonHandler);


    // OPEN / CLOSE (USE HIDE, NOT COLLAPSE)
    $w("#openAddProductBtn").onClick(() => {
        $w("#addProductBox").show();
        $w("#openAddProductBtn").hide();
    });


    $w("#closeAddProductBtn").onClick(() => {
        resetAddProductForm();
        $w("#addProductBox").hide();
        $w("#openAddProductBtn").show();
    });


    // Hide error on input
    prodNameInput.onInput(() => errorText.hide());
    prodDescInput.onInput(() => errorText.hide());

    // ----------------- Country & State Logic -----------------
    const countryDropdown = $w("#country");
    const stateDropdown = $w("#state");

    // Populate Country Dropdown
    countryDropdown.options = COUNTRIES;
    countryDropdown.value = "USA"; // Default USA

    // Populate State Dropdown
    const stateOptions = Object.keys(STATE_TAX_RATES).sort().map(state => ({
        label: state,
        value: state
    }));
    stateDropdown.options = stateOptions;

    // Handle Country Change
    countryDropdown.onChange(() => {
        if (countryDropdown.value === "USA") {
            stateDropdown.enable();
            stateDropdown.required = true;
        } else {
            stateDropdown.disable();
            stateDropdown.required = false;
            stateDropdown.value = null;
            stateDropdown.resetValidityIndication();
        }
        updateTotals();
    });

    // Handle State Change
    stateDropdown.onChange(() => {
        updateTotals();
    });
});


// ----------------- ADD PRODUCT -----------------


async function addProductToCart() {
    console.log("ADD PRODUCT CLICKED");


    $w("#addProductToCartBtn").disable();
    errorText.hide();


    if (!prodNameInput.value) return showError("Product name is required");
    if (!prodDescInput.value) return showError("Product description is required");


    let uploadedImages = [];


    if ($w("#productImages").value.length > 0) {
        uploadedImages = await $w("#productImages").uploadFiles();
    }


    if (!uploadedImages.length) {
        return showError("Upload at least one image");
    }


    const newProduct = {
        _id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: prodNameInput.value,
        description: prodDescInput.value,
        images: uploadedImages,
        price: 15
    };


    const currentData = $w("#prodList").data || [];
    $w("#prodList").data = [...currentData, newProduct];


    resetAddProductForm();
    updateTotals();
}


// ----------------- DELETE PRODUCT -----------------


function deleteProduct(productId) {
    const updated = $w("#prodList").data.filter(p => p._id !== productId);
    $w("#prodList").data = updated;
    updateTotals();
}


// ----------------- RESET FORM -----------------


function resetAddProductForm() {
    prodNameInput.value = "";
    prodDescInput.value = "";
    $w("#productImages").reset();
    $w("#addProductToCartBtn").enable();
}


// ----------------- ERROR -----------------


function showError(msg) {
    errorText.text = msg;
    errorText.show();
    $w("#addProductToCartBtn").enable();
}


// ----------------- TOTALS -----------------


function calculateTax(subtotal, country, state) {
    let taxRate = INTERNATIONAL_TAX_RATE;
    if (country === "USA") {
        taxRate = STATE_TAX_RATES[state] || 0;
    }
    return subtotal * taxRate;
}


// NEW UPDATE: This frontend function matches the backend logic to provide 
// immediate visual feedback to the user on the summary screen.
function updateTotals() {
    const items = $w("#prodList").data || [];
    const country = $w("#country").value;
    const state = $w("#state").value;


    if (items.length) {
        $w("#withProdsBox").expand();
    } else {
        $w("#withProdsBox").collapse();
    }


    const subtotal = items.reduce((sum, p) => sum + p.price, 0);
    const tax = calculateTax(subtotal, country, state);
    const shipping = 25;
    const total = subtotal + tax + shipping;


    // Formatting for display (assuming these elements exist based on commented out code)
    if ($w("#subtotalText")) $w("#subtotalText").text = subtotal.toLocaleString("en-US", { style: "currency", currency: "USD" });
    if ($w("#taxText")) $w("#taxText").text = tax.toLocaleString("en-US", { style: "currency", currency: "USD" });
    if ($w("#shippingText")) $w("#shippingText").text = shipping.toLocaleString("en-US", { style: "currency", currency: "USD" });
    if ($w("#totalText")) $w("#totalText").text = total.toLocaleString("en-US", { style: "currency", currency: "USD" });
}


// ----------------- VALIDATION -----------------


function validateCheckoutFields() {
    const invalid = [];
    const country = $w("#country").value;

    fieldIdz.forEach(id => {
        const field = $w(id);

        // Skip state validation if not USA
        if (id === "#state" && country !== "USA") {
            return;
        }

        if (!field.value) {
            field.valid = false;
            field.updateValidityIndication();
            setTimeout(() => field.resetValidityIndication(), 3000);
            invalid.push(id);
        }
    });


    return invalid;
}


// ----------------- PAY -----------------


async function payButtonHandler() {
    // $w("#paymentStatus").hide();


    if (validateCheckoutFields().length) {
        $w("#box24").scrollTo();
        return;
    }


    const items = $w("#prodList").data || [];
    if (!items.length) {
        // $w("#paymentStatus").text = "Add at least one product.";
        // $w("#paymentStatus").show();
        return;
    }


    const country = $w("#country").value;
    const state = $w("#state").value;

    const cartLineItems = items.map(p => ({
        name: p.name,
        price: p.price,
        description: p.description
    }));

    try {
        const payment = await runPayment({
            items: cartLineItems,
            country: country,
            state: state,
            userInfo: {
                email: $w("#email").value,
                phone: $w("#phone").value,
                firstName: $w("#firstName").value,
                lastName: $w("#lastName").value
            }
        });


        const result = await wixPayFrontend.startPayment(payment.id, { showThankYouPage: false });


        if (result.status === "Successful") {
            await createProducts(cartLineItems);
            wixLocation.to("/thank-you");
        } else {
            // $w("#paymentStatus").text = `Payment ${result.status}`;
            // $w("#paymentStatus").show();
        }
    } catch (err) {
        console.error(err);
        // $w("#paymentStatus").text = "Payment error.";
        // $w("#paymentStatus").show();
    }
}
