export const sentMessages = {};

export function getDeffered() {
  let reject = x => x;
  let resolve = x => x;
  const promise = new Promise(($resolve, $reject) => {
    resolve = (a) => {
      return $resolve(a);
    }
    reject = $reject;
  });

  return {
    reject,
    resolve,
    promise
  };
}
