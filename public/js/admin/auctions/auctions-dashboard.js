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
