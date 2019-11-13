import { MessageCreator } from 'app/core/mtproto/MessageCreator';

class InvokeAfterMsg {
  static CLASS_ID = 0xcb9f372d;
}

export class InvokeWithLayer {
  static CLASS_ID = 0xda9b0d0d;

  static create = () =>
    new MessageCreator(2048).int(InvokeWithLayer.CLASS_ID).int(105);

  static createCreator = (fn: (data: MessageCreator) => MessageCreator) => () =>
    fn(InvokeWithLayer.create());
}
