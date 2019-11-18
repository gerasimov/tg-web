export function convertToUint8Array(bytes) {
  if (bytes.buffer !== undefined) return bytes;
  return new Uint8Array(bytes);
}

export function bytesFromHex(hexString) {
  let len = hexString.length,
    i;
  let start = 0;
  const bytes = [];

  if (hexString.length % 2 !== 0) {
    bytes.push(parseInt(hexString.charAt(0), 16));
    start++;
  }

  for (i = start; i < len; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  return bytes;
}

export function bytesToHex(bytes) {
  bytes = bytes || [];
  const arr = [];
  for (let i = 0; i < bytes.length; i++) {
    arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16));
  }
  return arr.join('');
}

export function bytesFromArrayBuffer(buffer) {
  let len = buffer.byteLength;
  let byteView = new Uint8Array(buffer);
  let bytes = [];

  for (let i = 0; i < len; ++i) {
    bytes[i] = byteView[i];
  }

  return bytes;
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

export function bufferConcat(buffer1, buffer2) {
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

export function concat(...typedArrays) {
  const size = typedArrays.reduce((acc, arr) => arr.byteLength + acc, 0);

  let offset = 0;
  return typedArrays.reduce((uintArr, arr) => {
    uintArr.set(arr, offset);
    offset += arr.length;
    return uintArr;
  }, new Uint8Array(size));
}


