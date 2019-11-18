import { MessageReader } from 'app/core/mtproto/MessageReader'

export class BadServerSalt {
  static CLASS_ID = -307542917;//0xedab447b;
  
  static read = (buf: ArrayBuffer) => new MessageReader(buf)
    .int('class_id')
    .long('replyTo')
    .int('bad_msg_seqno')
    .int('error_code')
    .int64('new_server_salt')
    .toJSON();
  
  static toString() {
    return BadServerSalt.CLASS_ID;
  }
}