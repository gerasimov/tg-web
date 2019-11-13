export function nextRandomInt(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

export function addPadding(bytes, blockSize) {
  blockSize = blockSize || 16;
  const len = bytes.byteLength || bytes.length;
  const needPadding = blockSize - (len % blockSize);
  if (needPadding > 0 && needPadding < blockSize) {
    const padding = new Array(needPadding);
   
    for (let i = 0; i < needPadding; i++) {
      padding[i] = 0;
    }

    if (bytes instanceof ArrayBuffer) {
      bytes = bufferConcat(bytes, padding);
    } else {
      bytes = bytes.concat(padding);
    }
  }

  return bytes;
}


function bufferConcat(buffer1, buffer2) {
  const l1 = buffer1.byteLength || buffer1.length;
  const l2 = buffer2.byteLength || buffer2.length;
  const tmp = new Uint8Array(l1 + l2);
  tmp.set(
    buffer1 instanceof ArrayBuffer ? new Uint8Array(buffer1) : buffer1,
    0,
  );
  tmp.set(
    buffer2 instanceof ArrayBuffer ? new Uint8Array(buffer2) : buffer2,
    l1,
  );

  return tmp.buffer;
}

