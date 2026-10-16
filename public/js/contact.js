const contactStatus = document.querySelector('#contact-status');

if (contactStatus) {
  const status = contactStatus.dataset.status;

  const messages = {
    success: 'Your message has been sent successfully!',
    error: 'Something went wrong. Please try again.'
  };

  const alert = document.createElement('div');
  alert.className = `alert alert--${status}`;
  alert.textContent = messages[status];

  document.body.prepend(alert);

  setTimeout(() => alert.remove(), 10000);
}
