import { getPosts, savePosts, getNextId } from './storage.js';
import { escapeHtml } from './utils.js';

export function renderForm(postId = null) {
  const container = document.getElementById('editView');
  const posts = getPosts();
  const post = postId ? posts.find(p => p.id === postId) : null;

  container.innerHTML = `
    <div class="blog__editor">
      <h2 class="blog__editor-title">${post ? 'Редактировать пост' : 'Новый пост'}</h2>
      <form id="postForm">
        <input type="hidden" id="postId" value="${post?.id || ''}">
        <label class="blog__field">
          <span class="blog__field-label">Заголовок</span>
          <input 
            type="text" 
            class="blog__input" 
            id="title" 
            value="${post ? escapeHtml(post.title) : ''}" 
            maxlength="100" 
            placeholder="Введите заголовок (макс. 100 символов)"
            required>
            <div class="blog__counter" id="titleCounter">
              ${post ? 100 - post.title.length : 100} / 100
            </div>
        </label>
        <label class="blog__field">
          <span class="blog__field-label">Текст поста</span>
          <textarea class="blog__textarea" id="content" required>${post ? escapeHtml(post.content) : ''}</textarea>
        </label>
        <div class="blog__form-actions">
          <button type="submit" class="blog__button blog__button--primary">Сохранить</button>
          <button type="button" class="blog__button blog__button--secondary" onclick="location.hash='#list'">Отмена</button>
        </div>
      </form>
    </div>
  `;

  const titleInput = document.getElementById('title');
  const counter = document.getElementById('titleCounter');

  const updateCounter = () => {
    const length = titleInput.value.length;
    const remaining = 100 - length;
    counter.textContent = `${remaining} / 100`;
    counter.style.color = remaining <= 10 ? '#e74c3c' : '#666';
  };

  titleInput.addEventListener('input', updateCounter);
  updateCounter(); 

  document.getElementById('postForm').onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('postId').value;
    // const title = document.getElementById('title').value.trim();
    const title = titleInput.value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
      alert('Заполните все поля');
      return;
    }

    if (title.length > 100) {
      alert('Заголовок слишком длинный! Максимум 100 символов.');
      return;
    }

    let posts = getPosts(); 

    if (id) {
      const post = posts.find(p => p.id === Number(id));
      post.title = title;
      post.content = content;
      post.editedAt = Date.now();
    } else {
      posts.push({
        id: getNextId(),
        title,
        content,
        createdAt: Date.now(),
        editedAt: null
      });
    }

    savePosts(posts);
    location.hash = '#list';
  };
}