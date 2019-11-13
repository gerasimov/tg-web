import { invoke } from 'app/core/mtproto/invoke';
import { SecureRandom } from 'app/core/mtproto/vendors/SecureRandom';

import { ReqPQ } from 'app/core/mtproto/types/ReqPQ';
import { ResPQ } from 'app/core/mtproto/types/ResPQ';
import { PQInnerData } from 'app/core/mtproto/types/PQInnerData';
import { ReqDHParams } from 'app/core/mtproto/types/ReqDHParams';
import { DHParamsOK } from 'app/core/mtproto/types/DHParamsOK';
import { ServerDHInnerData } from 'app/core/mtproto/types/ServerDHInnerData';

import { sha1BytesSync } from 'app/core/mtproto/RSAKeys';

import { MessageReader } from 'app/core/mtproto/MessageReader';
import { bytesToArrayBuffer } from 'app/core/mtproto/utils';
import { callMethod } from 'app/core/mtproto/crypto';
import { applyServerTime } from 'app/core/mtproto/time';

class MTPClient {
  session: any;

  auth = async () => {
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

    applyServerTime(dhInnerData.server_time);

    console.log(this.session, dhInnerData);
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
