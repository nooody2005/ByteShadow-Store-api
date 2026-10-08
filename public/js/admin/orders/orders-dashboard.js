// =========================
// Search
// =========================

const searchInput = document.getElementById('order-search');
const orderCards = document.querySelectorAll('.painting-card');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function filterOrders() {
  const searchValue = searchInput.value.toLowerCase().trim();

  orderCards.forEach(card => {
    const status = card.dataset.status;
    const searchData = card.dataset.search.toLowerCase();

    const matchesSearch = searchData.includes(searchValue);

    const matchesFilter = currentFilter === 'all' || status === currentFilter;

    card.style.display = matchesSearch && matchesFilter ? 'flex' : 'none';
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterOrders);
}

// =========================
// Status Filters
// =========================

filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    this.classList.add('active');

    currentFilter = this.dataset.status;

    filterOrders();
  });
});

// =========================
// Show / Hide Status Edit
// =========================

const editStatusButtons = document.querySelectorAll('.edit-status-btn');

editStatusButtons.forEach(button => {
  button.addEventListener('click', function() {
    const content = this.closest('.content');

    const statusEdit = content.querySelector('.status-edit');

    statusEdit.style.display =
      statusEdit.style.display === 'none' ? 'flex' : 'none';
  });
});

// =========================
// Confirm Status
// =========================

const confirmStatusButtons = document.querySelectorAll('.confirm-status');

confirmStatusButtons.forEach(button => {
  button.addEventListener('click', async function() {
    const orderId = this.dataset.orderId;

    const content = this.closest('.content');

    const statusEdit = content.querySelector('.status-edit');

    const select = statusEdit.querySelector('.order-status-select');

    const newStatus = select.value;

    try {
      const response = await fetch(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          shippingStatus: newStatus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status');
      }

      // =========================
      // Cancelled
      // =========================

      if (newStatus === 'cancelled') {
        window.location.href =
          '/admin/orders?message=Order cancelled successfully';

        return;
      }

      const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

      // Update shipping status
      const shippingStatus = content.querySelector('.order-shipping-status');

      if (shippingStatus) {
        shippingStatus.textContent = statusText;
      }

      // Update header status
      const orderStatus = content.querySelector('.painting-title .size');

      if (orderStatus) {
        orderStatus.textContent = statusText;
      }

      // Update card data-status
      const card = this.closest('.painting-card');

      if (card) {
        card.dataset.status = newStatus;
      }

      // Hide edit area
      statusEdit.style.display = 'none';
    } catch (err) {
      console.error(err);

      alert(err.message);
    }
  });
});
