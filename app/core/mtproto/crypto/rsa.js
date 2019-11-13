import { addPadding } from 'app/core/mtproto/sharedUtils'
import { bigInt2str, powMod, str2bigInt } from 'leemon'
import { bytesFromHex, bytesToHex } from 'app/core/mtproto/crypto/shared'

export function rsaEncrypt(publicKey, bytes) {
  bytes = addPadding(bytes, 255);

  const N = str2bigInt(publicKey.modulus, 16, 256);
  const E = str2bigInt(publicKey.exponent, 16, 256);
  const X = str2bigInt(bytesToHex(bytes), 16, 256);
  const encryptedBigInt = powMod(X, E, N),
    encryptedBytes = bytesFromHex(bigInt2str(encryptedBigInt, 16));

  return encryptedBytes;
}

