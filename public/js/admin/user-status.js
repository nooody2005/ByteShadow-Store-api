const blockButton = document.querySelector('.block-user');

if (blockButton) {
  blockButton.addEventListener('click', async function() {
    const userId = this.dataset.userId;
    const action = this.textContent.trim();

    const confirmed = confirm(
      `Are you sure you want to ${action.toLowerCase()} this user?`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/admin/users/${userId}/status`, {
        method: 'PATCH'
      });

      if (!res.ok) {
        throw new Error('Failed to update user status');
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to update user status');
    }
  });
}
