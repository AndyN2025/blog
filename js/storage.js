const STORAGE_KEY = 'my-blog-posts';
let postsCache = null;
let nextIdCache = 1;

function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    postsCache = JSON.parse(data);
    nextIdCache = postsCache.length ? Math.max(...postsCache.map(p => p.id)) + 1 : 1;
  } else {
    postsCache = [];
  }
}

loadFromStorage();

export function getPosts() {
  return postsCache;
}

export function savePosts(posts) {
  postsCache = posts;
  nextIdCache = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getNextId() {
  return nextIdCache++;
}