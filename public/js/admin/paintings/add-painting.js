document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-painting-form');

  console.log('ADD PAINTING SCRIPT LOADED:', !!form);

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    console.log('FORM SUBMIT HANDLER WORKING');

    const image = document.getElementById('image');

    if (!image.files.length) {
      alert('Please upload a main image before saving the painting.');
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/v1/paintings', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      window.location.href =
        '/admin/paintings?message=Painting added successfully';
    } catch (err) {
      alert(err.message);
    }
  });
});
