import { pqPrimeFactorization } from 'app/core/mtproto/crypto/factor'
import { sha1Hash } from 'app/core/mtproto/crypto/sha1'
import { aesDecryptSync, aesEncryptSync } from 'app/core/mtproto/crypto/aes'
import { rsaEncrypt } from 'app/core/mtproto/crypto/rsa'
import { getMsgKeyIv } from 'app/core/mtproto/crypto/msgKeyIv'
import { bytesModPow } from 'app/core/mtproto/crypto/powMod'
import { sha256Hash } from 'app/core/mtproto/crypto/sha256'


console.log('worker');
onmessage = async ({ data }) => {
  const { type } = data;

  const response = promise =>
    promise
      .then(res => postMessage({ type, res }))
      .catch(() => postMessage({ error: true }));

  switch (type) {
    case 'factor': {
      const res = pqPrimeFactorization(...data.args);
      return postMessage({ type, res });
    }
    case 'sha1': {
      return response(sha1Hash(...data.args));
    }
    case 'sha256': {
      return response(sha256Hash(...data.args));
    }
    case 'rsa-encrypt': {
      const res = rsaEncrypt(...data.args);
      return postMessage({
        type,
        res,
      });
    }
    case 'aes-encrypt': {
      return postMessage({
        type,
        res: aesEncryptSync(...data.args),
      });
    }
    case 'aes-decrypt': {
      return postMessage({
        type,
        res: aesDecryptSync(...data.args),
      });
    }
    case 'bytes-pow': {
      return postMessage({
        type,
        res: bytesModPow(...data.args),
      });
    }
    case 'get-msgkey-iv': {
      return response(getMsgKeyIv(...data.args));
    }
    default:
      postMessage({ error: true });
  }
};
