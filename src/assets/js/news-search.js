// Newsroom search box (legacy widget carried over from the previous website).
// Filters the news items on the page and shows a summary of the search.
(function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  if (!query) return;

  const items = document.querySelectorAll('[data-news-item]');
  let matches = 0;
  items.forEach((item) => {
    const hit = item.textContent.toLowerCase().includes(query.toLowerCase());
    item.hidden = !hit;
    if (hit) matches += 1;
  });

  document.getElementById('q').value = query;
  const summary = document.getElementById('search-summary');
  summary.textContent = matches + ' result(s) for ';
  const strong = document.createElement('strong');
  strong.textContent = query;
  summary.appendChild(strong);
})();
