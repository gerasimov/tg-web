import { pqPrimeFactorization } from 'app/core/mtproto/crypto/factor'
import { sha1Hash } from 'app/core/mtproto/crypto/sha1'
import { aesDecryptSync, aesEncryptSync } from 'app/core/mtproto/crypto/aes'
import { rsaEncrypt } from 'app/core/mtproto/crypto/rsa'
import { getMsgKeyIv } from 'app/core/mtproto/crypto/msgKeyIv'
import { bytesModPow } from 'app/core/mtproto/crypto/powMod'
import { sha256Hash } from 'app/core/mtproto/crypto/sha256'

console.log = () => {};

console.log('worker');
onmessage = async ({ data }) => {
  const { type, id } = data;

  const response = promise =>
    Promise.resolve(promise)
      .then(res => postMessage({ type, res, id }))
      .catch((e) => postMessage({ error: e.message, id }));

  switch (type) {
    case 'factor': {
      return response(pqPrimeFactorization(...data.args))
    }
    case 'sha1': {
      return response(sha1Hash(...data.args));
    }
    case 'sha256': {
      return response(sha256Hash(...data.args));
    }
    case 'rsa-encrypt': {
      return response(rsaEncrypt(...data.args))
    }
    case 'aes-encrypt': {
      return response(aesEncryptSync(...data.args));
    }
    case 'aes-decrypt': {
      return response(aesDecryptSync(...data.args));
    }
    case 'bytes-pow': {
      return response(bytesModPow(...data.args));
    }
    case 'get-iv': {
      return response(getMsgKeyIv(...data.args));
    }
    default:
      postMessage(response(Promise.reject({ error: true })));
  }
};
