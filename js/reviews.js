(() => {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  const allowedHosts = new Set(['nakamuraseitai.jp']);
  const sourceUrl = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && allowedHosts.has(url.hostname) ? url.href : null;
    } catch { return null; }
  };
  const data = Array.isArray(window.nakamuraReviews) ? window.nakamuraReviews : [];
  const reviews = data.filter(review => review && review.verified === true &&
    typeof review.author === 'string' && review.author.trim() &&
    typeof review.text === 'string' && review.text.trim() &&
    Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 && sourceUrl(review.sourceUrl));
  if (!reviews.length) return;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const cards = reviews.map(review => {
    const card = element('article', 'review-card');
    const rating = element('div', 'review-rating');
    const stars = element('span', 'review-stars', '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating));
    stars.setAttribute('aria-hidden', 'true');
    rating.append(stars, element('span', '', `5点満点中${review.rating}点`));
    card.append(rating, element('p', 'review-body', review.text));
    const author = element('div', 'review-author');
    const avatar = element('span', 'review-avatar', '声');
    avatar.setAttribute('aria-hidden', 'true');
    author.append(avatar, element('span', '', review.author));
    card.append(author);
    return card;
  });
  grid.replaceChildren(...cards);
  document.getElementById('reviews-intro').textContent = '公式HPに掲載しているお客様の声をご紹介します。';
  document.getElementById('reviews-note').remove();
})();
