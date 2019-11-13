import { http } from 'app/core/mtproto/http';
import { TLMessage } from 'app/core/mtproto/TLMessage';
import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { MTPClient } from 'app/core/MTPClient';
import { bufferConcat, nextRandomInt } from 'app/core/mtproto/sharedUtils';
import { SecureRandom } from 'app/core/mtproto/vendors/SecureRandom';
import { callMethod } from 'app/core/mtproto/crypto/crypto';
import {
  convertToUint8Array,
  bytesFromHex,
} from 'app/core/mtproto/crypto/shared';

const sessionID = new SecureRandom().nextBytes(new Array(8));

export async function invokeApi(body: Uint8Array | number[]) {
  const authData = await new MTPClient().auth();
  const message = new TLMessage({ body });

  const data = new MessageCreator(message.body.length + 2048)
    .intBytes(bytesFromHex(authData.serverSalt), 64)
    .intBytes(sessionID, 64)
    .long(message.msg_id)
    .int(message.seq_no)
    .int(message.body.length)
    .raw(message.body);

  const dataBuffer = data.pack();

  const paddingLength = 16 - (data.offset % 16) + 16 * (1 + nextRandomInt(5));
  const padding = new SecureRandom().nextBytes(new Array(paddingLength));
  const dataWithPadding = bufferConcat(dataBuffer, padding);
  const authKeyUint8 = convertToUint8Array(bytesFromHex(authData.authKey));

  const x = 0; //true ? 0 : 8;
  const msgKeyLargePlain = bufferConcat(
    authKeyUint8.subarray(88 + x, 88 + x + 32),
    dataWithPadding,
  );
  const msgKey = new Uint8Array(
    await callMethod('sha256', msgKeyLargePlain),
  ).subarray(8, 24);

  const keyIv = await callMethod('get-msgkey-iv', authKeyUint8, msgKey, true);
  const encryptedBytes = await callMethod(
    'aes-encrypt',
    dataWithPadding,
    keyIv[0],
    keyIv[1],
  );

  const apiRequest = new MessageCreator(encryptedBytes.length + 256)
    .intBytes(bytesFromHex(authData.authKeyID), 64)
    .int128(msgKey)
    .raw(encryptedBytes)
    .pack();

  return http(apiRequest);
}
