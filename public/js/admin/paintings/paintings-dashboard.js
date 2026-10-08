const searchInput = document.getElementById('painting-search');
const paintingCards = document.querySelectorAll('.painting-card');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function filterPaintings() {
  const searchValue = searchInput.value.toLowerCase().trim();

  paintingCards.forEach(card => {
    const status = card.dataset.status;
    const name = card.dataset.name;

    const matchesSearch = name.includes(searchValue);

    const matchesFilter = currentFilter === 'all' || status === currentFilter;

    if (matchesSearch && matchesFilter) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Search
if (searchInput) {
  searchInput.addEventListener('input', filterPaintings);
}

// Status Filter
filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    this.classList.add('active');

    currentFilter = this.dataset.status;

    filterPaintings();
  });
});
