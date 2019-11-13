import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export class ReqPQ {
  static CLASS_ID = 0xbe7e8ef1;

  static create = ({ nonce }: { nonce?: number[] } = {}) =>
    new MessageCreator(20)
      .int(ReqPQ.CLASS_ID)
      .int128(nonce)
      .pack();
}
