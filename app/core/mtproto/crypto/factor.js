import {
  add_,
  bigInt2str,
  bpe,
  copy_,
  copyInt_, divide_,
  eGCD_,
  equalsInt,
  greater,
  isZero, one,
  rightShift_,
  str2bigInt,
  sub_,
} from 'leemon'
import { nextRandomInt } from 'app/core/mtproto/sharedUtils'
import { bytesFromHex, bytesToHex } from 'app/core/mtproto/crypto/shared'

function bytesFromLeemonBigInt(bigInt) {
  const str = bigInt2str(bigInt, 16);
  return bytesFromHex(str);
}

export function pqPrimeFactorization(pqBytes) {
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
