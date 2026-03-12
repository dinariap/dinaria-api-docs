(function () {
  var STORAGE_KEY = 'dinaria_country';
  var COUNTRIES = ['ar', 'br'];

  function apply(country) {
    COUNTRIES.forEach(function (c) {
      var els = document.querySelectorAll('.country-' + c);
      els.forEach(function (el) {
        el.style.display = (country && country !== c) ? 'none' : '';
      });
      var btn = document.getElementById('country-btn-' + c);
      if (btn) {
        btn.classList.toggle('active', country === c);
      }
    });
  }

  function select(country) {
    var current = localStorage.getItem(STORAGE_KEY);
    var next = (current === country) ? null : country;
    if (next) {
      localStorage.setItem(STORAGE_KEY, next);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    apply(next);
  }

  function init() {
    var bar = document.getElementById('country-toggle');
    if (!bar) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-country]');
      if (!btn) return;
      select(btn.dataset.country);
    });

    apply(localStorage.getItem(STORAGE_KEY));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
