import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { MessageReader } from 'app/core/mtproto/MessageReader';

GetNearestDc.CLASS_ID = 0x1fb33026;

GetNearestDc.READ_CLASS_ID = -1910892683;

export function GetNearestDc() {
  return new MessageCreator(4).int(GetNearestDc.CLASS_ID);
}

GetNearestDc.read = (data: ArrayBuffer) =>
  new MessageReader(data)
    .int('msgType')
    .bytes('country')
    .int('dc')
    .int('nearest_dc')
    .toJSON();
