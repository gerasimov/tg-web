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
  | 'get-iv';


export function callMethod(type: MethodName, ...args: any[]): Promise<any> {
  return new Promise((res, rej) => {
    const id = Math.random().toString(16);
    
    function handle(e) {
      if (e.data.id !== id) {
        return;
      }
      worker.removeEventListener('message', handle);
      if (e.data.error) {
        return rej(e.data.error);
      }
      res(e.data.res);
    }
    worker.addEventListener('message', handle);
    worker.postMessage({ type, args, id });
  });
}
