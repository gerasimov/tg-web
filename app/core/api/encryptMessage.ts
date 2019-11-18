import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { rng_get_bytes } from 'app/core/vendors/SecureRandom';
import { nextRandomInt } from 'app/core/mtproto/sharedUtils';
import {
  bufferConcat,
  convertToUint8Array,
} from 'app/core/mtproto/crypto/shared';
import { callMethod } from 'app/core/mtproto/crypto/crypto';
import { TLMessage } from 'app/core/mtproto/TLMessage';
import authStorage from 'app/core/services/AuthStorage';

export async function encryptMessage(message: TLMessage): Promise<ArrayBuffer> {
  let { serverSalt, sessionID, authKey, authKeyID } = authStorage;

  const data = new MessageCreator(message.body.byteLength + 64)
    .intBytes(serverSalt, 64)
    .intBytes(sessionID, 64)
    .long(message.msg_id)
    .int(message.seq_no)
    .int(message.body.byteLength)
    .raw(message.body);

  const x = 0;

  const padding = rng_get_bytes(
    new Array(16 - (data.offset % 16) + 16 * (1 + nextRandomInt(5))),
  );
  const dataBuffer = data.pack();
  const dataWithPadding = bufferConcat(dataBuffer, padding);
  const authKeyU = convertToUint8Array(authKey);
  const messageKeyLarge = await callMethod(
    'sha256',
    bufferConcat(authKeyU.subarray(88 + x, 88 + x + 32), dataWithPadding),
  );
  
  const msgKey = convertToUint8Array(messageKeyLarge).subarray(8, 8 + 16);
  const keyIv = await callMethod('get-iv', authKeyU, msgKey, x);
  const encryptedBytes = await callMethod(
    'aes-encrypt',
    dataWithPadding,
    keyIv[0],
    keyIv[1]
  );

  return new MessageCreator(encryptedBytes.length + 32)
    .intBytes(authKeyID, 64)
    .int128(msgKey)
    .raw(encryptedBytes)
    .pack();
}

