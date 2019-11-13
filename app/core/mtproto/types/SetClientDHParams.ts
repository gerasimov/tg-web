import { MessageCreator } from 'app/core/mtproto/MessageCreator';

type SetClientDHParamsType = {
  nonce: string;
  server_nonce: string;
  encrypted_data: string;
};

export class SetClientDHParams {
  static CLASS_ID = 0xf5045f1f;

  static create = ({
    nonce,
    server_nonce,
    encrypted_data,
  }: SetClientDHParamsType) =>
    new MessageCreator(512)
      .int(SetClientDHParams.CLASS_ID)
      .int128(nonce)
      .int128(server_nonce)
      .bytes(encrypted_data)
      .pack();
}
