import { http } from 'app/core/mtproto/http';
import { generateMessageID } from 'app/core/mtproto/time';
import { MessageCreator } from 'app/core/mtproto/MessageCreator';

export function invoke(payload: ArrayBuffer) {
  const headerBuffer = new MessageCreator(20)
    .long(0)
    .long(generateMessageID())
    .int(payload.byteLength)
    .pack();

  const headerArray = new Int32Array(headerBuffer);
  const headerLength = headerBuffer.byteLength;

  const resultBuffer = new ArrayBuffer(headerLength + payload.byteLength),
    resultArray = new Int32Array(resultBuffer);

  resultArray.set(headerArray);

  const requestArray = new Int32Array(payload);
  resultArray.set(requestArray, headerArray.length);

  return http(resultArray).then((buf: any) => buf.slice(20));
}
