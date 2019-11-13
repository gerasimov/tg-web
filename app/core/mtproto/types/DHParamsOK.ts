import { MessageReader } from 'app/core/mtproto/sageReader';

export class DHParamsOK {
  static CLASS_ID = 0xd0e8075c;

  static read = (data: ArrayBuffer) =>
    new MessageReader(data)
      .int('class_id')
      .int128('nonce')
      .int128('server_nonce')
      .string('encryptedAnswer')
      .toJSON();
}
