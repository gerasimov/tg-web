import { sha256Hash } from 'app/core/mtproto/crypto/sha256';
import { concat, convertToUint8Array } from 'app/core/mtproto/crypto/shared'

export async function getMsgKeyIv(auth_key, msg_key, x) {
  const sha256a = await sha256Hash(
    concat(
      new Uint8Array(msg_key),
      new Uint8Array(auth_key).subarray(x, x + 36),
    ),
  ).then(convertToUint8Array);

  const sha256b = await sha256Hash(
    concat(
      new Uint8Array(auth_key).subarray(40 + x, 40 + x + 36),
      new Uint8Array(msg_key),
    ),
  ).then(convertToUint8Array);

  const aes_key = concat(
    sha256a.subarray(0, 8),
    sha256b.subarray(8, 8 + 16),
    sha256a.subarray(24, 24 + 8),
  );

  const aes_iv = concat(
    sha256b.subarray(0, 8),
    sha256a.subarray(8, 16 + 8),
    sha256b.subarray(24, 24 + 8),
  );

  return [aes_key, aes_iv];
}
