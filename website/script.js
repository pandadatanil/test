document.addEventListener('DOMContentLoaded', function () {
  var html = document.documentElement;

  // Theme toggle
  var themeToggle = document.getElementById('theme-toggle');
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (themeToggle) { themeToggle.setAttribute('aria-pressed', String(theme === 'dark')); }
  }
  var initial = html.getAttribute('data-theme') || 'light';
  setTheme(initial);
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Mobile nav toggle
  var nav = document.querySelector('.primary-nav');
  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.getElementById('primary-menu');
  if (nav && navToggle && navList) {
    navToggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      navToggle.setAttribute('aria-expanded', String(!open));
    });

    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          nav.setAttribute('data-open', 'false');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Dynamic year
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }
});
