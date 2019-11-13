import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export class Ping {
  static CLASS_ID = 0x7abe77ec;

  static create = () =>
    new MessageCreator(8).int(Ping.CLASS_ID).long(Date.now());
}
