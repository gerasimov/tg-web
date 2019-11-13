import { MessageCreator } from 'app/core/mtproto/MessageCreator';

type ClientDHInnerDataType = {
  nonce: string;
  server_nonce: string;
  retry_id: string;
  g_b: string;
};

export class ClientDHInnerData {
  static CLASS_ID = 0x6643b654;

  static create = ({
    nonce,
    server_nonce,
    retry_id,
    g_b,
  }: ClientDHInnerDataType) =>
    new MessageCreator(512)
      .int(ClientDHInnerData.CLASS_ID)
      .int128(nonce)
      .int128(server_nonce)
      .long(retry_id)
      .bytes(g_b);
}
