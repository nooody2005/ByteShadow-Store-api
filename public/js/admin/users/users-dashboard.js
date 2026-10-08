const searchInput = document.getElementById('user-search');
const userCards = document.querySelectorAll('.user-card');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function filterUsers() {
  const searchValue = searchInput.value.toLowerCase().trim();

  userCards.forEach(card => {
    const name = card.dataset.name;
    const email = card.dataset.email;
    const role = card.dataset.role;
    const status = card.dataset.status;

    const matchesSearch =
      name.includes(searchValue) || email.includes(searchValue);

    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'blocked'
        ? status === 'blocked'
        : role === currentFilter && status !== 'blocked');

    // card.style.display = matchesSearch && matchesFilter ? 'flex' : 'none';
    card.style.display = matchesSearch && matchesFilter ? '' : 'none';
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterUsers);
}

filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    filterButtons.forEach(btn => btn.classList.remove('active'));

    this.classList.add('active');
    currentFilter = this.dataset.filter;

    filterUsers();
  });
});
