import { InvokeWithLayer } from 'app/core/mtproto/functions/InvokeWithLayer';
import { HelpGetNearestDc } from 'app/core/mtproto/functions/HelpGetNearestDc';
import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export class InitConnection {
  static ClASS_ID = 0x785188b8;
  static API_ID = 1084923;

  static create = (query) => {
    const m = new MessageCreator(256)
      .int(InvokeWithLayer.CLASS_ID)
      .int(105)
      .int(InitConnection.ClASS_ID)
      .int(InitConnection.API_ID)
      .bytes(navigator.userAgent || 'Unknown UserAgent')
      .bytes(navigator.platform || 'Unknown Platform')
      .bytes('1.0.0')
      .bytes(navigator.language || 'en')
      .bytes('')
      .bytes(navigator.language || 'en');
    
    if (query) {
      m.raw(query.getBytes());
    }
    
    return m;
  };
}
