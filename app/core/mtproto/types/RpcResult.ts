import { MessageReader } from 'app/core/mtproto/MessageReader';
import { uintToInt } from 'app/core/mtproto/sharedUtils';
import { RpcError } from 'app/core/mtproto/types/RpcError';
import { bytesToArrayBuffer } from 'app/core/mtproto/utils';
import { GetNearestDc } from 'app/core/mtproto/functions/help/GetNearestDc';
import { SendCode } from 'app/core/mtproto/functions/auth/SendCode';
import { GetConfig } from 'app/core/mtproto/functions/help/GetConifg'

export class RpcResult {
  static CLASS_ID = -212046591; //0xf35c6d01 - is it wrong?;

  static read = (buf: ArrayBuffer) => {
    const m = new MessageReader(buf)
      .int('msgType')
      .long('replyTo');


    const type = uintToInt(m._int(true));
    const bytes = m._bytes(buf.byteLength - m.offset);
    const dataBuffer = bytesToArrayBuffer(bytes);

    let body = m.toJSON();
    
    
    switch (type) {
      case RpcError.CLASS_ID: {
        return { ...body, ...RpcError(dataBuffer) };
      }
      case GetNearestDc.READ_CLASS_ID: {
        return { ...body, ...GetNearestDc.read(dataBuffer) };
      }
      case SendCode.CLASS_ID:
      case SendCode.READ_CLASS_ID: {
        return { ...body, ...SendCode.read(dataBuffer) };
      } 
      case GetConfig.READ_CLASS_ID: {
        return  { ...body, ...GetConfig.read(dataBuffer) };
      }
      default:
        console.log(type);
    }

    return body;
  };

  static toString() {
    return RpcResult.CLASS_ID;
  }
}
