import { http } from 'app/core/mtproto/http';
import { TLMessage } from 'app/core/mtproto/TLMessage';
import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { MTPClient } from 'app/core/MTPClient';
import { SecureRandom } from 'app/core/mtproto/vendors/SecureRandom';
import { callMethod } from 'app/core/mtproto/crypto/crypto';

import {
  convertToUint8Array,
  bytesFromHex,
} from 'app/core/mtproto/crypto/shared';
import { MessageReader } from 'app/core/mtproto/MessageReader'

const sessionID = new SecureRandom().nextBytes(new Array(8));

export async function invokeApi(body: MessageCreator) {
  const authData = await new MTPClient().auth();
  const message = new TLMessage({
    body: body.getBytes(true),
    seq_no: TLMessage.generateSeqNo(),
  });
  const serverSalt = bytesFromHex(authData.serverSalt);
  const authKeyID = bytesFromHex(authData.authKeyID);
  const authKey = bytesFromHex(authData.authKey);

  console.log(message, authData);

  const data = new MessageCreator(message.body.length + 256)
    .intBytes(serverSalt, 64)
    .intBytes(sessionID, 64)
    .long(message.msg_id)
    .int(message.seq_no)
    .int(message.body.byteLength)
    .raw(message.body);

  const dataBuffer = data.pack();

  const authKeyUint8 = convertToUint8Array(authKey);

  const bytesHash = await callMethod('sha1', dataBuffer);
  const msgKey = new Uint8Array(bytesHash).subarray(4, 20);
  const keyIv = await callMethod('get-msgkey-iv', authKeyUint8, msgKey, true);
  const encryptedBytes = await callMethod(
    'aes-encrypt',
    dataBuffer,
    keyIv[0],
    keyIv[1],
  );

  const apiRequest = new MessageCreator(encryptedBytes.length + 256)
    .intBytes(authKeyID, 64)
    .int128(msgKey)
    .raw(encryptedBytes)
    .pack();

  return http(apiRequest);
}


function decryptMessage(res: ArrayBuffer) {
  const m = new MessageReader(res).int128('authKey').int()
}