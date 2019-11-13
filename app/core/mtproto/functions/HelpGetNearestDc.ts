import { InvokeWithLayer } from 'app/core/mtproto/functions/InvokeWithLayer';

export class HelpGetNearestDc {
  static CLASS_ID = 0x1fb33026;

  static create = InvokeWithLayer.createCreator(message =>
    message.int(HelpGetNearestDc.CLASS_ID).pack(),
  );
}
