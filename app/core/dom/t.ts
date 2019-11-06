function createNode(Component: any, props: any, childs: any) {
  let element = null;
  let inst = null;

  if (typeof Component === "string") {
    element = document.createElement(Component);
  } else if (Component.isComponent) {
    inst = new Component();
    inst.props = props || {};
    if (childs) {
      inst.props.children = childs;
    }
    element = inst.render(inst.props);
    inst.rootEl = element;
  }

  if (element !== null && props !== null) {
    for (let attrName in props) {
      if (props.hasOwnProperty(attrName)) {
        switch (attrName) {
          case "ref":
            props.ref.current = element;
            break;
          default:
            break;
        }

        if (!inst) {
          switch (attrName) {
            case "class":
            case "className":
              element.className = props[attrName];
              break;
            default:
              element.setAttribute(attrName, props[attrName]);
              break;
          }
        }
      }
    }
  }

  return { element, inst };
}

function appendNode(this: any) {
  for (let i = 0; i < arguments.length; i++) {
    const child = arguments[i];

    if (child instanceof HTMLElement) {
      this.appendChild(child);
    } else if (Array.isArray(child)) {
      appendNode.apply(this, child);
    } else {
      this.appendChild(document.createTextNode(child));
    }
  }
}

const T = function(Component: any, props: any, ...childs: any) {
  const { element, inst } = createNode(Component, props, childs);

  if (inst && inst.isComponent) {
    if (inst.init) {
      inst.init();
    }
  } else {
    if (childs.length !== 0) {
      const doc = document.createDocumentFragment();
      appendNode.apply(doc, childs);
      element.appendChild(doc);
    }
  }

  return element;
};

export { T };
