import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { InitConnection } from 'app/core/mtproto/functions/InitConnection';
import { MessageReader } from 'app/core/mtproto/MessageReader';

SendCode.CLASS_ID = -1502141361;//0xd16ff372;

SendCode.READ_CLASS_ID = 0x2215bcbd;//571849917; // is it old?;

export function SendCode(phone: string) {
  return new MessageCreator(128)
    .int(SendCode.CLASS_ID)
    .string(phone)
    .int(InitConnection.API_ID)
    .string('d3e4c01001d836729ae9e0e19629c4e4')
    .int(0xdebebe83)
    .int(5)
}

SendCode.read = (buf: ArrayBuffer) =>
  new MessageReader(buf)
    .int('class_id')
    .bool('phone_registered')
    .string('phone_code_hash')
    .toJSON();
