import { getPosts, savePosts } from './storage.js';
import { escapeHtml, formatDate } from './utils.js';

export function renderPostList() {
  const container = document.getElementById('listView');
  const posts = getPosts();

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="blog__empty" style="text-align:center;padding:3rem;">
        <p style="margin-bottom:1rem;font-size:1.2rem;">Пока нет постов</p>
        <button class="blog__button blog__button--primary" onclick="location.hash='#edit'">
          + Создать первый пост
        </button>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="blog__actions" style="text-align:right;margin-bottom:1.5rem;">
      <button class="blog__button blog__button--primary" onclick="location.hash='#edit'">
        + Новый пост
      </button>
    </div>
    <ul class="blog__posts-list">
      ${posts
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(post => `
          <li class="blog__post-card">
            <h3 class="blog__post-card-title" onclick="location.hash='#post/${post.id}'">
              ${escapeHtml(post.title)}
            </h3>
            <div class="blog__post-meta">
              Создано: ${formatDate(post.createdAt)}<br>
              ${post.editedAt ? 'Изменено: ' + formatDate(post.editedAt) : 'Изменено: —'}
            </div>
            <div class="blog__post-btns">
              <button class="blog__button blog__button--primary" onclick="location.hash='#edit/${post.id}'">
                Редактировать
              </button>
              <button class="blog__button blog__button--danger" onclick="deletePost(${post.id})">
                Удалить
              </button>
            </div>
          </li>
        `).join('')}
    </ul>
  `;
}

window.deletePost = function(id) {
  if (!confirm('Удалить пост навсегда?')) return;
  const filtered = getPosts().filter(p => p.id !== id);
  savePosts(filtered);
  renderPostList();
};