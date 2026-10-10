const searchInput = document.getElementById('auction-search');
const auctionCards = document.querySelectorAll('.painting-card');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function filterAuctions() {
  const searchValue = searchInput.value.toLowerCase().trim();

  auctionCards.forEach(card => {
    const name = card.dataset.name;
    const status = card.dataset.status;

    const matchesSearch = name.includes(searchValue);

    const matchesFilter = currentFilter === 'all' || status === currentFilter;

    card.style.display = matchesSearch && matchesFilter ? '' : 'none';
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterAuctions);
}

filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    this.classList.add('active');
    currentFilter = this.dataset.status;

    filterAuctions();
  });
});

document.querySelectorAll('[data-auction-id]').forEach(button => {
  if (!button.classList.contains('edit-btn')) return;

  button.addEventListener('click', async () => {
    const auctionStart = prompt(
      'Enter auction start date and time (e.g. 2026-10-15T18:00)'
    );

    if (!auctionStart) return;

    const auctionEnd = prompt(
      'Enter auction end date and time (e.g. 2026-10-20T18:00)'
    );

    if (!auctionEnd) return;

    try {
      const response = await fetch(
        `/admin/auctions/${button.dataset.auctionId}/re-auction`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auctionStart, auctionEnd })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not start the auction');
      }

      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });
});


// Show or hide the new auction form
document.querySelectorAll('.start-auction-btn').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.painting-card');
    const form = card.querySelector('.re-auction-form');

    form.hidden = !form.hidden;
  });
});

// Submit the new auction dates
document.querySelectorAll('.re-auction-form').forEach(form => {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const auctionId = this.dataset.auctionId;
    const auctionStart = this.elements.auctionStart.value;
    const auctionEnd = this.elements.auctionEnd.value;

    if (new Date(auctionStart) <= new Date()) {
      alert('Auction start must be in the future.');
      return;
    }

    if (new Date(auctionEnd) <= new Date(auctionStart)) {
      alert('Auction end must be after auction start.');
      return;
    }

    try {
      const response = await fetch(
        `/admin/auctions/${auctionId}/re-auction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            auctionStart,
            auctionEnd
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not start new auction');
      }

      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  });
});