import { MessageReader } from 'app/core/mtproto/MessageReader';
import { Long } from 'app/core/mtproto/types/Long';
import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export class MsgsAck {
  static CLASS_ID = 0x62d6b459;

  static create = (msgIds: string[]) =>
    new MessageCreator(256).int(MsgsAck.CLASS_ID).vector(Long.write, msgIds);

  static read = (buf: ArrayBuffer) =>
    new MessageReader(buf)
      .int('msgType')
      .vector(Long, 'msg_ids')
      .extend('type', 'ask')
      .toJSON();

  static toString() {
    return MsgsAck.CLASS_ID;
  }
}
