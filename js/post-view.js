import { getPosts } from './storage.js';
import { escapeHtml, formatDate } from './utils.js';

export function renderPostView(postId) {
  const post = getPosts().find(p => p.id === postId);
  if (!post) {
    document.getElementById('viewPost').innerHTML = '<p>Пост не найден</p>';
    return;
  }

  document.getElementById('viewPost').innerHTML = `
    <button class="blog__button blog__button--secondary" onclick="location.hash='list'" style="margin-bottom:1.5rem">
      Вернуться к списку постов
    </button>
    <h2 class="blog__post-view-title">${escapeHtml(post.title)}</h2>
    <div class="blog__post-meta">
      Создано: ${formatDate(post.createdAt)}<br>
      ${post.editedAt ? 'Изменено: ' + formatDate(post.editedAt) : ''}
    </div>
    <div class="blog__post-content">${escapeHtml(post.content)}</div>
    <div style="margin-top:2rem">
      <button class="blog__button blog__button--primary" onclick="location.hash='edit/${post.id}'">Редактировать</button>
      <button class="blog__button blog__button--danger" onclick="deletePost(${post.id})">Удалить</button>
    </div>
  `;
}
