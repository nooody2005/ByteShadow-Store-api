import axios from 'axios';
import { showAlert } from './alerts';

const painting = document.querySelector('.painting');
const placeBidBtn = document.getElementById('place-bid');

if (placeBidBtn) {

    console.log('PAINTING:', painting);
    console.log('PAINTING ID:', painting.dataset.paintingId);
  placeBidBtn.addEventListener('click', async () => {
    const userId = painting.dataset.userId;

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

      if (res.data.status === 'success') {
        showAlert('success', 'Your bid was placed successfully ^_^');

        document.querySelector('.current-price .number').textContent = amount;
      }
    } catch (err) {
      showAlert(
        'error',
        err.response?.data?.message || 'Something went wrong. Try again :)'
      );
    }
  });
}
