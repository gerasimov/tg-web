import {
  add_,
  bigInt2str,
  bpe,
  copy_,
  copyInt_,
  divide_,
  eGCD_,
  equalsInt,
  greater,
  isZero,
  one,
  powMod,
  rightShift_,
  str2bigInt,
  sub_,
} from 'leemon';
import { addPadding, nextRandomInt } from 'app/core/mtproto/sharedUtils';
import CryptoJS from 'app/core/mtproto/vendors/cryptojs';

function bytesToHex(bytes) {
  bytes = bytes || [];
  var arr = [];
  for (var i = 0; i < bytes.length; i++) {
    arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16));
  }
  return arr.join('');
}

function bytesFromHex(hexString) {
  var len = hexString.length,
    i;
  var start = 0;
  var bytes = [];

  if (hexString.length % 2) {
    bytes.push(parseInt(hexString.charAt(0), 16));
    start++;
  }

  for (i = start; i < len; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  return bytes;
}

function bytesFromLeemonBigInt(bigInt) {
  const str = bigInt2str(bigInt, 16);
  return bytesFromHex(str);
}

function pqPrimeFactorization(pqBytes) {
  const minSize = Math.ceil(64 / bpe) + 1;

  const hex = bytesToHex(pqBytes);
  const lWhat = str2bigInt(hex, 16, minSize);
  const result = pqPrimeLeemon(lWhat);
  return result;
}

function pqPrimeLeemon(what) {
  const minBits = 64;
  const minLen = Math.ceil(minBits / bpe) + 1;
  let it = 0;
  let q, lim;
  const a = new Array(minLen);
  const b = new Array(minLen);
  const c = new Array(minLen);
  const g = new Array(minLen);
  const z = new Array(minLen);
  const x = new Array(minLen);
  const y = new Array(minLen);

  for (let i = 0; i < 3; i++) {
    q = (nextRandomInt(128) & 15) + 17;
    copyInt_(x, nextRandomInt(1000000000) + 1);
    copy_(y, x);
    lim = 1 << (i + 18);

    for (let j = 1; j < lim; j++) {
      ++it;
      copy_(a, x);
      copy_(b, x);
      copyInt_(c, q);

      while (!isZero(b)) {
        if (b[0] & 1) {
          add_(c, a);
          if (greater(c, what)) {
            sub_(c, what);
          }
        }
        add_(a, a);
        if (greater(a, what)) {
          sub_(a, what);
        }
        rightShift_(b, 1);
      }

      copy_(x, c);
      if (greater(x, y)) {
        copy_(z, x);
        sub_(z, y);
      } else {
        copy_(z, y);
        sub_(z, x);
      }
      eGCD_(z, what, g, a, b);
      if (!equalsInt(g, 1)) {
        break;
      }
      if ((j & (j - 1)) === 0) {
        copy_(y, x);
      }
    }
    if (greater(g, one)) {
      break;
    }
  }

  divide_(what, g, x, y);

  const [P, Q] = greater(g, x) ? [x, g] : [g, x];

  return [bytesFromLeemonBigInt(P), bytesFromLeemonBigInt(Q), it];
}

export function bytesModPow(x, y, m) {
  const xBigInt = str2bigInt(bytesToHex(x), 16);
  const yBigInt = str2bigInt(bytesToHex(y), 16);
  const mBigInt = str2bigInt(bytesToHex(m), 16);
  const resBigInt = powMod(xBigInt, yBigInt, mBigInt);

  return bytesFromHex(bigInt2str(resBigInt, 16));
}

export function rsaEncrypt(publicKey, bytes) {
  bytes = addPadding(bytes, 255);

  const N = str2bigInt(publicKey.modulus, 16, 256);
  const E = str2bigInt(publicKey.exponent, 16, 256);
  const X = str2bigInt(bytesToHex(bytes), 16, 256);
  const encryptedBigInt = powMod(X, E, N),
    encryptedBytes = bytesFromHex(bigInt2str(encryptedBigInt, 16));

  return encryptedBytes;
}

export function aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {
  console.log('AES decrypt start', encryptedBytes.length);
  try {
    const decryptedWords = CryptoJS.AES.decrypt(
      { ciphertext: bytesToWords(encryptedBytes) },
      bytesToWords(keyBytes),
      {
        iv: bytesToWords(ivBytes),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE,
      },
    );
    return bytesFromWords(decryptedWords);
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function aesEncryptSync(bytes, keyBytes, ivBytes) {
  console.log('AES encrypt start');
  bytes = addPadding(bytes);
  var encryptedWords = CryptoJS.AES.encrypt(
    bytesToWords(bytes),
    bytesToWords(keyBytes),
    {
      iv: bytesToWords(ivBytes),
      padding: CryptoJS.pad.NoPadding,
      mode: CryptoJS.mode.IGE,
    },
  ).ciphertext;

  var encryptedBytes = bytesFromWords(encryptedWords);
  console.log('AES encrypt finish');

  return encryptedBytes;
}

function bytesToWords(bytes) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes);
  }
  const len = bytes.length;
  const words = [];

  for (let i = 0; i < len; i++) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }

  return new CryptoJS.lib.WordArray.init(words, len);
}

function bytesFromWords(wordArray) {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const bytes = [];

  for (let i = 0; i < sigBytes; i++) {
    bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
  }

  return bytes;
}

console.log('worker');
onmessage = async ({ data }) => {
  const { type } = data;
  switch (type) {
    case 'factor': {
      const res = pqPrimeFactorization(...data.args);
      return postMessage({
        type,
        res,
      });
    }
    case 'rsa-encrypt': {
      const res = rsaEncrypt(...data.args);
      return postMessage({
        type,
        res,
      });
    }
    case 'aes-encrypt': {
      const res = await aesEncryptSync(...data.args);
      return postMessage({
        type,
        res,
      });
    }
    case 'aes-decrypt': {
      const res = await aesDecryptSync(...data.args);
      return postMessage({
        type,
        res,
      });
    }
    case 'bytes-pow': {
      return postMessage({
        type,
        res: bytesModPow(...data.args),
      });
    }
    default:
      postMessage({ error: true });
  }
};
