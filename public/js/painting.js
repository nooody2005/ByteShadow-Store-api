import axios from 'axios';
import { showAlert } from './alerts';

const painting = document.querySelector('.painting');
const placeBidBtn = document.getElementById('place-bid');

// alert('Bidding file loaded!');


// adding the selected country
// ============================================================
// Exchange rates: 1 unit of currency = how many EGP
const EGP_PER_CURRENCY = {
  EGP: 1,
  KWD: 160,
  SAR: 13.5
};

// Currency for each country
const COUNTRY_CURRENCIES = {
  Egypt: 'EGP',
  Kuwait: 'KWD',
  'Saudi Arabia': 'SAR',
  Other: 'EGP'
};

// Increase amount for each click
const BID_STEPS = {
  EGP: 200,
  KWD: 2,
  SAR: 3
};

let selectedCurrency = 'EGP';

const bidInput = document.getElementById('bid');

// const updateBidStep = () => {
//   if (bidInput) {
//     bidInput.step = BID_STEPS[selectedCurrency];
//   }
// };

// ===========================================================
// converting the currency to match the selected country

const countrySelect = document.getElementById('country');
const otherCountryGroup = document.getElementById('other-country-group');
const otherCountryInput = document.getElementById('other-country');

const getCurrency = country => COUNTRY_CURRENCIES[country] || 'EGP';
// Get the saved country from the database
if (painting?.dataset.userCountry) {
  selectedCurrency = getCurrency(painting.dataset.userCountry);

  console.log('Country:', painting.dataset.userCountry);
  console.log('Currency:', selectedCurrency);
}



// console.log('User Country:', painting.dataset.userCountry);
// console.log('Selected Currency:', selectedCurrency);

// console.log('Country:', painting?.dataset.userCountry);
// console.log('Currency after selection:', selectedCurrency);


if (countrySelect) {
  countrySelect.addEventListener('change', () => {
    const country = countrySelect.value;

    selectedCurrency = getCurrency(country);
    updateDisplayedPrices();
    // updateBidStep();

    const isOther = country === 'Other';

    otherCountryGroup.style.display = isOther ? 'block' : 'none';
    otherCountryInput.required = isOther;
  });
}

// converting amount of salary to selected currency
const toDisplayCurrency = amount =>
  Number(amount) / EGP_PER_CURRENCY[selectedCurrency];

const toEGP = amount => Number(amount) * EGP_PER_CURRENCY[selectedCurrency];

const formatPrice = amount =>
  Number(amount).toLocaleString('en-US', {
    // maximumFractionDigits: 3
    // minimumFractionDigits: 2,
    // maximumFractionDigits: 2
    maximumFractionDigits: 0
  });

//   // Painting details currency conversion
// if (painting) {
//   const currency = getCurrency(painting.dataset.userCountry);
//   const price = document.querySelector('.current-price .number');
//   const currencyElement = document.querySelector('.current-price .currency');

//   if (price && currencyElement) {
//     price.textContent = formatPrice(
//       Number(painting.dataset.currentPrice) / EGP_PER_CURRENCY[currency]
//     );

//     currencyElement.textContent = currency;
//   }
// }
  

  // Overview currency conversion
document.querySelectorAll('.box').forEach(box => {
  const currency = getCurrency(box.dataset.userCountry);
  const price = box.querySelector('.overview-price');
  const currencyElement = box.querySelector('.overview-currency');

  if (!price || !currencyElement) return;

  price.textContent = formatPrice(
    Number(price.textContent) / EGP_PER_CURRENCY[currency]
  );

  currencyElement.textContent = currency;
});

  
  
  // displaying the amount with converted currency
  const updateBidInputCurrency = () => {
    if (!bidInput || !painting) return;
  
    const currentPrice = toDisplayCurrency(Number(painting.dataset.currentPrice));
  
    // bidInput.min = currentPrice;
    bidInput.min = Math.ceil(currentPrice);
    // bidInput.value = currentPrice;
    // bidInput.value = Number(currentPrice.toFixed(2));
    bidInput.value = Math.ceil(currentPrice);
    bidInput.step = BID_STEPS[selectedCurrency];
  };

const updateDisplayedPrices = () => {
  const currentPriceElement = document.querySelector('.current-price .number');

  if (!currentPriceElement || !painting) return;

  const currentPriceEGP = Number(painting.dataset.currentPrice);

  currentPriceElement.textContent = formatPrice(
    toDisplayCurrency(currentPriceEGP)
  );

  const currencyElement = document.querySelector('.current-price .currency');

  if (currencyElement) {
    currencyElement.textContent = selectedCurrency;
  }

  updateBidInputCurrency();
};




// saving the amount of salary in data base with Egyption currency 
// if (painting) {
//   const currentPriceElement = document.querySelector('.current-price .number');

//   painting.dataset.currentPrice = currentPriceElement.textContent
//     .replace(/,/g, '')
//     .trim();
// }

// if (painting) {
//   const currentPriceElement = document.querySelector('.current-price .number');

//   painting.dataset.currentPrice = currentPriceElement.textContent
//     .replace(/,/g, '')
//     .trim();
// }

updateDisplayedPrices();
// updateBidInputCurrency();
// updateBidStep();

// ==========================================================================================



