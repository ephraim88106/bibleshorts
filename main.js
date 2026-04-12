// ===== Posts Data =====
// 게시글 데이터 - posts 폴더의 JSON 파일로 관리
// 새 묵상을 추가하려면 posts/ 폴더에 JSON 파일을 추가하세요

const POSTS_INDEX_URL = '/posts/index.json';

let allPosts = [];
let currentPage = 1;
const POSTS_PER_PAGE = 10;

// ===== Sample Posts (기본 예시 데이터) =====
const samplePosts = [
  {
    id: 'abraham',
    date: '2026-04-12',
    category: '구약',
    title: '아브라함 - 믿음의 조상',
    verse: '창세기 12:1-4',
    verseText: '여호와께서 아브람에게 이르시되 너는 너의 고향과 친척과 아버지의 집을 떠나 내가 네게 보여 줄 땅으로 가라',
    excerpt: '아브라함은 하나님의 부르심에 순종하여 안정된 삶을 떠나 미지의 땅으로 향했습니다. 그의 믿음은 보이지 않는 것을 확신하는 것이었습니다.',
    content: `<h2>인물 배경</h2>
<p>아브라함(원래 이름 아브람)은 메소포타미아의 우르에서 태어났습니다. 당시 우르는 번영하는 도시였으며, 아브라함은 유복한 환경에서 자랐습니다. 그러나 하나님께서는 그에게 익숙한 모든 것을 떠나라고 부르셨습니다.</p>

<h2>핵심 사건</h2>
<p>75세의 나이에 아브라함은 하나님의 부르심을 받았습니다. "너는 너의 고향과 친척과 아버지의 집을 떠나 내가 네게 보여 줄 땅으로 가라." 이 명령에는 구체적인 목적지도, 상세한 계획도 없었습니다. 오직 하나님을 신뢰하라는 것뿐이었습니다.</p>

<blockquote>아브람이 여호와의 말씀을 따라갔고 - 창세기 12:4</blockquote>

<h2>영적 교훈</h2>
<ul>
<li><strong>순종의 믿음:</strong> 아브라함은 모든 것을 이해하지 못해도 하나님을 따랐습니다</li>
<li><strong>인내의 믿음:</strong> 약속이 성취되기까지 25년을 기다렸습니다</li>
<li><strong>성장하는 믿음:</strong> 실수도 있었지만, 점점 하나님을 깊이 신뢰하게 되었습니다</li>
</ul>

<h2>오늘의 적용</h2>
<p>우리도 때로 익숙한 것을 떠나 새로운 길로 나아가야 할 때가 있습니다. 직장, 관계, 습관... 하나님의 인도하심을 따르는 것은 쉽지 않지만, 아브라함처럼 한 걸음씩 순종할 때 하나님의 약속은 성취됩니다.</p>

<h2>묵상 질문</h2>
<p>오늘 하나님께서 나에게 떠나라고 하시는 것은 무엇인가요? 그리고 나아가라고 하시는 곳은 어디인가요?</p>`
  },
  {
    id: 'david',
    date: '2026-04-11',
    category: '구약',
    title: '다윗 - 하나님의 마음에 합한 자',
    verse: '사무엘상 16:7',
    verseText: '여호와께서 사무엘에게 이르시되 그의 용모와 키를 보지 말라 내가 이미 그를 버렸노라 내가 보는 것은 사람과 같지 아니하니 사람은 외모를 보거니와 나 여호와는 중심을 보느니라',
    excerpt: '다윗은 완벽한 사람이 아니었지만, 항상 하나님께 돌아오는 회개의 마음을 가졌습니다. 그것이 그를 "하나님의 마음에 합한 자"로 만들었습니다.',
    content: `<h2>인물 배경</h2>
<p>다윗은 이새의 막내아들로, 베들레헴에서 양을 치는 목동이었습니다. 가장 작고 보잘것없어 보이는 자였지만, 하나님은 그의 마음을 보셨습니다.</p>

<h2>핵심 사건</h2>
<p>사무엘이 이새의 아들들을 살펴볼 때, 하나님은 외모가 출중한 형들을 지나치시고 들에서 양을 치고 있던 막내 다윗을 선택하셨습니다. 이것은 하나님의 기준이 세상과 다르다는 것을 보여줍니다.</p>

<blockquote>사람은 외모를 보거니와 나 여호와는 중심을 보느니라 - 사무엘상 16:7</blockquote>

<h2>영적 교훈</h2>
<ul>
<li><strong>겸손한 시작:</strong> 하나님은 작은 곳에서 충성된 자를 높이십니다</li>
<li><strong>회개하는 마음:</strong> 다윗은 넘어져도 항상 하나님께 돌아왔습니다</li>
<li><strong>예배의 삶:</strong> 시편을 통해 기쁨과 슬픔 모두를 하나님께 드렸습니다</li>
</ul>

<h2>오늘의 적용</h2>
<p>하나님은 우리의 외적 조건이 아닌 마음의 상태를 보십니다. 완벽함이 아니라 진실된 마음, 넘어져도 다시 일어나는 회복력, 그것이 하나님께서 찾으시는 것입니다.</p>

<h2>묵상 질문</h2>
<p>나의 마음은 지금 어떤 상태인가요? 하나님 앞에 솔직하게 내 마음을 드릴 수 있나요?</p>`
  },
  {
    id: 'peter',
    date: '2026-04-10',
    category: '신약',
    title: '베드로 - 실패를 딛고 일어선 반석',
    verse: '마태복음 16:18',
    verseText: '또 내가 네게 이르노니 너는 베드로라 내가 이 반석 위에 내 교회를 세우리니 음부의 권세가 이기지 못하리라',
    excerpt: '베드로는 예수님을 세 번 부인한 자였지만, 회복된 후 초대교회의 반석이 되었습니다. 우리의 실패가 끝이 아님을 보여줍니다.',
    content: `<h2>인물 배경</h2>
<p>베드로(원래 이름 시몬)는 갈릴리의 어부였습니다. 성격이 급하고 충동적이었지만, 예수님은 그를 처음 부르실 때부터 "반석"이라는 이름을 주셨습니다.</p>

<h2>핵심 사건</h2>
<p>예수님이 잡히시던 밤, 베드로는 세 번이나 예수님을 모른다고 부인했습니다. 그리고 닭이 울었을 때 예수님의 말씀을 기억하고 통곡했습니다. 그러나 부활 후 예수님은 베드로를 찾아가 "내 양을 먹이라"며 그를 회복시키셨습니다.</p>

<blockquote>시몬아, 네가 나를 사랑하느냐... 내 양을 먹이라 - 요한복음 21:17</blockquote>

<h2>영적 교훈</h2>
<ul>
<li><strong>실패는 끝이 아니다:</strong> 하나님은 우리의 실패 너머를 보십니다</li>
<li><strong>회복의 은혜:</strong> 예수님은 우리를 포기하지 않으십니다</li>
<li><strong>변화된 삶:</strong> 회복된 후 베드로는 완전히 다른 사람이 되었습니다</li>
</ul>

<h2>오늘의 적용</h2>
<p>혹시 과거의 실패로 자신을 정죄하고 있나요? 베드로의 이야기는 우리에게 희망을 줍니다. 하나님은 우리의 과거가 아닌 미래를 보시며, 회복의 은혜를 베푸십니다.</p>

<h2>묵상 질문</h2>
<p>내가 아직 놓지 못하고 있는 과거의 실패는 무엇인가요? 하나님의 회복의 음성을 들을 수 있나요?</p>`
  },
  {
    id: 'ruth',
    date: '2026-04-09',
    category: '구약',
    title: '룻 - 충성과 헌신의 여인',
    verse: '룻기 1:16',
    verseText: '어머니의 백성이 나의 백성이 되고 어머니의 하나님이 나의 하나님이 되시리니',
    excerpt: '룻은 이방 여인이었지만, 시어머니 나오미에 대한 충성과 하나님에 대한 신뢰를 통해 구원의 역사에 참여하게 되었습니다.',
    content: `<h2>인물 배경</h2>
<p>룻은 모압 여인으로, 유다 땅에서 이주해 온 가족의 며느리가 되었습니다. 남편이 죽은 후에도 시어머니 나오미를 따라 이스라엘 땅으로 갔습니다.</p>

<h2>핵심 사건</h2>
<p>나오미가 두 며느리에게 친정으로 돌아가라고 했을 때, 룻은 끝까지 나오미와 함께하기를 선택했습니다. 이 결단은 그녀의 삶을 완전히 바꾸어 놓았습니다.</p>

<blockquote>어머니를 떠나며 어머니를 따르지 않겠다 하지 마옵소서 - 룻기 1:16</blockquote>

<h2>영적 교훈</h2>
<ul>
<li><strong>충성된 사랑:</strong> 어려운 상황에서도 포기하지 않는 헌신</li>
<li><strong>믿음의 결단:</strong> 안전한 길 대신 하나님의 길을 선택함</li>
<li><strong>겸손한 섬김:</strong> 이삭 줍는 수고를 마다하지 않음</li>
</ul>

<h2>오늘의 적용</h2>
<p>룻의 충성은 결국 보아스를 만나게 하고, 다윗의 증조할머니가 되는 축복으로 이어졌습니다. 하나님은 우리의 작은 충성도 보시고 크게 사용하십니다.</p>

<h2>묵상 질문</h2>
<p>내가 지금 충성되게 섬기고 있는 관계나 영역은 무엇인가요?</p>`
  },
  {
    id: 'paul',
    date: '2026-04-08',
    category: '신약',
    title: '바울 - 변화된 삶의 증거',
    verse: '갈라디아서 2:20',
    verseText: '내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라',
    excerpt: '교회를 박해하던 사울이 복음의 가장 열정적인 전파자 바울이 되었습니다. 그의 변화는 하나님의 은혜의 능력을 보여줍니다.',
    content: `<h2>인물 배경</h2>
<p>바울(원래 이름 사울)은 바리새인 중의 바리새인으로, 그리스도인들을 열심히 박해하던 자였습니다. 그는 스데반의 순교에도 동의했고, 다메섹으로 가서 신자들을 잡아오려 했습니다.</p>

<h2>핵심 사건</h2>
<p>다메섹으로 가는 길에서 부활하신 예수님을 만났습니다. 강렬한 빛과 함께 "사울아, 사울아, 네가 왜 나를 핍박하느냐"는 음성을 들었고, 그의 삶은 180도 바뀌었습니다.</p>

<blockquote>이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라 - 갈라디아서 2:20</blockquote>

<h2>영적 교훈</h2>
<ul>
<li><strong>은혜의 능력:</strong> 어떤 사람도 하나님의 은혜로 변할 수 있습니다</li>
<li><strong>사명의 삶:</strong> 변화된 후 바울은 오직 복음을 위해 살았습니다</li>
<li><strong>고난 중의 기쁨:</strong> 감옥에서도 기뻐하며 찬양했습니다</li>
</ul>

<h2>오늘의 적용</h2>
<p>바울의 이야기는 "너무 멀리 갔다"고 느끼는 사람에게 소망을 줍니다. 하나님의 은혜는 우리의 과거보다 크며, 우리를 완전히 새로운 사람으로 만드실 수 있습니다.</p>

<h2>묵상 질문</h2>
<p>하나님의 은혜로 내 삶에서 변화된 것은 무엇인가요? 아직 변화가 필요한 영역은 어디인가요?</p>`
  },
  {
    id: 'moses',
    date: '2026-04-07',
    category: '구약',
    title: '모세 - 부르심 앞의 부족함',
    verse: '출애굽기 3:11-12',
    verseText: '모세가 하나님께 아뢰되 내가 누구이기에 바로에게 가며 이스라엘 자손을 애굽에서 인도하여 내리이까',
    excerpt: '모세는 자신의 부족함을 느꼈지만, 하나님은 그를 통해 이스라엘을 이끌어 내셨습니다. 하나님의 부르심에는 항상 하나님의 능력이 함께합니다.',
    content: `<h2>인물 배경</h2>
<p>모세는 애굽의 왕자로 자랐지만, 동족을 위해 행동하다 살인을 저지르고 미디안 광야로 도망쳤습니다. 40년간 양을 치며 살았습니다.</p>

<h2>핵심 사건</h2>
<p>80세가 된 모세에게 하나님은 불타는 떨기나무에서 나타나셨습니다. 이스라엘을 이끌고 나오라는 사명을 주셨을 때, 모세는 다섯 가지 핑계를 댔습니다. 그러나 하나님은 "내가 너와 함께 있으리라"고 약속하셨습니다.</p>

<blockquote>내가 반드시 너와 함께 있으리라 - 출애굽기 3:12</blockquote>

<h2>영적 교훈</h2>
<ul>
<li><strong>광야의 훈련:</strong> 40년의 광야는 준비의 시간이었습니다</li>
<li><strong>하나님의 동행:</strong> 부족함은 하나님이 채우십니다</li>
<li><strong>순종의 과정:</strong> 완벽하지 않아도 한 걸음씩 나아가는 것</li>
</ul>

<h2>오늘의 적용</h2>
<p>"나는 부족해서..."라는 말이 입에서 나올 때, 모세를 기억합시다. 하나님은 우리의 능력이 아닌 우리의 순종을 원하시며, 부족한 부분은 그분이 채워주십니다.</p>

<h2>묵상 질문</h2>
<p>내가 부족하다고 느끼며 피하고 있는 하나님의 부르심은 무엇인가요?</p>`
  }
];

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

  // Scroll effect
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
    } else {
      allPosts = samplePosts;
    }
  } catch {
    allPosts = samplePosts;
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

  // Pagination
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
function renderPost() {
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

  // Render body
  document.getElementById('post-body').innerHTML = post.content;
}

// ===== Utilities =====
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}
