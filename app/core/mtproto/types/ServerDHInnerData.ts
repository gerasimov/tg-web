import { MessageReader } from 'app/core/mtproto/MessageReader';

export class ServerDHInnerData {
  static CLASS_ID = 0xb5890dba;

  static read = (data: ArrayBuffer) =>
    new MessageReader(data)
      .int('class_id')
      .int128('nonce')
      .int128('server_nonce')
      .int('g')
      .bytes('dh_prime')
      .bytes('g_a')
      .int('server_time')
      .toJSON();
}
