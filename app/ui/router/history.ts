const stack: any[] = [];

export default function route(path: string | Function, fn?: () => void) {
  if (!fn) {
    stack.push({ path: '*', fn: path });
  } else {
    stack.push({ path, fn });
  }
}

export function initializeRoutes() {
  let i = 0;

  function next(err?: any): any {
    const middleware = stack[i++];

    if (!middleware) {
      return;
    }

    const { pathname } = window.location;

    if (middleware.path !== pathname && middleware.path !== '*') {
      return next();
    }

    middleware.fn({ pathname }, next);
  }

  next();
}

const originalPushState = history.pushState.bind(history);
const originalReplaceState = history.replaceState.bind(history);

history.pushState = (state, title, url) => {
  originalPushState(state, title, url);

  initializeRoutes();
};

history.replaceState = (state, title, url) => {
  originalReplaceState(state, title, url);

  initializeRoutes();
};

window.addEventListener('popstate', initializeRoutes);
