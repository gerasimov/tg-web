import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { MessageReader } from 'app/core/mtproto/MessageReader';

SignIn.CLASS_ID = 0xbcd51581;

SignIn.READ_CLASS_ID = 0xcd050916;

export function SignIn(phone: string, phoneCodeHash: string, phoneCode: string) {
  return new MessageCreator(128)
    .int(SignIn.CLASS_ID)
    .string(phone)
    .string(phoneCodeHash)
    .string(phoneCode);
}

SignIn.read = (buf: ArrayBuffer) =>
  new MessageReader(buf)
    .int('class_id')
    .int('typeCode')
    .bool('phone_registered')
    .string('phone_code_hash')
    .int('nextType')
    .toJSON();
