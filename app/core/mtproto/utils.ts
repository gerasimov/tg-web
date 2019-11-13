import { str2bigInt, divide_, bigInt2str, add_, leftShift_ } from 'leemon'
import sha1 from 'tiny-sha1'

export const strDecToHex = str => {
  const res = bigInt2str(str2bigInt(str, 10, 0), 16).toString();
  return res.toLowerCase();
}

const dividerLem = str2bigInt('100000000', 16, 4);

export function longToInts(sLong: string) {
  const lemNum = str2bigInt(sLong, 10, 6);
  const div = new Array(lemNum.length);
  const rem = new Array(lemNum.length);
  divide_(lemNum, dividerLem, div, rem);
  return [~~bigInt2str(div, 10), ~~bigInt2str(rem, 10)];
}

export function intToUint(val: number | string) {
  if (typeof val === 'string') {
    val = parseInt(val);
  }
  if (val < 0) {
    val = val + 4294967296;
  }
  return val;
}

export function uintToInt(val: number) {
  if (val > 2147483647) {
    val = val - 4294967296;
  }
  return val;
}

export function bytesToHex(bytes: any) {
  bytes = bytes || [];
  const arr = [];
  for (let i = 0; i < bytes.length; i++) {
    arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16));
  }
  return arr.join('');
}

export function bytesToArrayBuffer(b: any) {
  return new Uint8Array(b).buffer;
}

export function lshift32(high, low) {
  const highNum = str2bigInt(high.toString(), 10, 6)
  const nLow = str2bigInt(low.toString(), 10, 6)
  leftShift_(highNum, 32)

  add_(highNum, nLow)
  const res = bigInt2str(highNum, 10)
  return res
}

export function bytesFromArrayBuffer(buffer) {
  const byteView = new Uint8Array(buffer);
  const bytes = Array.from(byteView);
  return bytes;
}

export function bytesFromHex(hexString: string) {
  let len = hexString.length,
    i;
  let start = 0;
  const bytes = [];

  if (hexString.length % 2) {
    bytes.push(parseInt(hexString.charAt(0), 16));
    start++;
  }

  for (i = start; i < len; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  return bytes;
}

export function bytesCmp(bytes1, bytes2) {
  const len = bytes1.length;
  if (len !== bytes2.length) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (bytes1[i] != bytes2[i]) {
      return false;
    }
  }
  return true;
}

export function bytesXor(bytes1, bytes2) {
  var len = bytes1.length;
  var bytes = [];

  for (var i = 0; i < len; ++i) {
    bytes[i] = bytes1[i] ^ bytes2[i];
  }

  return bytes;
}

export function sha1BytesSync(bytes) {
  return bytesFromArrayBuffer(sha1HashSync(bytes))
}

export function sha1HashSync(bytes) {
  const sha = sha1(new Uint8Array(bytes));

  return bytesToArrayBuffer(bytesFromHex(sha));
}

export function gzipUncompress(bytes) {
  //return zlib.inflate('CCCCC', bytes);
}
