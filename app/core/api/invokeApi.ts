/*
 
 https://core.telegram.org/mtproto/description#key-identifier-auth-key-id
 
*/

import { http } from 'app/core/mtproto/http';
import { generateSeqNo, TLMessage } from 'app/core/mtproto/TLMessage';
import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { encryptMessage } from 'app/core/api/encryptMessage';
import { decryptMessage } from 'app/core/api/decryptMessage';
import { responseHandler } from 'app/core/api/responseHandler';
import dhAuth from 'app/core/mtproto/DHAuth';
import { AuthStorage } from 'app/core/services/AuthStorage';
import { getDeffered, sentMessages } from 'app/core/api/messageQueue';

type RequestBody = (() => MessageCreator) | MessageCreator;

export async function invokeApi(
  body: RequestBody,
  { noContent, noResponse } = {},
) {
  if (!(body instanceof MessageCreator) && typeof body === 'function') {
    // @ts-ignore
    body = body();
  }
  
  const result: AuthStorage | undefined = await dhAuth.auth();

  if (!result || !result.authKey) {
    throw new Error('er');
  }

  const message = new TLMessage({
    body: body.getBytes(true),
    seq_no: generateSeqNo(noContent),
  });

  const encryptedMessage = await encryptMessage(message);

  const deffered = getDeffered();
  sentMessages[message.msg_id] = deffered;
  
  if (noResponse) {
    http(encryptedMessage);
    return deffered.promise;
  }

  try {
    const resultBuffer: ArrayBuffer = await http(encryptedMessage);
    decryptMessage(resultBuffer).then(decryptedMessages =>
      responseHandler(decryptedMessages, {
        body,
        noContent,
        message,
      }),
    );

    return deffered.promise;
  } catch (e) {
    return Promise.reject(e);
  }
}
