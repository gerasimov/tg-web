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

