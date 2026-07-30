/* ── Dinaria API Docs — app.js ───────────────────────────────────── */

let NAV = null;
let currentFile = null;

const DEFAULT_PAGE = 'content/index.md';
const REDOC_CDN = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
const SPEC_URL = 'dinaria_api_v1.yaml';

/* ── Country filter ─────────────────────────────────────────────── */
const COUNTRY_KEY = 'dinaria_country';

function selectCountry(c) {
  const current = localStorage.getItem(COUNTRY_KEY);
  const next = current === c ? null : c;
  if (next) {
    localStorage.setItem(COUNTRY_KEY, next);
  } else {
    localStorage.removeItem(COUNTRY_KEY);
  }
  applyCountry(next || getPreferredCountry());
}

function getAvailableCountries() {
  const available = [];
  if (document.querySelector('.country-ar')) available.push('ar');
  if (document.querySelector('.country-br')) available.push('br');
  if (document.querySelector('.country-ve')) available.push('ve');
  return available;
}

function getPreferredCountry() {
  const available = getAvailableCountries();
  const saved = localStorage.getItem(COUNTRY_KEY);
  if (saved && available.includes(saved)) return saved;
  return available[0] || null;
}

function setupCountryToggle() {
  const toggle = document.getElementById('country-toggle');
  if (!toggle) return;

  const available = getAvailableCountries();
  toggle.hidden = available.length === 0;

  ['ar', 'br', 've'].forEach(code => {
    const btn = document.getElementById('cbtn-' + code);
    if (!btn) return;
    const show = available.includes(code);
    btn.hidden = !show;
    btn.style.display = show ? 'inline-flex' : 'none';
  });

  if (available.length > 0) {
    applyCountry(getPreferredCountry());
  }
}

function applyCountry(c) {
  const available = getAvailableCountries();
  const current = (c && available.includes(c)) ? c : (available[0] || null);

  ['ar', 'br', 've'].forEach(code => {
    const btn = document.getElementById('cbtn-' + code);
    if (btn) btn.classList.toggle('active', current === code);
  });

  document.querySelectorAll('.country-ar').forEach(el => {
    el.style.display = current === 'ar' ? '' : 'none';
  });

  document.querySelectorAll('.country-br').forEach(el => {
    el.style.display = current === 'br' ? '' : 'none';
  });

  document.querySelectorAll('.country-ve').forEach(el => {
    el.style.display = current === 've' ? '' : 'none';
  });
}

/* ── Marked config — allow HTML blocks ──────────────────────────── */
marked.use({ breaks: false, gfm: true, html: true });

/* ── Bootstrap ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  NAV = await fetchNav();
  renderNav();
  setupCountryToggle();

  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash === 'apiref') {
    loadApiRef();
  } else if (hash && hash.endsWith('.md')) {
    loadPage('content/' + hash, labelFromFile(hash));
  } else {
    loadPage(DEFAULT_PAGE, 'Dinaria API');
  }

  window.addEventListener('hashchange', onHashChange);
});

/* ── Nav fetch ──────────────────────────────────────────────────── */
async function fetchNav() {
  try {
    const r = await fetch('data/nav.json');
    return await r.json();
  } catch (e) {
    console.error('Failed to load nav.json', e);
    return [];
  }
}

/* ── Nav render ─────────────────────────────────────────────────── */
function renderNav() {
  const tree = document.getElementById('nav-tree');
  tree.innerHTML = '';
  (NAV || []).forEach(item => {
    if (item.children) {
      tree.appendChild(buildSection(item));
    } else {
      tree.appendChild(buildLink(item.file, item.title, true));
    }
  });
  markActive(currentFile);
}

function buildSection(section) {
  const wrap = document.createElement('div');
  wrap.className = 'nav-section';

  const hdr = document.createElement('div');
  hdr.className = 'nav-section-header';
  hdr.innerHTML = `<span>${section.title}</span>
    <svg class="nav-arrow" width="12" height="12" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="9 18 15 12 9 6"/>
    </svg>`;

  const kids = document.createElement('div');
  kids.className = 'nav-children collapsed';
  section.children.forEach(child => {
    kids.appendChild(buildLink(child.file, child.title, false));
  });

  hdr.addEventListener('click', () => {
    const open = hdr.classList.toggle('open');
    kids.classList.toggle('collapsed', !open);
  });

  wrap.appendChild(hdr);
  wrap.appendChild(kids);
  return wrap;
}

function buildLink(file, title, topLevel) {
  const a = document.createElement('a');
  if (file === 'apiref') {
    a.href = '#apiref';
  } else {
    a.href = '#' + encodeURIComponent(file.replace('content/', ''));
  }
  a.className = 'nav-link' + (topLevel ? ' top-level' : '');
  if (file === 'apiref') a.className += ' nav-link-apiref';
  a.dataset.file = file;
  a.textContent = title;
  a.addEventListener('click', e => {
    e.preventDefault();
    if (file === 'apiref') {
      loadApiRef();
    } else {
      loadPage(file, title);
    }
    closeSidebar();
  });
  return a;
}

