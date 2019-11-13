import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export class SetClientDHParams {
  static CLASS_ID = 0xf5045f1f;

  create = ({ nonce, server_nonce, encrypted_data }) =>
    new MessageCreator(200)
      .int(SetClientDHParams.CLASS_ID)
      .int128(nonce)
      .int128(server_nonce)
      .bytes(encrypted_data);
}
