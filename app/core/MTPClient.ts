import { invoke } from 'app/core/mtproto/invoke';
import { SecureRandom } from 'app/core/mtproto/vendors/SecureRandom';
import { ReqPQ } from 'app/core/mtproto/types/ReqPQ';
import { ResPQ } from 'app/core/mtproto/types/ResPQ';
import { PQInnerData } from 'app/core/mtproto/types/PQInnerData';
import { ReqDHParams } from 'app/core/mtproto/types/ReqDHParams';
import { DHParamsOK } from 'app/core/mtproto/types/DHParamsOK';
import { ClientDHInnerData } from './mtproto/types/ClientDHInnerData';
import { SetClientDHParams } from 'app/core/mtproto/types/SetClientDHParams';
import { ServerDHInnerData } from 'app/core/mtproto/types/ServerDHInnerData';
import { DHGenOk } from 'app/core/mtproto/types/DHGenOk';
import { sha1BytesSync } from 'app/core/mtproto/crypto/sha1';
import { MessageReader } from 'app/core/mtproto/MessageReader';
import { bytesCmp, bytesToArrayBuffer, bytesXor } from 'app/core/mtproto/utils'
import { callMethod } from 'app/core/mtproto/crypto/crypto';
import { applyServerTime } from 'app/core/mtproto/time';
import {
  bytesFromArrayBuffer,
  bytesFromHex,
  bytesToHex,
} from 'app/core/mtproto/crypto/shared';

class MTPClient {
  session: any;

  auth = async () => {
    const authData = this.getSavedTokens();

    if (authData) {
      return authData;
    }

    const nonce = new SecureRandom().nextBytes(new Array(16));
    this.session = {
      nonce,
    };

    this.session = ResPQ.read(await invoke(ReqPQ.create(this.session)));
    // @ts-ignore
    const [p, q] = await callMethod('factor', this.session.pq);

    Object.assign(this.session, {
      p,
      q,
      new_nonce: new SecureRandom().nextBytes(new Array(32)),
    });

    const dhRequest = await this.createDHRequest();
    const dhResult = await invoke(dhRequest);

    const classId = this.getResClassId(dhResult);

    if (classId !== DHParamsOK.CLASS_ID) {
    }

    const dhParamsOk = DHParamsOK.read(dhResult);

    const tmpAesKey = sha1BytesSync(
      this.session.new_nonce.concat(dhParamsOk.server_nonce),
    ).concat(
      sha1BytesSync(
        dhParamsOk.server_nonce.concat(this.session.new_nonce),
      ).slice(0, 12),
    );

    const tmpAesIv = sha1BytesSync(
      dhParamsOk.server_nonce.concat(this.session.new_nonce),
    )
      .slice(12)
      .concat(
        sha1BytesSync(
          [].concat(this.session.new_nonce, this.session.new_nonce),
        ),
        this.session.new_nonce.slice(0, 4),
      );

    const answerWithHash = await callMethod(
      'aes-decrypt',
      dhParamsOk.encryptedAnswer,
      tmpAesKey,
      tmpAesIv,
    );

    // @ts-ignore
    const hash = answerWithHash.slice(0, 20);
    // @ts-ignore
    const answerWithPadding = answerWithHash.slice(20);
    const buffer = bytesToArrayBuffer(answerWithPadding);

    const dhInnerData = ServerDHInnerData.read(buffer);

    this.session.g = dhInnerData.g;
    this.session.g_a = dhInnerData.g_a;
    this.session.dh_prime = dhInnerData.dh_prime;

    applyServerTime(dhInnerData.server_time);

    this.session.b = new SecureRandom().nextBytes(new Array(256));

    const clientDHInnerData = ClientDHInnerData.create({
      ...this.session,
      g_b: await callMethod(
        'bytes-pow',
        bytesFromHex(this.session.g.toString(16)),
        this.session.b,
        this.session.dh_prime,
      ),
    });

    const encryptedClientDHInnerData = await callMethod(
      'aes-encrypt',
      sha1BytesSync(clientDHInnerData.pack()).concat(
        clientDHInnerData.getBytes(),
      ),
      tmpAesKey,
      tmpAesIv,
    );

    const setClientDHRequest = SetClientDHParams.create({
      ...this.session,
      encrypted_data: encryptedClientDHInnerData,
    });

    const dhGenRes = await invoke(setClientDHRequest);

    const authKey = await callMethod(
      'bytes-pow',
      this.session.g_a,
      this.session.b,
      this.session.dh_prime,
    );

    const authKeyHash = bytesFromArrayBuffer(await callMethod('sha1', authKey));
    const authKeyAux = authKeyHash.slice(0, 8);
    const authKeyID = authKeyHash.slice(-8);

    const dhGenClassId = this.getResClassId(dhGenRes);

    if (dhGenClassId === DHGenOk.CLASS_ID) {
      const dhGenOk = DHGenOk.read(dhGenRes);
      const newNonceHash1 = bytesFromArrayBuffer(
        await callMethod(
          'sha1',
          this.session.new_nonce.concat([1], authKeyAux),
        ),
      ).slice(-16);
      
      if (!bytesCmp(newNonceHash1, dhGenOk.new_nonce_hash1)) {
        console.error('new nonce hash error');
      }
 
      const serverSalt = bytesXor(
        this.session.new_nonce.slice(0, 8),
        this.session.server_nonce.slice(0, 8),
      );

      const authPayload = {
        serverSalt: bytesToHex(serverSalt),
        authKey: bytesToHex(authKey),
        authKeyID: bytesToHex(authKeyID),
      };

      this.save(authPayload);

      return authPayload;
    }
  };

  save = (data: any) => {
    localStorage.setItem('auth', JSON.stringify(data));
  };

  getSavedTokens = () => {
    return JSON.parse(localStorage.getItem('auth') || '0') || null;
  };

  createDHRequest = async () => {
    const data = PQInnerData.create(this.session);

    return ReqDHParams.create({
      ...this.session,
      encrypted_data: await callMethod(
        'rsa-encrypt',
        this.session.publicKey,
        sha1BytesSync(data.pack()).concat(data.getBytes()),
      ),
    });
  };

  getResClassId = (res: ArrayBuffer) => {
    return new MessageReader(res).int('classId').toJSON().classId;
  };
}

export { MTPClient };
