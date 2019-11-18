import { generateMessageID } from 'app/core/mtproto/time';

let SeqNo = 1;

export function generateSeqNo(notContentRelated: boolean = false): number {
  let seqNo = SeqNo * 2;
  if (!notContentRelated) {
    seqNo++;
    SeqNo++;
  }

  return seqNo;
}


export class TLMessage {
  
  public msg_id: any;
  public seq_no: any;
  public body: any;


  constructor({
    msg_id = generateMessageID(),
    seq_no = generateSeqNo(),
    body,
  }: any = {}) {
    return Object.assign(this, {
      msg_id,
      seq_no,
      body
    });
  }
}
