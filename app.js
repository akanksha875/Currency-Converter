const API_KEY = "845595e83a8f61e4233dc74f"; // Replace with your actual API key from ExchangeRate-API
const BASE_URL = "https://v6.exchangerate-api.com/v6/" + API_KEY + "/latest";

// Example country list mapping currency codes to country codes for flags
const countryList = {
  AED: "AE",
  AFN: "AF",
  XCD: "AG",
  ALL: "AL",
  AMD: "AM",
  ANG: "AN",
  AOA: "AO",
  ARS: "AR",
  AUD: "AU",
  AZN: "AZ",
  EUR: "FR",  // EUR is France for this API example
  GBP: "GB",  // GBP is UK for this API example
  INR: "IN",  // INR is India
  USD: "US",  // USD is United States
  // Add more currency codes and country codes as needed
};

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selected currency options
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update flag when currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to fetch exchange rates and display result
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Handle case when amount is empty or invalid
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Constructing URL for new API
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}`;

  console.log(`Fetching data from: ${URL}`); // Debug log

  try {
    // Fetch data from the new API
    let response = await fetch(URL);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Error fetching exchange rates');
    }

    let data = await response.json();
    console.log("API Response Data:", data); // Debug log

    // Get the conversion rate
    let rate = data.conversion_rates[toCurr.value];
    if (!rate) {
      throw new Error(`Exchange rate not found for ${toCurr.value}`);
    }

    // Calculate the final amount based on the exchange rate
    let finalAmount = amtVal * rate;

    // Display the conversion result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    // Display error message if something goes wrong
    console.error(error); // Log the error for debugging
    msg.innerText = `Error: ${error.message}`;
  }
};

// Function to update flag image when a currency is selected
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  if (countryCode) {
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  }
};

// Add event listener for button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Run on page load to display initial exchange rate
window.addEventListener("load", () => {
  updateExchangeRate();
});
