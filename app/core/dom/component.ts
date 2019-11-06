type ComponentOptions = {};

import { on } from "./utils";

export default function Component(target: any) {
  target.isComponent = true;
  target.prototype.isComponent = true;

  target.prototype.dom = {
    on
  };

  return target;
}

export function Ref(target: any, key: string): any {
  const refVal: { current: any } = {
    current: null
  };

  Object.defineProperty(target, key, {
    get value(): { current: any } {
      return refVal;
    }
  });

  return refVal;
}
