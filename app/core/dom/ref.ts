export function Ref(target: any, key: string): any {
  const refVal: { current: any } = {
    current: null,
  };

  Object.defineProperty(target, key, {
    get value(): { current: any } {
      return refVal;
    },
  });

  return refVal;
}
