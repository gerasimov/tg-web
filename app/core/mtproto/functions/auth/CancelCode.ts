import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { MessageReader } from 'app/core/mtproto/MessageReader';

CancelCode.CLASS_ID = 0x1f040578;

export function CancelCode(phone: string, phoneHash: string) {
  return new MessageCreator(128)
    .int(CancelCode.CLASS_ID)
    .string(phone)
    .string(phoneHash);
}

CancelCode.read = (buf: ArrayBuffer) =>
  new MessageReader(buf).bool('status').toJSON();
