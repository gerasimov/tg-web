import { MessageReader } from 'app/core/mtproto/MessageReader';

RpcError.CLASS_ID = 558156313;

export function RpcError(buf: ArrayBuffer) {
  const data = new MessageReader(buf)
    .int('error_code')
    .string('error_message')
    .toJSON();
  
  data.error_message = tostr(data.error_message);
  
  return data;
}

function tostr(uint8) {
  const l = uint8.length;
  const txt = [];

  for (let i = 0; i < l; i++) {
    txt.push(String.fromCharCode(uint8[i]));
  }
  return txt.join('');
};