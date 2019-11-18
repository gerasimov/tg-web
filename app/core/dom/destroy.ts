let OBSERVE_ID = 0;

const observers: any = {};

export function Destroyable(target: any) {
  const originalMethod = target.prototype.init;
  const hasDestroy = Boolean(target.prototype.destroy);
<<<<<<< HEAD


  target.prototype.init = function() {
    if (originalMethod != null) {
      originalMethod.call(this);
    }
    const hasDestroy = Boolean(this.destroy);

    if (hasDestroy) {
=======

  if (hasDestroy) {
    target.prototype.init = function() {
      if (originalMethod != null) {
        originalMethod.call(this);
      }
>>>>>>> master
      addDestroyObserver({
        el: this.rootEl,
        cb: this.destroy,
      });
<<<<<<< HEAD
    }
  };
=======
    };
  }
>>>>>>> master
}

export function addDestroyObserver({
  cb,
  el,
}: {
  cb: () => void;
  el: HTMLElement & { _observeId: number };
}) {
  const id = OBSERVE_ID++;
  el._observeId = id;
  observers[id] = {
    el,
    cb: () => {
      delete observers[id];
      cb();
    },
  };
}

const mutationOptions = {
  childList: true,
  attributes: false,
  characterData: true,
  subtree: true,
};

new MutationObserver(function([{ removedNodes }]) {
  if (removedNodes.length && removedNodes[0]) {
    for (let id in observers)
      if (observers.hasOwnProperty(id)) {
        if (removedNodes[0].contains(observers[id].el)) {
          observers[id].cb();
        }
      }
  }
}).observe(document.documentElement, mutationOptions);
