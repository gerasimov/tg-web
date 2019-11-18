import { bufferConcat, bytesToHex, convertToUint8Array } from 'app/core/mtproto/crypto/shared'
import { MessageReader } from 'app/core/mtproto/MessageReader'
import { bytesCmp, bytesToArrayBuffer } from 'app/core/mtproto/utils'
import { callMethod } from 'app/core/mtproto/crypto/crypto';
import authStorage from 'app/core/services/AuthStorage';

export async function decryptMessage(res: ArrayBuffer) {

  const { authKey, authKeyID, sessionID } = authStorage;
  const authKeyU = convertToUint8Array(authKey);

  const x = 8;

  const m = new MessageReader(res).int64('auth_key_id').int128('msg_key', true);
  m.rawBytes('encrypted_data', res.byteLength - m.offset, true);

  const { encrypted_data, msg_key, auth_key_id } = m.toJSON();

  if (!bytesCmp(authKeyID, auth_key_id)) {
    throw new Error(`invalid auth_key_id: ${bytesToHex(authKeyID)}`);
  }
  
  const keyIv = await callMethod('get-iv', authKeyU, msg_key, x);

  const dataWithPadding = await callMethod(
    'aes-decrypt',
    encrypted_data,
    keyIv[0],
    keyIv[1]
  );
  const messageKeyLarge = await callMethod(
    'sha256',
    bufferConcat(authKeyU.subarray(88 + x, 88 + x + 32), dataWithPadding),
  );
  const msgKey = new Uint8Array(messageKeyLarge).subarray(8, 8 + 16);

  if (!bytesCmp(msgKey, msg_key)) {
    throw 'msgkey error';
  }

  const r = new MessageReader(bytesToArrayBuffer(dataWithPadding))
    .int64('salt')
    .int64('session_id')
    .long('message_id')
    .int('seq_no')
    .int('message_data_len');

  const { message_data_len, session_id } = r.result;

  if (!bytesCmp(sessionID, session_id)) {
    throw new Error(`invalid session_id: ${bytesToHex(sessionID)}`);
  }

  if (
    message_data_len % 4 ||
    message_data_len > dataWithPadding.length - r.offset
  ) {
    throw new Error('len error');
  }

  r.rawBytes('message_data', message_data_len, true);

  const decryptedData = r.toJSON();

  return bytesToArrayBuffer(decryptedData.message_data);
}