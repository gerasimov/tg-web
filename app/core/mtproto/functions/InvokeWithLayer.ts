import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export class InvokeWithLayer {
  static CLASS_ID = 0xda9b0d0d;

  static create = (query) => {
    const m = new MessageCreator(2048).int(InvokeWithLayer.CLASS_ID).int(105);
    
    if (query) {
      m.raw(query.getBytes(true))
    }
    
    return m;
  }

}
