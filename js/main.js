import { renderPostList } from './post-list.js';
import { renderForm } from './post-form.js';
import { renderPostView } from './post-view.js';


function showScreen(screenId) {
  // Скрываем все три экрана
  document.getElementById('listView').classList.add('blog__editor--hidden');
  document.getElementById('editView').classList.add('blog__editor--hidden');
  document.getElementById('viewPost').classList.add('blog__post-view--hidden');

  // Показываем нужный
  if (screenId === 'listView') {
    document.getElementById('listView').classList.remove('blog__editor--hidden');
    renderPostList();
  } else if (screenId === 'editView') {
    document.getElementById('editView').classList.remove('blog__editor--hidden');
  } else if (screenId === 'viewPost') {
    document.getElementById('viewPost').classList.remove('blog__post-view--hidden');
  }
}

// Роутер
function route() {
  const hash = location.hash.slice(1) || 'list';

  if (hash === 'list') {
    showScreen('listView');
  } 
  else if (hash === 'edit') {
    showScreen('editView');
    renderForm(); 
  } 
  else if (hash.startsWith('edit/')) {
    const id = Number(hash.split('/')[1]);
    showScreen('editView');
    renderForm(id);
  } 
  else if (hash.startsWith('post/')) {
    const id = Number(hash.split('/')[1]);
    showScreen('viewPost');
    renderPostView(id);
  } 
  else {
    location.hash = '#list';
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

route();