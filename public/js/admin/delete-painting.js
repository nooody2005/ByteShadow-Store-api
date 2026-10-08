const deletePaintingButtons = document.querySelectorAll('.delete-btn');

deletePaintingButtons.forEach(button => {
  button.addEventListener('click', async function() {
    const paintingId = this.dataset.paintingId;

    const confirmed = confirm('Are you sure you want to delete this painting?');

    if (!confirmed) return;

    try {
      const res = await fetch(`/admin/paintings/${paintingId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        window.location.href =
          '/admin/paintings?message=Painting deleted successfully';
      } else {
        alert('Failed to delete painting');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  });
});
