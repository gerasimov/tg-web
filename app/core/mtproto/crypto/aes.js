import CryptoJS from 'app/core/vendors/cryptojs';
import { addPadding } from 'app/core/mtproto/crypto/shared';

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
    return null;
  }
}

export function aesEncryptSync(bytes, keyBytes, ivBytes) {
  console.log('AES encrypt start');
  bytes = addPadding(bytes);
  const encryptedWords = CryptoJS.AES.encrypt(
    bytesToWords(bytes),
    bytesToWords(keyBytes),
    {
      iv: bytesToWords(ivBytes),
      padding: CryptoJS.pad.NoPadding,
      mode: CryptoJS.mode.IGE,
    },
  ).ciphertext;

  const encryptedBytes = bytesFromWords(encryptedWords);
  console.log('AES encrypt finish');

  return encryptedBytes;
}

export function bytesFromWords(wordArray) {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const bytes = [];

  for (let i = 0; i < sigBytes; i++) {
    bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
  }

  return bytes;
}

export function bytesToWords(bytes) {
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
