import CryptoJS from 'app/core/mtproto/vendors/cryptojs';
import { convertToUint8Array } from 'app/core/mtproto/crypto/shared';
import { bytesFromWords, bytesToWords } from 'app/core/mtproto/crypto/aes'

const webCrypto =
  crypto.subtle || crypto.webkitSubtle || (msCrypto && msCrypto.subtle);

const useWebCrypto = webCrypto && !!webCrypto.digest;
let useSha256Crypto = useWebCrypto;

export function sha256HashSync(bytes) {
  const hashWords = CryptoJS.SHA256(bytesToWords(bytes));

  return bytesFromWords(hashWords);
}

export const sha256Hash = async bytes => {
  const bytesTyped = convertToUint8Array(bytes);
  if (!useSha256Crypto) {
    return sha256HashSync(bytes);
  }

  try {
    const identity = await webCrypto.digest({ name: 'SHA-256' }, bytesTyped);
    console.log('native crypto');
    return identity;
  } catch (e) {
    useSha256Crypto = false;
    console.error('Crypto digest error', e);
    return sha256HashSync(bytes);
  }
};
