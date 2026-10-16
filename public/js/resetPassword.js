import axios from 'axios';
import { showAlert } from './alerts';

const form = document.querySelector('.form--reset-password');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const token = form.dataset.token;

    await resetPassword(password, passwordConfirm, token);
  });
}

const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: { password, passwordConfirm }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password reset successfully!');

      window.setTimeout(() => {
        window.location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Something went wrong');
  }
};
