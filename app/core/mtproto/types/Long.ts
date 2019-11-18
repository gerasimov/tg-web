import { MessageReader } from 'app/core/mtproto/MessageReader'
import { MessageCreator } from 'app/core/mtproto/MessageCreator'

export function Long(reader: MessageReader) {
  return reader._long();
}

Long.write = function(writer: MessageCreator, value: any) {
  writer.long(value);
}
