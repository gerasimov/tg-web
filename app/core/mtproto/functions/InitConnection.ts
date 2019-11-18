import { MessageCreator } from 'app/core/mtproto/MessageCreator';

InitConnection.ClASS_ID = 0x785188b8;
InitConnection.API_ID = 1084923;

export function InitConnection(query) {
  const m = new MessageCreator(2024)
    .int(InitConnection.ClASS_ID)
    .int(InitConnection.API_ID)
    .string(navigator.userAgent || 'Unknown UserAgent')
    .string(navigator.platform || 'Unknown Platform')
    .string('1.0.0')
    .string(navigator.language || 'en')
    .string('')
    .string(navigator.language || 'en');

  if (query) {
    m.raw(query.getBytes(true));
  }

  return m;
}
