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
    const desktop = window.matchMedia('(min-width: 901px)');
    desktop.addEventListener('change', () => { if (desktop.matches) closeMenu(); });
  }

  const prepChecks = [...document.querySelectorAll('[data-prep-check]')];
  const prepStatus = document.querySelector('[data-prep-status]');
  prepChecks.forEach((check) => check.addEventListener('change', () => {
    if (prepStatus) prepStatus.textContent = `${prepChecks.filter((item) => item.checked).length} of ${prepChecks.length} ready`;
  }));

  const bookingConfig = document.getElementById('booking-config');
  if (!bookingConfig) return;
  let config;
  try { config = JSON.parse(bookingConfig.textContent); } catch { return; }
  const choices = [...document.querySelectorAll('input[name="service"]')];
  const summary = document.querySelector('[data-booking-summary]');
  const emailButton = document.querySelector('[data-booking-email]');
  const consent = document.querySelector('[data-booking-consent]');
  const loadButton = document.querySelector('[data-load-calendar]');
  const directLink = document.querySelector('[data-direct-booking]');
  const calendarContainer = document.querySelector('[data-calendar-container]');
  const requested = new URLSearchParams(window.location.search).get('service');
  const requestedChoice = choices.find((choice) => choice.value === requested);
  if (requestedChoice) requestedChoice.checked = true;
  const selectedService = () => config.services.find((service) => service.id === choices.find((choice) => choice.checked)?.value) || config.services[0];
  const approvedUrl = (service) => {
    const url = new URL(service.url);
    if (url.protocol !== 'https:' || url.hostname !== 'calendly.com' || !url.pathname.startsWith('/leighton-hepworth22/')) throw new Error('Invalid booking provider');
    return url;
  };
  const resetCalendar = () => {
    if (calendarContainer) calendarContainer.replaceChildren();
    if (consent) consent.checked = false;
    if (loadButton) { loadButton.disabled = true; loadButton.textContent = 'Load Booking Calendar'; }
    if (directLink) { directLink.hidden = true; directLink.removeAttribute('href'); }
  };
  const updateSelection = () => {
    const service = selectedService();
    if (summary) summary.textContent = `${service.name} · £${service.price} · ${service.minutes} minutes`;
    if (emailButton) {
      emailButton.href = service.emailUrl;
      emailButton.textContent = `Email About ${service.name}`;
    }
    resetCalendar();
  };
  choices.forEach((choice) => choice.addEventListener('change', updateSelection));
  updateSelection();
  if (!config.enabled || !consent || !loadButton || !directLink || !calendarContainer) return;
  consent.addEventListener('change', () => {
    if (!consent.checked) { resetCalendar(); return; }
    try {
      directLink.href = approvedUrl(selectedService()).href;
      directLink.hidden = false;
      loadButton.disabled = false;
    } catch { resetCalendar(); }
  });
  loadButton.addEventListener('click', () => {
    if (!consent.checked || !config.enabled) return;
    const service = selectedService();
    const url = approvedUrl(service);
    url.searchParams.set('embed_domain', window.location.hostname);
    url.searchParams.set('embed_type', 'Inline');
    const frame = document.createElement('iframe');
    frame.className = 'calendar-frame';
    frame.title = `Book ${service.name} with Calendly`;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = url.href;
    const notice = document.createElement('p');
    notice.className = 'calendar-status';
    notice.textContent = 'If the calendar does not appear, use “Open Booking in a New Tab” above or email Leighton. No appointment is confirmed until the booking provider confirms it.';
    calendarContainer.replaceChildren(notice, frame);
    loadButton.disabled = true;
    loadButton.textContent = 'Booking Calendar Loaded';
  });
});
