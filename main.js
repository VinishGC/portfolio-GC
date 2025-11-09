// main.js
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contact-form');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Determine initial theme
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  setTheme(initial);

  // Theme toggle handler
  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  });

  function setTheme(mode){
    root.setAttribute('data-theme', mode);
    // Update button label and aria
    if (themeToggle){
      const isDark = mode === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      const label = themeToggle.querySelector('.theme-label');
      if (label) label.textContent = isDark ? 'Light' : 'Dark';
    }
  }

  // Mobile menu toggle
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('--open', !expanded);
  });

  // Close menu when clicking a link (mobile)
  siteNav?.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.matches('a')){
      siteNav.classList.remove('--open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Contact form validation (client-side only)
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const errors = {
      name: '',
      email: '',
      message: ''
    };

    // Name
    if (!name.value.trim()){
      errors.name = 'Please enter your name.';
    } else if (name.value.trim().length > 80){
      errors.name = 'Name is too long.';
    }

    // Email
    if (!email.value.trim()){
      errors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){
      errors.email = 'Please enter a valid email.';
    }

    // Message
    if (!message.value.trim()){
      errors.message = 'Please enter a message.';
    } else if (message.value.trim().length < 10){
      errors.message = 'Message should be at least 10 characters.';
    }

    // Render errors
    setError('name', errors.name);
    setError('email', errors.email);
    setError('message', errors.message);

    const hasError = Object.values(errors).some(Boolean);
    const status = document.getElementById('form-errors');
    if (status){
      status.textContent = hasError ? 'Please fix errors above.' : 'Thanks! This demo does not send emails.';
    }

    if (!hasError){
      // Demo "success" reset
      form.reset();
    }
  });

  function setError(field, msg){
    const el = document.getElementById(`error-${field}`);
    if (el) el.textContent = msg || '';
  }
})();
