document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (menuButton && menu) {
    const closeMenu = (returnFocus = false) => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      if (returnFocus) menuButton.focus();
    };
    menuButton.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
    });
    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
    const desktop = window.matchMedia('(min-width: 1101px)');
    desktop.addEventListener('change', () => { if (desktop.matches) closeMenu(); });
  }

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const status = carousel.querySelector('[data-carousel-status]');
    if (!track || !previous || !next) return;
    const cards = [...track.querySelectorAll('.product-card')];
    const getStep = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    const update = () => {
      previous.disabled = track.scrollLeft < 3;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 3;
      if (status && cards.length) {
        const step = getStep();
        const start = Math.round(track.scrollLeft / step) + 1;
        const visible = Math.max(1, Math.round(track.clientWidth / step));
        status.textContent = `Services ${start} to ${Math.min(cards.length, start + visible - 1)} of ${cards.length}`;
      }
    };
    const move = (direction) => track.scrollBy({
      left: direction * getStep(),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
    previous.hidden = false;
    next.hidden = false;
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.target !== track) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    window.addEventListener('resize', update, { passive: true });
    update();
  });

  const sisterStore = document.querySelector('[data-sister-store]');
  const dismiss = document.querySelector('[data-dismiss-sister]');
  if (sisterStore && dismiss) {
    dismiss.hidden = false;
    try { sisterStore.hidden = sessionStorage.getItem('bytova-sister-dismissed') === 'true'; } catch {}
    dismiss.addEventListener('click', () => {
      sisterStore.hidden = true;
      try { sessionStorage.setItem('bytova-sister-dismissed', 'true'); } catch {}
    });
  }
});
