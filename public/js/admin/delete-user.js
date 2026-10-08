// const deleteButtons = document.querySelectorAll('.delete-user, .delete-btn');

// deleteButtons.forEach(button => {
//   button.addEventListener('click', async function() {
//     const userId = this.dataset.userId;

//     const confirmed = confirm('Are you sure you want to delete this user?');

//     if (!confirmed) return;

//     try {
//       const res = await fetch(`/admin/users/${userId}`, {
//         method: 'DELETE'
//       });

//       if (res.ok) {
//         window.location.href = '/admin/users?message=User deleted successfully';
//       } else {
//         alert('Failed to delete user');
//       }
//     } catch (err) {
//       alert('Something went wrong');
//     }
//   });
// });

const deleteButtons = document.querySelectorAll('.delete-user, .delete-btn');

deleteButtons.forEach(button => {
  button.addEventListener('click', async function() {
    const userId = this.dataset.userId;

    const confirmed = confirm('Are you sure you want to delete this user?');

    if (!confirmed) return;

    try {
      const res = await fetch(`/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        window.location.href = '/admin/users?message=User deleted successfully';
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  });
});