// Mobile Bid Stepper
// const bidInput = document.getElementById('bid');
// const bidStepButtons = document.querySelectorAll('.bid-step');


// const updateBidStep = () => {
//   bidInput.step = BID_STEPS[selectedCurrency];
// };
// updateBidStep();

// bidStepButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     const step = Number(bidInput.step) || 10;
//     const min = Number(bidInput.min) || 0;
//     const current = Number(bidInput.value) || min;
//     const change = Number(button.dataset.step);

//     bidInput.value = Math.max(min, current + change * step / 10);
//     bidInput.dispatchEvent(new Event('input', { bubbles: true }));
//     bidInput.dispatchEvent(new Event('change', { bubbles: true }));
//   });
// });

// Bid Stepper
// const bidInput = document.getElementById('bid');
const bidStepButtons = document.querySelectorAll('.bid-step');



// updateBidStep();

bidStepButtons.forEach(button => {
  button.addEventListener('click', () => {
    const step = BID_STEPS[selectedCurrency];
    const min = Number(bidInput.min) || 0;
    // const current = Number(bidInput.value) || min;
    const current = Number(Number(bidInput.value).toFixed(2)) || min;
    const direction = Number(button.dataset.step) > 0 ? 1 : -1;

    // bidInput.value = Math.max(min, current + direction * step);
    // bidInput.value = Number(
    //   Math.max(min, current + direction * step).toFixed(2)
    // );
    bidInput.value = Math.ceil(Math.max(min, current + direction * step));

    bidInput.dispatchEvent(new Event('input', { bubbles: true }));
    bidInput.dispatchEvent(new Event('change', { bubbles: true }));
  });
});


const userInfoModal = document.getElementById('user-info-modal');
const userInfoForm = document.getElementById('user-info-form');
const modalClose = document.querySelector('.modal-close');


if (placeBidBtn) {

    console.log('PAINTING:', painting);
    console.log('PAINTING ID:', painting.dataset.paintingId);
    placeBidBtn.addEventListener('click', async () => {
    const userId = painting.dataset.userId;

    const userPhone = painting.dataset.userPhone;
    const userCountry = painting.dataset.userCountry;
    const userAddress = painting.dataset.userAddress;

    // Not logged in
    // if (!userId) {
    //   window.location.href = '/login';
    //   return;
    // }

    if (!userId) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    if (!userPhone || !userAddress) {
      userInfoModal.style.display = 'flex';
      return;
    }


    // const amount = document.getElementById('bid').value;
    const amount = toEGP(bidInput.value);
    const paintingId = painting.dataset.paintingId;

    try {
      const res = await axios({
        method: 'POST',
        url: `/api/v1/paintings/${paintingId}/bids`,
        data: {
          amount,
          user: userId
        }
        // data: {
        //   amount
        // }
      });

    //   if (res.data.status === 'success') {
    //     showAlert('success', 'Your bid was placed successfully ^_^');

    //     document.querySelector('.current-price .number').textContent = amount;
    //   }
    if (res.data.status === 'success') {
      // document.querySelector('.current-price .number').textContent = amount;
      painting.dataset.currentPrice = amount;
      updateDisplayedPrices();


      console.log('Final currency:', selectedCurrency);
      console.log(
        'Currency in HTML:',
        document.querySelector('.current-price .currency')?.textContent
      );
      console.log('Current price:', painting?.dataset.currentPrice);

      // document.querySelector(
      //   '.current-price .number'
      // ).textContent = formatPrice(toDisplayCurrency(amount));

      // document.querySelector(
      //   '.current-price .currency'
      // ).textContent = selectedCurrency;



      if (res.data.data.isNewAuction) {
        const auctionEnd = new Date(res.data.data.auctionEnd);

        const formattedDate = auctionEnd.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });

        showAlert(
          'success',
          `🎨 New auction started! Your bid has started a new 14-day auction. Ends on ${formattedDate}.`
        );
      } else {
        showAlert('success', 'Your bid was placed successfully ^_^');
      }
    }
    } catch (err) {
      showAlert(
        'error',
        err.response?.data?.message || 'Something went wrong. Try again :)'
      );
    }
  });



  // What happened if U're already logged in and entered the place bid button 
  if (userInfoForm) {
    userInfoForm.addEventListener('submit', async e => {
      e.preventDefault();

      const phone = document.getElementById('phone').value;
      const country = document.getElementById('country').value;
      const address = document.getElementById('address').value;

      try {
        // Update user information
        await axios({
          method: 'PATCH',
          url: '/api/v1/users/updateMe',
          data: {
            phone,
            country,
            address
          }
        });

        // Close modal
        userInfoModal.style.display = 'none';

        showAlert(
          'success',
          'Your information has been saved successfully ^_^'
        );

        // Update the data stored in the page
        painting.dataset.userPhone = phone;
        painting.dataset.userCountry = country;
        selectedCurrency = getCurrency(country);
        updateDisplayedPrices();
        painting.dataset.userAddress = address;

        // Place the bid automatically
        placeBidBtn.click();
      } catch (err) {
        showAlert(
          'error',
          err.response?.data?.message ||
            'Could not save your information. Try again :)'
        );
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      userInfoModal.style.display = 'none';
    });
  }
}

