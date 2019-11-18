import { MessageReader } from 'app/core/mtproto/MessageReader';

import { uintToInt } from 'app/core/mtproto/sharedUtils';
import { actions, ackIds } from 'app/core/api/responseActions';
import { invokeApi } from 'app/core/api/invokeApi';
import { MsgsAck } from 'app/core/mtproto/types/MsgsAck';

export function responseHandler(buf: ArrayBuffer, opts: any) {
  const reader = new MessageReader(buf);
  const classId: number = uintToInt(reader._int(true));

  let result = (actions as any)[classId]
    ? (actions as any)[classId](buf, opts)
    : reader;

  
  if (ackIds.size) {
    let filtered = Array.from(ackIds).filter(Boolean);
    if (!filtered.length) {
      return ;
    }
    const msgsAck = MsgsAck.create(filtered);
    invokeApi(msgsAck);
    ackIds.clear();
  }

  return result;
}
