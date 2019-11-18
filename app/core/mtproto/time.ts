import { lshift32 } from 'app/core/mtproto/utils';
import { nextRandomInt } from 'app/core/mtproto/sharedUtils';

let lastMessageID = [0, 0];
let timeOffset = 0;

export function tsNow(seconds: number = 0): number {
  var t = +new Date() + (timeOffset || 0);
  return seconds ? Math.floor(t / 1000) : t;
}

export function generateMessageID(): string {
  const timeTicks = tsNow(),
    timeSec = Math.floor(timeTicks / 1000) + timeOffset,
    timeMSec = timeTicks % 1000,
    random = nextRandomInt(0xffff);

  let messageID = [timeSec, (timeMSec << 21) | (random << 3) | 4];
  if (
    lastMessageID[0] > messageID[0] ||
    (lastMessageID[0] === messageID[0] && lastMessageID[1] >= messageID[1])
  ) {
    messageID = [lastMessageID[0], lastMessageID[1] + 4];
  }

  lastMessageID = messageID;

  return lshift32(messageID[0], messageID[1]);
}

export function applyServerTime(serverTime: number, localTime = tsNow()) {
  const newTimeOffset = serverTime - Math.floor(localTime / 1000);
  const changed = Math.abs(timeOffset - newTimeOffset) > 10;

  console.log('TIMEEE', serverTime, localTime);
  lastMessageID = [0, 0];
  window.timeOffset = newTimeOffset;

  return changed;
}
