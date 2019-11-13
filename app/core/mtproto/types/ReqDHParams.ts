import { MessageCreator } from 'app/core/mtproto/MessageCreator';

type DHPayload = {
  p: number[];
  q: number[];
  publicKey: { fingerprint: string };
  encrypted_data: any;
  nonce: number[];
  server_nonce: number[];
};

export class ReqDHParams {
  static CLASS_ID = 0xd712e4be;

  static create = ({
    p,
    q,
    publicKey,
    encrypted_data,
    nonce,
    server_nonce,
  }: DHPayload) =>
    new MessageCreator(360)
      .int(ReqDHParams.CLASS_ID)
      .int128(nonce)
      .int128(server_nonce)
      .bytes(p)
      .bytes(q)
      .long(publicKey.fingerprint)
      .bytes(encrypted_data)
      .pack();
}
