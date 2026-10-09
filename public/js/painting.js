import axios from 'axios';
import { showAlert } from './alerts';

const painting = document.querySelector('.painting');
const placeBidBtn = document.getElementById('place-bid');

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


    const amount = document.getElementById('bid').value;
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
      document.querySelector('.current-price .number').textContent = amount;

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

