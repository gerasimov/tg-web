import { MessageReader } from 'app/core/mtproto/MessageReader';
import { Message } from 'app/core/mtproto/types/Message';

export class MessageContainer {
  static CLASS_ID = 0x73f1f8dc;

  static read = (buf: ArrayBuffer) =>
    new MessageReader(buf)
      .vector(Message, 'messages')
      .toJSON();
  
  static toString() {
    return MessageContainer.CLASS_ID;
  }
}
