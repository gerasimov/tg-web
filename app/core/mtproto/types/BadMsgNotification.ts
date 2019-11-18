import { MessageReader } from 'app/core/mtproto/MessageReader';

export class BadMsgNotification {
  static CLASS_ID = -1477445615;
  
  static read = (buf: ArrayBuffer) => {
    return new MessageReader(buf)
      .int('class_id')
      .long('replyTo')
      .int('bad_msg_seqno')
      .int('error_code')
      .toJSON();
  };
  
  static toString() {
    return BadMsgNotification.CLASS_ID;
  }
}
