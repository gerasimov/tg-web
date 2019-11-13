// @ts-ignore
import createWorker from 'app/core/mtproto/crypto.worker';

const worker = createWorker();

type MethodName =
  | 'factor'
  | 'rsa-encrypt'
  | 'aes-encrypt'
  | 'aes-decrypt'
  | 'bytes-pow';

export function callMethod(type: MethodName, ...args: any[]): Promise<any> {
  return new Promise((res, rej) => {
    worker.onmessage = (e: any) => res(e.data.res);
    worker.postMessage({ type, args });
  });
}
