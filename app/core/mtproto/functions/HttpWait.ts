import { MessageCreator } from 'app/core/mtproto/MessageCreator';

HttpWait.CLASS_ID = 0x9299359f;

export function HttpWait({ max_delay = 10, wait_after = 1, max_wait = 25000 }) {
  return new MessageCreator(32)
    .int(HttpWait.CLASS_ID)
    .int(max_delay)
    .int(wait_after)
    .int(max_wait);
}
