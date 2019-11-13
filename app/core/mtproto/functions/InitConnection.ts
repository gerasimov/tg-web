import { InvokeWithLayer } from 'app/core/mtproto/functions/InvokeWithLayer';

export class InitConnection {
  static ClASS_ID = 0x785188b8;
  static API_ID = 1084923;

  static create = InvokeWithLayer.createCreator(msg =>
    msg
      .int(InitConnection.ClASS_ID)
      .int(InitConnection.API_ID)
      .string(navigator.userAgent || 'Unknown UserAgent')
      .string(navigator.platform || 'Unknown Platform')
      .string('1.0.0')
      .string(navigator.language || 'en')
      .string('')
      .string(navigator.language || 'en')
  );
}
