import axios from 'axios';
import { showAlert } from './alerts';

const payButtons = document.querySelectorAll('.pay-btn');

if (payButtons.length) {
  payButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const orderId = btn.dataset.orderId;

      try {
        btn.textContent = 'Redirecting...';
        btn.disabled = true;

        const res = await axios({
          method: 'POST',
          url: `/api/v1/orders/${orderId}/pay`
        });

        if (res.data.status === 'success') {
          window.location.href = res.data.data.checkoutUrl;
        }
      } catch (err) {
        btn.textContent = 'Pay Now';
        btn.disabled = false;

        showAlert(
          'error',
          err.response?.data?.message ||
            'Could not start payment. Please try again.'
        );
      }
    });
  });
}
