// ===== 매일 성경 인물 묵상 =====
// posts/index.json → 메타데이터
// posts/content/{id}.html → 본문 HTML

const POSTS_INDEX = '/posts/index.json';
const CONTENT_DIR = '/posts/content/';

let allPosts = [];
let currentPage = 1;
const PER_PAGE = 12;

// 인물 이름 매핑 (id prefix → 한글 이름)
const CHARACTER_NAMES = {
  abraham: '아브라함',
  isaac: '이삭',
  jacob: '야곱',
  moses: '모세',
  david: '다윗',
  ruth: '룻',
  peter: '베드로',
  paul: '바울'
};

document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  loadData();
});

// ===== Navigation =====
function setupNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-toggle') && !e.target.closest('.nav-menu')) {
        menu.classList.remove('open');
      }
    });
  }
}

// ===== Load Data =====
async function loadData() {
  try {
    const res = await fetch(POSTS_INDEX);
    if (res.ok) allPosts = await res.json();
  } catch { /* fallback empty */ }

  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') renderHome();
  else if (path === '/board.html') renderBoard();
  else if (path === '/series.html') renderSeriesPage();
  else if (path === '/post.html') renderPost();
}

// ===== Utilities =====
function formatDate(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,'0')}.${String(dt.getDate()).padStart(2,'0')}`;
}

function getCharacterKey(id) {
  // abraham_day01 → abraham, abraham → abraham
  const match = id.match(/^([a-z]+)/);
  return match ? match[1] : id;
}

function getSeriesMap() {
  const map = {};
  allPosts.forEach(p => {
    const key = getCharacterKey(p.id);
    if (!map[key]) map[key] = [];
    map[key].push(p);
  });
  // Sort each series by date
  Object.values(map).forEach(arr => arr.sort((a, b) => new Date(a.date) - new Date(b.date)));
  return map;
}

// ===== HOME =====
function renderHome() {
  renderLatestPost();
  renderSeriesGrid();
  renderRecentList();
}

function renderLatestPost() {
  const el = document.getElementById('latest-post');
  if (!el || !allPosts.length) return;
  const p = allPosts[0];
  el.innerHTML = `
    <p class="lp-date">${formatDate(p.date)}</p>
    <span class="lp-badge">${p.category}</span>
    <h3 class="lp-title">${p.title}</h3>
    <p class="lp-verse">${p.verseText} — ${p.verse}</p>
    <p class="lp-excerpt">${p.excerpt}</p>
    <a href="/post.html?id=${p.id}" class="lp-link">전체 묵상 읽기 &rarr;</a>
  `;
}

function renderSeriesGrid() {
  const el = document.getElementById('series-grid');
  if (!el) return;
  const map = getSeriesMap();
  const keys = Object.keys(map);

  el.innerHTML = keys.map(key => {
    const posts = map[key];
    const name = CHARACTER_NAMES[key] || key;
    return `
      <div class="series-card" onclick="location.href='/series.html#${key}'">
        <h3 class="sc-name">${name}</h3>
        <p class="sc-count">${posts.length}편의 묵상</p>
        <ul class="sc-list">
          ${posts.slice(0, 3).map(p => `<li><a href="/post.html?id=${p.id}">${p.title}</a></li>`).join('')}
          ${posts.length > 3 ? `<li style="color:var(--accent)">+ ${posts.length - 3}편 더보기</li>` : ''}
        </ul>
      </div>
    `;
  }).join('');
}

function renderRecentList() {
  const el = document.getElementById('recent-list');
  if (!el) return;
  const recent = allPosts.slice(0, 6);
  el.innerHTML = recent.map(p => postItemHTML(p)).join('');
}

// ===== BOARD =====
function renderBoard(filter = 'all', search = '') {
  const el = document.getElementById('board-list');
  if (!el) return;

  let filtered = allPosts;
  if (filter !== 'all') filtered = filtered.filter(p => p.category === filter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.verse.toLowerCase().includes(q));
  }

  const total = Math.ceil(filtered.length / PER_PAGE);
  const page = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  if (!page.length) {
    el.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:40px">결과가 없습니다.</p>';
  } else {
    el.innerHTML = page.map(p => postItemHTML(p)).join('');
  }

  renderPagination(total);
  setupBoardControls();
}

function setupBoardControls() {
  const input = document.getElementById('search-input');
  const btns = document.querySelectorAll('.filter-btn');

  if (input && !input.dataset.bound) {
    input.dataset.bound = '1';
    input.addEventListener('input', () => { currentPage = 1; renderBoard(getActiveFilter(), input.value); });
  }

  btns.forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPage = 1;
      renderBoard(btn.dataset.filter, document.getElementById('search-input')?.value || '');
    });
  });
}

function getActiveFilter() {
  const active = document.querySelector('.filter-btn.active');
  return active ? active.dataset.filter : 'all';
}

function renderPagination(total) {
  const el = document.getElementById('pagination');
  if (!el || total <= 1) { if (el) el.innerHTML = ''; return; }
  el.innerHTML = Array.from({length: total}, (_, i) =>
    `<button class="${i+1 === currentPage ? 'active' : ''}" onclick="goPage(${i+1})">${i+1}</button>`
  ).join('');
}

function goPage(n) {
  currentPage = n;
  renderBoard(getActiveFilter(), document.getElementById('search-input')?.value || '');
  window.scrollTo({top: 200, behavior: 'smooth'});
}
// expose globally
window.goPage = goPage;

// ===== SERIES PAGE =====
function renderSeriesPage() {
  const el = document.getElementById('series-full');
  if (!el) return;
  const map = getSeriesMap();

  el.innerHTML = Object.keys(map).map(key => {
    const posts = map[key];
    const name = CHARACTER_NAMES[key] || key;
    return `
      <div class="sf-group" id="${key}">
        <h2 class="sf-group-title">${name} 시리즈 (${posts.length}편)</h2>
        <div class="sf-items">
          ${posts.map((p, i) => `
            <div class="sf-item" onclick="location.href='/post.html?id=${p.id}'">
              <span class="sf-num">${String(i+1).padStart(2,'0')}</span>
              <span class="sf-title">${p.title}</span>
              <span class="sf-date">${formatDate(p.date)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// ===== POST PAGE =====
async function renderPost() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { location.href = '/board.html'; return; }

  const post = allPosts.find(p => p.id === id);
  if (!post) {
    document.getElementById('post-header').innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-light)">묵상을 찾을 수 없습니다.</p>';
    return;
  }

  document.title = `${post.title} — 매일 성경 인물 묵상`;

  document.getElementById('post-header').innerHTML = `
    <p class="ph-date">${formatDate(post.date)}</p>
    <span class="ph-badge">${post.category}</span>
    <h1 class="ph-title">${post.title}</h1>
    <p class="ph-verse">${post.verseText} — ${post.verse}</p>
  `;

  // Load HTML content
  try {
    const res = await fetch(`${CONTENT_DIR}${id}.html`);
    if (res.ok) {
      document.getElementById('post-content').innerHTML = await res.text();
    } else {
      document.getElementById('post-content').innerHTML = '<p>내용을 불러올 수 없습니다.</p>';
    }
  } catch {
    document.getElementById('post-content').innerHTML = '<p>내용을 불러올 수 없습니다.</p>';
  }

  // Nav links (prev/next in same series)
  const key = getCharacterKey(id);
  const series = allPosts.filter(p => getCharacterKey(p.id) === key).sort((a, b) => new Date(a.date) - new Date(b.date));
  const idx = series.findIndex(p => p.id === id);
  const nav = document.getElementById('post-nav-links');
  if (nav) {
    let html = '';
    if (idx > 0) html += `<a href="/post.html?id=${series[idx-1].id}">&larr; 이전</a>`;
    if (idx < series.length - 1) html += `<a href="/post.html?id=${series[idx+1].id}">다음 &rarr;</a>`;
    nav.innerHTML = html;
  }
}

// ===== Shared HTML =====
function postItemHTML(p) {
  return `
    <div class="post-item" onclick="location.href='/post.html?id=${p.id}'">
      <span class="pi-date">${formatDate(p.date)}</span>
      <span class="pi-badge">${p.category}</span>
      <span class="pi-title">${p.title}</span>
      <span class="pi-arrow">&rsaquo;</span>
    </div>
  `;
}
