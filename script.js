let posts = [];
let nextId = 1;

const elements = {
  listView: document.getElementById('listView'),
  editView: document.getElementById('editView'),
  viewPost: document.getElementById('viewPost'),
  postsList: document.getElementById('postsList'),
  formTitle: document.getElementById('formTitle'),
  postId: document.getElementById('postId'),
  titleInput: document.getElementById('title'),
  contentInput: document.getElementById('content'),
};

function loadPosts() {
  const data = localStorage.getItem('simple-blog-posts');
  if (data) {
    posts = JSON.parse(data);
    nextId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  }
}

function savePosts() {
  try {
    localStorage.setItem('simple-blog-posts', JSON.stringify(posts));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Не хватает места для сохранения. Удалите старые посты.');
    } else {
      alert('Ошибка сохранения данных.');
    }
    console.error(e);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderList() {
  if (posts.length === 0) {
    elements.postsList.innerHTML = `
      <li class="blog__empty">
        Пока нет постов.<br>Создайте первый с помощью кнопки выше!
      </li>`;
    return;
  }

  elements.postsList.innerHTML = posts
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(post => {
      const created = new Date(post.createdAt).toLocaleString('ru');
      const edited = post.editedAt ? new Date(post.editedAt).toLocaleString('ru') : '—';

      return `
        <li class="blog__post-card">
          <h3 class="blog__post-card-title" onclick="viewPost(${post.id})">
            ${escapeHtml(post.title)}
          </h3>
          <div class="blog__post-meta">
            Создано: ${created}<br>
            Изменено: ${edited}
          </div>
          <div class="blog__post-buttons" style="margin-top:1rem;">
            <button class="blog__button blog__button--primary" onclick="editPost(${post.id})">Редактировать</button>
            <button class="blog__button blog__button--danger" onclick="deletePost(${post.id})">Удалить</button>
          </div>
        </li>
      `;
    })
    .join('');
}

function showView(view) {
  elements.listView.classList.toggle('blog__editor--hidden', view !== 'list');
  elements.editView.classList.toggle('blog__editor--hidden', view !== 'edit');
  elements.viewPost.classList.toggle('blog__post-view--hidden', view !== 'view');
}

document.getElementById('newPostBtn').onclick = () => {
  elements.formTitle.textContent = 'Новый пост';
  elements.postId.value = '';
  elements.titleInput.value = '';
  elements.contentInput.value = '';
  showView('edit');
};

document.getElementById('cancelEdit').onclick = () => showView('list');

function editPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;

  elements.formTitle.textContent = 'Редактировать пост';
  elements.postId.value = post.id;
  elements.titleInput.value = post.title;
  elements.contentInput.value = post.content;
  showView('edit');
}

function deletePost(id) {
  if (!confirm('Удалить пост навсегда?')) return;
  posts = posts.filter(p => p.id !== id);
  savePosts();
  renderList();
}

function viewPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;

  const created = new Date(post.createdAt).toLocaleString('ru');
  const edited = post.editedAt ? new Date(post.editedAt).toLocaleString('ru') : '—';

  elements.viewPost.innerHTML = `
    <button class="blog__button blog__button--secondary" onclick="showView('list')" style="margin-bottom:1.5rem;">
      Назад к списку
    </button>
    <h2 class="blog__post-view-title">${escapeHtml(post.title)}</h2>
    <div class="blog__post-meta">
      Создано: ${created}<br>
      Изменено: ${edited}
    </div>
    <div class="blog__post-content">${escapeHtml(post.content)}</div>
    <div style="margin-top:2rem;">
      <button class="blog__button blog__button--primary" onclick="editPost(${post.id})">Редактировать</button>
      <button class="blog__button blog__button--danger" onclick="deletePost(${post.id})">Удалить</button>
    </div>
  `;

  showView('view');
}

document.getElementById('postForm').addEventListener('submit', e => {
  e.preventDefault();

  const id = elements.postId.value;
  const title = elements.titleInput.value.trim();
  const content = elements.contentInput.value.trim();

  if (!title || !content) {
    alert('Заполните заголовок и текст поста');
    return;
  }

  if (id) {
    const post = posts.find(p => p.id === id);
    post.title = title;
    post.content = content;
    post.editedAt = Date.now();
  } else {
    posts.push({
      id: nextId++,
      title,
      content,
      createdAt: Date.now(),
      editedAt: null
    });
  }

  savePosts();
  showView('list');
  renderList();
});

loadPosts();
showView('list');
renderList();