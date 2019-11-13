// @ts-ignore
import createWorker from 'app/core/mtproto/crypto/crypto.worker';

const worker = createWorker();

type MethodName =
  | 'sha1'
  | 'sha256'
  | 'factor'
  | 'rsa-encrypt'
  | 'aes-encrypt'
  | 'aes-decrypt'
  | 'bytes-pow'
  | 'mod-pow'
  | 'get-msgkey-iv';

export function callMethod(type: MethodName, ...args: any[]): Promise<any> {
  return new Promise((res, rej) => {
    worker.onmessage = (e: any) => {
      if (e.data.error) {
        return rej();
      }
      res(e.data.res);
    };
    worker.postMessage({ type, args });
  });
}
