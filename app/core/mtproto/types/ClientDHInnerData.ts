import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export class ClientDHInnerData {
  static CLASS_ID = 0x6643b654;

  static create = ({ nonce, server_nonce, retry_id, g_b }) =>
    new MessageCreator(256)
      .int(ClientDHInnerData.CLASS_ID)
      .int128(nonce)
      .int128(server_nonce)
      .long(retry_id)
      .bytes(g_b)
      .pack();
}
