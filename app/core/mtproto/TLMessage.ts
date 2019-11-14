import { generateMessageID } from 'app/core/mtproto/time';

export class TLMessage {
  static SeqNo = 0;
  
  public msg_id: any;
  public seq_no: any;
  public body: any;

  static generateSeqNo(notContentRelated: boolean = false): number {
    let seqNo = TLMessage.SeqNo * 2;
    if (!notContentRelated) {
      seqNo++;
      TLMessage.SeqNo++;
    }

    return seqNo;
  }

  constructor({
    msg_id = generateMessageID(),
    seq_no = TLMessage.generateSeqNo(),
    body,
  }: any = {}) {
    return Object.assign(this, {
      msg_id,
      seq_no,
      body
    });
  }
}
