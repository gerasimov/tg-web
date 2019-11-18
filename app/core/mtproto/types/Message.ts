import { MessageReader } from 'app/core/mtproto/MessageReader';
import { uintToInt } from 'app/core/mtproto/sharedUtils';
import { bytesToArrayBuffer } from 'app/core/mtproto/utils';

import { NewSessionCreated } from 'app/core/mtproto/types/NewSessionCreated';
import { MsgsAck } from 'app/core/mtproto/types/MsgsAck'
import { RpcResult } from 'app/core/mtproto/types/RpcResult'
import { BadMsgNotification } from 'app/core/mtproto/types/BadMsgNotification';

Message.CLASS_ID = 0x73f1f8dc;

Message.toString = () => Message.CLASS_ID;

export function Message(reader: MessageReader) {
  const msgId = reader._long();
  const seqNo = reader._int();
  const bytes = reader._int();
  const data = reader._bytes(bytes);

  let body;
  const dataBuffer = bytesToArrayBuffer(data);
  const metaReader = new MessageReader(dataBuffer);
  const msgClassId = uintToInt(metaReader._int(true));

  if (msgClassId == NewSessionCreated) {
    body = NewSessionCreated.read(dataBuffer);
  } else if (msgClassId == MsgsAck) {
    body = MsgsAck.read(dataBuffer);
  } else if (msgClassId == RpcResult) {
    body = RpcResult.read(dataBuffer);
  } else if (msgClassId == BadMsgNotification){
    body = BadMsgNotification.read(dataBuffer);
  } else {
    console.log(msgClassId);
  }

  return {
    msg_id: msgId,
    seq_no: seqNo,
    ...body,
  };
}
