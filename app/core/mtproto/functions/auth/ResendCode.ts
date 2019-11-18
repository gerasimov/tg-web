import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { MessageReader } from 'app/core/mtproto/MessageReader';

ResendCode.CLASS_ID = 0x3ef1a9bf;

ResendCode.READ_CLASS_ID = 0x5e002502;

export function ResendCode(phone: string, phoneHash: string) {
  return new MessageCreator(128)
    .int(ResendCode.CLASS_ID)
    .string(phone)
    .string(phoneHash);
}

ResendCode.read = (buf: ArrayBuffer) =>
  new MessageReader(buf)
    .bool('class_id')
    .int('type')
    .string('phone_code_hash')
    .toJSON();
