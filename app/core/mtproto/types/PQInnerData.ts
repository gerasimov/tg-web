import { MessageCreator } from 'app/core/mtproto/MessageCreator';

type PQInnerPayload = {
  pq: number[];
  p: number[];
  q: number[];
  publicKey: { fingerprint: string };
  encrypted_data: any;
  nonce: number[];
  server_nonce: number[];
  new_nonce: number[];
};

export class PQInnerData {
  static CLASS_ID = 0x83c95aec;

  static create = ({
    pq,
    p,
    q,
    nonce,
    server_nonce,
    new_nonce,
  }: PQInnerPayload) =>
    new MessageCreator(256)
      .int(PQInnerData.CLASS_ID)
      .bytes(pq)
      .bytes(p)
      .bytes(q)
      .int128(nonce)
      .int128(server_nonce)
      .int256(new_nonce);
}
