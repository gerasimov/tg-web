function createNode(Component: any, props: any, childs: any) {
  let element = null;
  let inst = null;

  if (typeof Component === 'string') {
    element = document.createElement(Component);
  } else {
    inst = new Component(props || {});
    inst.props = props || {};
    inst.props.children = childs;
    element = inst.render(inst.props);
    inst.rootEl = element;
  }

  if (props === null) {
    return { element, inst };
  }

  const propsKeys = Object.keys(props);
  let i = propsKeys.length;

  while (i--) {
    const attrName = propsKeys[i];

    switch (attrName) {
      case 'ref':
        props.ref.current = element;
        break;
      case 'class':
      case 'className':
        element.className = props[attrName];
        break;
      case 'children':
        break;
      default:
        if (!inst) {
          if (props[attrName] != null) {
            element.setAttribute(attrName, props[attrName]);
          }
        }
        break;
    }
  }

  return { element, inst };
}

function appendNode(el: any, childs: any[]) {
  const size = childs.length;
  let i = size;

  while (i--) {
    const child = childs[size - i - 1];

    if (child instanceof HTMLElement) {
      el.appendChild(child);
    } else if (Array.isArray(child)) {
      const doc = document.createDocumentFragment();
      for (let z = 0; z < child.length; z++) {
        doc.appendChild(
          child[z] instanceof HTMLElement
            ? child[z]
            : document.createTextNode(child[z]),
        );
      }
      el.appendChild(doc);
    } else {
      el.appendChild(document.createTextNode(child));
    }
  }
}

const T = function(Component: any, props: any, ...childs: any) {
  const { element, inst } = createNode(Component, props, childs);

  if (inst !== null) {
    if (inst.init) {
      inst.init();
    }
  } else if (childs.length !== 0) {
    const doc = document.createDocumentFragment();
    appendNode(doc, childs);
    element.appendChild(doc);
  }

  return element;
};

export { T };
