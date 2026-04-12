// ===== 매일 성경 인물 묵상 =====
// posts/index.json → 메타데이터
// posts/content/{id}.html → 본문 HTML

const POSTS_INDEX = '/posts/index.json';
const CONTENT_DIR = '/posts/content/';

// 인라인 fallback 데이터 (fetch 실패 시 사용)
const FALLBACK_POSTS = [
  {"id":"abraham_day01","date":"2026-04-13","category":"구약","title":"아브라함 (1) - 떠남의 부르심","verse":"창세기 12:1","verseText":"여호와께서 아브람에게 이르시되 너는 너의 고향과 친척과 아버지의 집을 떠나 내가 네게 보여 줄 땅으로 가라","excerpt":"하나님은 우상의 땅 한가운데서 아브람을 부르셨습니다. 고향, 친척, 아버지의 집—가장 깊이 붙잡고 있는 것을 놓으라는 부르심입니다."},
  {"id":"abraham_day02","date":"2026-04-14","category":"구약","title":"아브라함 (2) - 25년의 기다림","verse":"창세기 15:6","verseText":"아브람이 여호와를 믿으니 여호와께서 이를 그의 의로 여기시고","excerpt":"약속을 받은 75세부터 이삭이 태어난 100세까지 25년. 흔들려도 포기하지 않으신 하나님의 신실하심을 봅니다."},
  {"id":"isaac_day01","date":"2026-04-15","category":"구약","title":"이삭 (1) - 조용한 순종의 사람","verse":"창세기 22:7","verseText":"이삭이 그 아버지 아브라함에게 말하여 이르되 내 아버지여 하니 그가 이르되 내 아들아 내가 여기 있노라","excerpt":"이삭은 화려하지 않지만, 모리아 산에서의 조용한 순종으로 하나님의 구원 역사를 이어갔습니다."},
  {"id":"jacob_day01","date":"2026-04-16","category":"구약","title":"야곱 (1) - 속이는 자에서 이스라엘로","verse":"창세기 32:28","verseText":"네 이름을 다시는 야곱이라 부를 것이 아니요 이스라엘이라 부를 것이니 이는 네가 하나님과 및 사람들과 겨루어 이겼음이니라","excerpt":"자기 힘으로 축복을 쟁취하려 했던 야곱. 환도뼈가 부러진 후에야 진정으로 하나님을 붙잡았습니다."},
  {"id":"abraham","date":"2026-04-12","category":"구약","title":"아브라함 - 믿음의 조상","verse":"창세기 12:1-4","verseText":"여호와께서 아브람에게 이르시되 너는 너의 고향과 친척과 아버지의 집을 떠나 내가 네게 보여 줄 땅으로 가라","excerpt":"아브라함은 하나님의 부르심에 순종하여 안정된 삶을 떠나 미지의 땅으로 향했습니다."},
  {"id":"david","date":"2026-04-11","category":"구약","title":"다윗 - 하나님의 마음에 합한 자","verse":"사무엘상 16:7","verseText":"사람은 외모를 보거니와 나 여호와는 중심을 보느니라","excerpt":"다윗은 완벽한 사람이 아니었지만, 항상 하나님께 돌아오는 회개의 마음을 가졌습니다."},
  {"id":"peter","date":"2026-04-10","category":"신약","title":"베드로 - 실패를 딛고 일어선 반석","verse":"마태복음 16:18","verseText":"너는 베드로라 내가 이 반석 위에 내 교회를 세우리니 음부의 권세가 이기지 못하리라","excerpt":"베드로는 예수님을 세 번 부인한 자였지만, 회복된 후 초대교회의 반석이 되었습니다."},
  {"id":"ruth","date":"2026-04-09","category":"구약","title":"룻 - 충성과 헌신의 여인","verse":"룻기 1:16","verseText":"어머니의 백성이 나의 백성이 되고 어머니의 하나님이 나의 하나님이 되시리니","excerpt":"룻은 이방 여인이었지만, 시어머니 나오미에 대한 충성과 하나님에 대한 신뢰를 통해 구원의 역사에 참여하게 되었습니다."},
  {"id":"paul","date":"2026-04-08","category":"신약","title":"바울 - 변화된 삶의 증거","verse":"갈라디아서 2:20","verseText":"이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라","excerpt":"교회를 박해하던 사울이 복음의 가장 열정적인 전파자 바울이 되었습니다."},
  {"id":"moses","date":"2026-04-07","category":"구약","title":"모세 - 부르심 앞의 부족함","verse":"출애굽기 3:11-12","verseText":"내가 반드시 너와 함께 있으리라","excerpt":"모세는 자신의 부족함을 느꼈지만, 하나님은 그를 통해 이스라엘을 이끌어 내셨습니다."}
];

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
    if (res.ok) {
      allPosts = await res.json();
    } else {
      allPosts = FALLBACK_POSTS;
    }
  } catch {
    allPosts = FALLBACK_POSTS;
  }

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
