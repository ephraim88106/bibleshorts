(function () {
  const KEY = 'bs-lang';

  function apply(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'ko';

    document.querySelectorAll('[data-en]').forEach((el) => {
      if (el.dataset.ko === undefined) el.dataset.ko = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.ko;
    });

    document.querySelectorAll('[data-en-alt]').forEach((el) => {
      if (el.dataset.koAlt === undefined) el.dataset.koAlt = el.getAttribute('alt') || '';
      el.setAttribute('alt', lang === 'en' ? el.dataset.enAlt : el.dataset.koAlt);
    });

    const title = document.querySelector('title');
    if (title && title.dataset.en) {
      if (title.dataset.ko === undefined) title.dataset.ko = title.textContent;
      title.textContent = lang === 'en' ? title.dataset.en : title.dataset.ko;
    }

    document.querySelectorAll('.lang-toggle').forEach((b) => {
      b.textContent = lang === 'en' ? '한국어' : 'EN';
      b.setAttribute('aria-label', lang === 'en' ? 'Switch to Korean' : 'Switch to English');
    });
  }

  function current() {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'ko';
  }

  function init() {
    apply(current());
    document.querySelectorAll('.lang-toggle').forEach((b) => {
      b.addEventListener('click', () => {
        const next = current() === 'ko' ? 'en' : 'ko';
        localStorage.setItem(KEY, next);
        apply(next);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
