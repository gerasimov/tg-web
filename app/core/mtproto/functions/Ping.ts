import { MessageCreator } from 'app/core/mtproto/MessageCreator';
import { nextRandomInt } from 'app/core/mtproto/sharedUtils';

Ping.CLASS_ID = 0x7abe77ec;

export function Ping() {
  return new MessageCreator(8)
    .int(Ping.CLASS_ID)
    .long([nextRandomInt(0xffffffff), nextRandomInt(0xffffffff)]);
}
