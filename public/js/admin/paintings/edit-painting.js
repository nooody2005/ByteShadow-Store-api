document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-painting-form');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            window.location.href =
                '/admin/paintings?message=Painting updated successfully';

        } catch (err) {
            alert(err.message);
        }
    });
});

