import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { MessageReader } from 'app/core/mtproto/MessageReader';


export class HelpGetNearestDc {
  static CLASS_ID = 0x8e1a1775;
  
  static read = (data: ArrayBuffer) => new MessageReader(data)
    .string('country')
    .int('dc')
    .int('nearest_dc')
    .toJSON();

  static create = () => new MessageCreator(4).int(HelpGetNearestDc.CLASS_ID);
}
