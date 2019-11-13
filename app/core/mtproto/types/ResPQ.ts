import { MessageReader } from 'app/core/mtproto/MessageReader';
import { selectRsaKeyByFingerPrint } from 'app/core/mtproto/RSAKeys';

export class ResPQ {
  static read = (data: ArrayBuffer) => {
    const msg = new MessageReader(data)
      .int('constructor_id')
      .int128('nonce')
      .int128('server_nonce')
      .bytes('pq')
      .vector('long', 'fingerprints')
      .toJSON();

    msg.publicKey = selectRsaKeyByFingerPrint(msg.fingerprints);

    return msg;
  };
}
