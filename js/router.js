const routes = {};

export function onRoute(path, callback) {
  routes[path] = callback;
}

export function startRouter() {
  const handle = () => {
    const hash = location.hash.slice(1) || 'list';
    const handler = routes[hash] || routes['list'];
    handler();
  };
  window.addEventListener('hashchange', handle);
  handle(); 
}

export function navigateTo(hash) {
  location.hash = hash;
}


