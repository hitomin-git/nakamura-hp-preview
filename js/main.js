const toggle = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});
