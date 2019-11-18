import { MessageReader } from 'app/core/mtproto/MessageReader';
import { selectRsaKeyByFingerPrint } from 'app/core/mtproto/RSAKeys';
import { Long } from 'app/core/mtproto/types/Long'

export class ResPQ {
  static read = (data: ArrayBuffer) => {
    const msg = new MessageReader(data)
      .int('constructor_id')
      .int128('nonce')
      .int128('server_nonce')
      .bytes('pq')
      .vector(Long, 'fingerprints')
      .toJSON();

    msg.publicKey = selectRsaKeyByFingerPrint(msg.fingerprints);

    return msg;
  };
}
