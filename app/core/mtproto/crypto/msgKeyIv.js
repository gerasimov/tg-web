import { sha1BytesSync } from 'app/core/mtproto/crypto/sha1'

export async function getMsgKeyIv(authKey, msgKey, isOut) {
  const x = isOut ? 0 : 8;
  const sha1aText = new Uint8Array(48);
  const sha1bText = new Uint8Array(48);
  const sha1cText = new Uint8Array(48);
  const sha1dText = new Uint8Array(48);

  sha1aText.set(msgKey, 0);
  sha1aText.set(authKey.subarray(x, x + 32), 16);

  sha1bText.set(authKey.subarray(x + 32, x + 48), 0);
  sha1bText.set(msgKey, 16);
  sha1bText.set(authKey.subarray(x + 48, x + 64), 32);

  sha1cText.set(authKey.subarray(x + 64, x + 96), 0);
  sha1cText.set(msgKey, 32);

  sha1dText.set(msgKey, 0);
  sha1dText.set(authKey.subarray(x + 96, x + 128), 16);

  const aesKey = new Uint8Array(32),
    aesIv = new Uint8Array(32),
    sha1a = new Uint8Array(sha1BytesSync(sha1aText)),
    sha1b = new Uint8Array(sha1BytesSync(sha1bText)),
    sha1c = new Uint8Array(sha1BytesSync(sha1cText)),
    sha1d = new Uint8Array(sha1BytesSync(sha1dText));

  aesKey.set(sha1a.subarray(0, 8));
  aesKey.set(sha1b.subarray(8, 20), 8);
  aesKey.set(sha1c.subarray(4, 16), 20);

  aesIv.set(sha1a.subarray(8, 20));
  aesIv.set(sha1b.subarray(0, 8), 12);
  aesIv.set(sha1c.subarray(16, 20), 20);
  aesIv.set(sha1d.subarray(0, 8), 24);

  return [aesKey, aesIv];
}