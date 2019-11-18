import { MessageReader } from 'app/core/mtproto/MessageReader'

export class NewSessionCreated {
  static CLASS_ID = -1631450872;

  static read = (buf: ArrayBuffer) =>
    new MessageReader(buf)
      .int('msgType')
      .long('replyTo')
      .int64('server_salt')
      .extend('type', 'new-session')
      .toJSON();
  
  static toString() {
    return NewSessionCreated.CLASS_ID;
  }
}
