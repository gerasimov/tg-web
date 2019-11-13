import { str2bigInt, divide_, bigInt2str, add_, leftShift_ } from 'leemon'

export const strDecToHex = str => {
  const res = bigInt2str(str2bigInt(str, 10, 0), 16).toString();
  return res.toLowerCase();
}

const dividerLem = str2bigInt('100000000', 16, 4);

export function longToInts(sLong) {
  const lemNum = str2bigInt(sLong, 10, 6);
  const div = new Array(lemNum.length);
  const rem = new Array(lemNum.length);
  divide_(lemNum, dividerLem, div, rem);
  return [~~bigInt2str(div, 10), ~~bigInt2str(rem, 10)];
}

export function bytesToArrayBuffer(b) {
  return new Uint8Array(b).buffer;
}

export function lshift32(high, low) {
  const highNum = str2bigInt(high.toString(), 10, 6)
  const nLow = str2bigInt(low.toString(), 10, 6)
  leftShift_(highNum, 32)

  add_(highNum, nLow)
  return bigInt2str(highNum, 10);
}

export function bytesCmp(bytes1, bytes2) {
  const len = bytes1.length;
  if (len !== bytes2.length) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (bytes1[i] !== bytes2[i]) {
      return false;
    }
  }
  return true;
}

export function bytesXor(bytes1, bytes2) {
  const len = bytes1.length;
  const bytes = [];

  for (let i = 0; i < len; ++i) {
    bytes[i] = bytes1[i] ^ bytes2[i];
  }

  return bytes;
}
