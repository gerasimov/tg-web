import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { MessageReader } from 'app/core/mtproto/MessageReader';

GetConfig.CLASS_ID = 0xc4f9186b;

GetConfig.READ_CLASS_ID = 0x232d5905;

export function GetConfig() {
  return new MessageCreator(4).int(GetConfig.CLASS_ID);
}

GetConfig.read = (data: ArrayBuffer) =>
  new MessageReader(data)
    .int('msgType')
    .int('date')
    .bool('test_mode')
    .int('this_dc')
    .vector(reader => {
      const type = reader._int();
      const id = reader._int();
      const hostname = reader._bytes();
      const ip = reader._bytes();
      const post = reader._int();

      return {
        id,
        hostname,
        ip: [...ip].map(x => String.fromCharCode(x)).join(''),
        post,
        type,
      };
    }, 'dc_options')
    .toJSON();

GetConfig.toString = () => GetConfig.CLASS_ID;
