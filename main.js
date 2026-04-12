// ===== Posts Data =====
// 게시글 메타데이터는 posts/index.json에서 관리
// 실제 내용은 posts/content/{id}.html 파일로 업로드

const POSTS_INDEX_URL = '/posts/index.json';
const POSTS_CONTENT_DIR = '/posts/content/';

let allPosts = [];
let currentPage = 1;
const POSTS_PER_PAGE = 10;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadPosts();
});

// ===== Navigation =====
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
  });
}

// ===== Load Posts =====
async function loadPosts() {
  try {
    const response = await fetch(POSTS_INDEX_URL);
    if (response.ok) {
      allPosts = await response.json();
    }
  } catch {
    allPosts = [];
  }

  // Sort by date descending
  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Render based on current page
  const page = window.location.pathname;

  if (page === '/' || page === '/index.html') {
    renderTodayCard();
    renderRecentPosts();
  } else if (page === '/board.html') {
    renderBoardList();
    initBoardControls();
  } else if (page === '/post.html') {
    renderPost();
  }
}

// ===== Load HTML content for a post =====
async function loadPostContent(postId) {
  try {
    const response = await fetch(`${POSTS_CONTENT_DIR}${postId}.html`);
    if (response.ok) {
      return await response.text();
    }
  } catch {
    // ignore
  }
  return '<p class="loading-text">묵상 내용을 불러올 수 없습니다.</p>';
}

// ===== Render Today's Card =====
function renderTodayCard() {
  const container = document.getElementById('today-card');
  if (!container || allPosts.length === 0) return;

  const post = allPosts[0];
  container.innerHTML = `
    <p class="card-date">${formatDate(post.date)}</p>
    <span class="card-category">${post.category}</span>
    <h3 class="card-title">${post.title}</h3>
    <p class="card-verse">${post.verseText} - ${post.verse}</p>
    <p class="card-excerpt">${post.excerpt}</p>
    <a href="/post.html?id=${post.id}" class="card-link">전체 묵상 읽기 &rarr;</a>
  `;
}

// ===== Render Recent Posts =====
function renderRecentPosts() {
  const container = document.getElementById('posts-grid');
  if (!container) return;

  const recentPosts = allPosts.slice(1, 7);

  if (recentPosts.length === 0) {
    container.innerHTML = '<p class="loading-text">아직 게시글이 없습니다.</p>';
    return;
  }

  container.innerHTML = recentPosts.map(post => `
    <div class="post-card" onclick="location.href='/post.html?id=${post.id}'">
      <p class="card-date">${formatDate(post.date)}</p>
      <span class="card-category">${post.category}</span>
      <h4 class="card-title">${post.title}</h4>
      <p class="card-excerpt">${post.excerpt}</p>
    </div>
  `).join('');
}

// ===== Render Board List =====
function renderBoardList(filter = 'all', search = '') {
  const container = document.getElementById('board-list');
  if (!container) return;

  let filtered = allPosts;

  if (filter !== 'all') {
    filtered = filtered.filter(p => p.category === filter);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.verse.toLowerCase().includes(q)
    );
  }

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const paginated = filtered.slice(start, start + POSTS_PER_PAGE);

  if (paginated.length === 0) {
    container.innerHTML = '<p class="loading-text">검색 결과가 없습니다.</p>';
    renderPagination(0);
    return;
  }

  container.innerHTML = paginated.map(post => `
    <div class="board-item" onclick="location.href='/post.html?id=${post.id}'">
      <span class="item-date">${formatDate(post.date)}</span>
      <span class="item-category">${post.category}</span>
      <span class="item-title">${post.title}</span>
      <span class="item-arrow">&rsaquo;</span>
    </div>
  `).join('');

  renderPagination(totalPages);
}

// ===== Pagination =====
function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  if (!container || totalPages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderBoardList(getCurrentFilter(), getCurrentSearch());
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

// ===== Board Controls =====
function initBoardControls() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.tag-btn');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      currentPage = 1;
      renderBoardList(getCurrentFilter(), searchInput.value);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        currentPage = 1;
        renderBoardList(getCurrentFilter(), searchInput.value);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPage = 1;
      renderBoardList(btn.dataset.filter, getCurrentSearch());
    });
  });
}

function getCurrentFilter() {
  const active = document.querySelector('.tag-btn.active');
  return active ? active.dataset.filter : 'all';
}

function getCurrentSearch() {
  const input = document.getElementById('search-input');
  return input ? input.value : '';
}

// ===== Render Post =====
async function renderPost() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  if (!postId) {
    window.location.href = '/board.html';
    return;
  }

  const post = allPosts.find(p => p.id === postId);

  if (!post) {
    document.getElementById('post-header').innerHTML = '<p class="loading-text">묵상을 찾을 수 없습니다.</p>';
    return;
  }

  // Update page title
  document.title = `${post.title} - 매일 성경 인물 묵상`;

  // Render header
  document.getElementById('post-header').innerHTML = `
    <p class="post-date">${formatDate(post.date)}</p>
    <span class="post-category">${post.category}</span>
    <h1 class="post-title">${post.title}</h1>
    <p class="post-verse">${post.verseText} - ${post.verse}</p>
  `;

  // Load and render HTML content from file
  const content = await loadPostContent(postId);
  document.getElementById('post-body').innerHTML = content;
}

// ===== Utilities =====
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}
