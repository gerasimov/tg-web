import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { generateMessageID } from 'app/core/mtproto/time';
import { TLMessage } from 'app/core/mtproto/TLMessage';

MessagesContainer.CLASS_ID = 0x73f1f8dc;

export function MessagesContainer(...messages: MessageCreator[]): MessageCreator {
  const l = messages.length;
  let bodySize = 0;

  for (let i = 0; i < l; i++) {
    bodySize += messages[i].pack().byteLength;
  }
  
  const msg = new MessageCreator(bodySize + (messages.length * 64) + 256)
    .int(MessagesContainer.CLASS_ID)
    .int(messages.length);

  for (let i = 0; i < l; i++) {
    const tlmsg = new TLMessage({
      body: messages[i].getBytes(true),
    });

    msg
      .long(tlmsg.msg_id)
      .int(tlmsg.seq_no)
      .int(tlmsg.body.length)
      .raw(tlmsg.body);
  }

  return msg;
}
