import tinySha1 from 'tiny-sha1';
import { bytesFromArrayBuffer, bytesFromHex, convertToUint8Array } from 'app/core/mtproto/crypto/shared'

const webCrypto =
  crypto.subtle || crypto.webkitSubtle || (msCrypto && msCrypto.subtle);

const useWebCrypto = webCrypto && !!webCrypto.digest;
let useSha1Crypto = useWebCrypto;

export function sha1HashSync(bytes) {
  const sha = tinySha1(new Uint8Array(bytes));

  return new Uint8Array(bytesFromHex(sha)).buffer;
}

export function sha1BytesSync(bytes) {
  const hash = sha1HashSync(bytes);

  return bytesFromArrayBuffer(hash);
}

export async function sha1Hash(bytes) {
  const bytesTyped = convertToUint8Array(bytes);
  if (!useSha1Crypto) {
    return sha1HashSync(bytes);
  }

  try {
    const digest = await webCrypto.digest({ name: 'SHA-1' }, bytesTyped);

    return digest;
  } catch (e) {
    console.error('Crypto digest error', e);
    useSha1Crypto = false;
    return sha1HashSync(bytes);
  }
};
