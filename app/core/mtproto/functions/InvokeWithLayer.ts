import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export function InvokeWithLayer(query?: MessageCreator) {
  const m = new MessageCreator(4048).int(InvokeWithLayer.CLASS_ID).int(105);

  if (query) {
    m.raw(query.getBytes(true));
  }

  return m;
}

InvokeWithLayer.CLASS_ID = 0xda9b0d0d;
