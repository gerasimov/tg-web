import { MessageReader } from 'app/core/mtproto/MessageReader';

export class DHGenOk {
  static CLASS_ID = 0x3bcbf734;

  static read = (data: ArrayBuffer) =>
    new MessageReader(data)
      .int('class_id')
      .int128('nonce')
      .int128('server_nonce')
      .int128('new_nonce_hash1')
      .toJSON();
}
