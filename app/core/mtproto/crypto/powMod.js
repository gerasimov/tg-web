import { bigInt2str, powMod, str2bigInt } from 'leemon'
import { bytesFromHex, bytesToHex } from 'app/core/mtproto/crypto/shared'

export function bytesModPow(x, y, m) {
  const xBigInt = str2bigInt(bytesToHex(x), 16);
  const yBigInt = str2bigInt(bytesToHex(y), 16);
  const mBigInt = str2bigInt(bytesToHex(m), 16);
  const resBigInt = powMod(xBigInt, yBigInt, mBigInt);

  return bytesFromHex(bigInt2str(resBigInt, 16));
}