function markActive(file) {
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.file === file);
  });
}

/* ── Page load (Markdown) ───────────────────────────────────────── */
async function loadPage(file, title) {
  currentFile = file;
  markActive(file);
  history.replaceState(null, '', '#' + encodeURIComponent(file.replace('content/', '')));

  // Restore content-inner to normal mode if coming from apiref
  const inner = document.getElementById('content-inner');
  inner.className = 'content-inner';
  inner.innerHTML = '<div class="loading">Loading…</div>';

  try {
    const r = await fetch(file, { cache: 'no-cache' });
    if (!r.ok) throw new Error(`${r.status} — ${file}`);
    let md = await r.text();
    // Strip Jekyll / YAML front matter (handles optional leading whitespace)
    md = md.replace(/^\s*---[\s\S]*?---\s*\n?/, '');
    inner.innerHTML = marked.parse(md, { html: true });

    const h1 = inner.querySelector('h1');
    document.getElementById('topbar-title').textContent =
      h1 ? h1.textContent : title;

    // Intercept in-content links so hash routing handles them
    inner.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href === '#apiref') {
        a.addEventListener('click', e => { e.preventDefault(); loadApiRef(); });
      } else if (href && href.endsWith('.md')) {
        const target = resolveDocHref(href, currentFile);
        if (target) {
          a.addEventListener('click', e => {
            e.preventDefault();
            const file = target.startsWith('content/') ? target : 'content/' + target;
            loadPage(file, labelFromFile(target.replace(/^content\//, '')));
          });
        }
      }
    });

    setupCountryToggle();
    document.getElementById('content').scrollTop = 0;
  } catch (e) {
    inner.innerHTML = `<div class="error-msg">
      <h2>Page not found</h2><p>${file}</p><small>${e.message}</small>
    </div>`;
  }
}

/* ── API Reference (Redoc) ──────────────────────────────────────── */
async function loadApiRef() {
  currentFile = 'apiref';
  markActive('apiref');
  history.replaceState(null, '', '#apiref');
  document.getElementById('topbar-title').textContent = 'API Reference';

  const inner = document.getElementById('content-inner');
  inner.className = 'content-inner redoc-mode';
  inner.innerHTML = '<div class="loading" style="padding:40px 40px">Loading API Reference…</div>';
  document.getElementById('content').scrollTop = 0;

  setupCountryToggle();

  // Lazy-load Redoc bundle only when needed
  if (!window.Redoc) {
    try {
      await loadScript(REDOC_CDN);
    } catch (e) {
      inner.innerHTML = `<div class="error-msg" style="margin:40px">
        <h2>Failed to load API Reference</h2>
        <p>Could not load the Redoc renderer. Check your internet connection.</p>
        <small>${e}</small>
      </div>`;
      return;
    }
  }

  inner.innerHTML = '';

  Redoc.init(SPEC_URL, {
    scrollYOffset: 0,
    hideDownloadButton: false,
    disableSearch: false,
    nativeScrollbars: true,
    theme: {
      colors: {
        primary: { main: '#2563eb' }
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '15px',
        lineHeight: '1.7',
        headings: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: '600'
        },
        code: {
          fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
          fontSize: '13px'
        }
      },
      sidebar: {
        backgroundColor: '#0f172a',
        textColor: '#94a3b8',
        activeTextColor: '#60a5fa',
        width: '260px'
      },
      rightPanel: {
        backgroundColor: '#1e293b'
      }
    }
  }, inner);
}

/* ── Hash routing ───────────────────────────────────────────────── */
function onHashChange() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash === 'apiref') {
    if (currentFile !== 'apiref') loadApiRef();
    return;
  }
  if (hash && hash.endsWith('.md')) {
    const file = 'content/' + hash;
    if (file !== currentFile) loadPage(file, labelFromFile(hash));
  }
}

/* ── Helpers ────────────────────────────────────────────────────── */
function goHome() { loadPage(DEFAULT_PAGE, 'Dinaria API'); }

function resolveDocHref(href, currentDocFile) {
  if (!href || !href.endsWith('.md')) return null;
  const clean = href.replace(/^#/, '').replace(/^\.\//, '');
  if (!clean) return null;
  if (clean === 'apiref') return null;
  if (clean.startsWith('content/')) return clean;
  if (clean.startsWith('/')) return clean.slice(1);
  const baseDir = currentDocFile ? currentDocFile.replace(/[^/]+$/, '') : 'content/';
  return baseDir + clean;
}

function labelFromFile(path) {
  return path.split('/').pop().replace('.md', '')
    .replace(/^\d+_/, '').replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('visible');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('visible');
}
