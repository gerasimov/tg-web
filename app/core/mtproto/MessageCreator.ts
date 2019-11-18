import { longToInts } from 'app/core/mtproto/utils';

export class MessageCreator {
  offset = 0;
  buffer: ArrayBuffer;
  intView: Int32Array;
  byteView: Uint8Array;

  constructor(size: number) {
    this.buffer = new ArrayBuffer(size);
    this.intView = new Int32Array(this.buffer);
    this.byteView = new Uint8Array(this.buffer);
  }

  int(data: number) {
    this.intView[this.offset / 4] = data;

    this.offset += 4;
    return this;
  }

  intBytes(bytes: any, bits: number) {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes);
    }
    const len = bytes.length;
    if (bits % 32 || len * 8 != bits) {
      throw new Error('Invalid bits: ' + bits + ', ' + bytes.length);
    }

    this.byteView.set(bytes, this.offset);
    this.offset += len;

    return this;
  }

  bytes(bytes: any) {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes);
    } else if (bytes === undefined) {
      bytes = [];
    }

    const len = bytes.byteLength || bytes.length;

    if (len <= 253) {
      this.byteView[this.offset++] = len;
    } else {
      this.byteView[this.offset++] = 254;
      this.byteView[this.offset++] = len & 0xff;
      this.byteView[this.offset++] = (len & 0xff00) >> 8;
      this.byteView[this.offset++] = (len & 0xff0000) >> 16;
    }

    this.byteView.set(bytes, this.offset);
    this.offset += len;

    // Padding
    while (this.offset % 4) {
      this.byteView[this.offset++] = 0;
    }

    return this;
  }

  int128(data: any) {
    return this.intBytes(data, 128);
  }

  int256(data: any) {
    return this.intBytes(data, 256);
  }

  int512(data: any) {
    return this.intBytes(data, 512);
  }

  longP(iHigh: number, iLow: number) {
    this.int(iLow);
    return this.int(iHigh);
  }

  long(sLong: any) {
    if (Array.isArray(sLong))
      return sLong.length === 2
        ? this.longP(sLong[0], sLong[1])
        : this.intBytes(sLong, 64);
    let str;
    if (typeof sLong !== 'string') {
      str = sLong ? sLong.toString() : '0';
    } else {
      str = sLong;
    }
    const [int1, int2] = longToInts(str);

    return this.longP(int1, int2);
  }

  bool(data: boolean) {
    return this.int(data ? 0x997275b5 : 0xbc799737);
  }

  string(data: string) {
    if (data === undefined) {
      data = '';
    }
    const sUTF8 = unescape(encodeURIComponent(data));

    const len = sUTF8.length;
    if (len <= 253) {
      this.byteView[this.offset++] = len;
    } else {
      this.byteView[this.offset++] = 254;
      this.byteView[this.offset++] = len & 0xff;
      this.byteView[this.offset++] = (len & 0xff00) >> 8;
      this.byteView[this.offset++] = (len & 0xff0000) >> 16;
    }
    for (let i = 0; i < len; i++) {
      this.byteView[this.offset++] = sUTF8.charCodeAt(i);
    }

    // Padding
    while (this.offset % 4) {
      this.byteView[this.offset++] = 0;
    }

    return this;
  }

  raw(bytes: any) {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes);
    }
    const len = bytes.length;
    
    this.byteView.set(bytes, this.offset);
    this.offset += len;

    return this;
  }

  getBytes(typed: boolean = false): Uint8Array | number[] {
    if (typed) {
      const resultBuffer = new ArrayBuffer(this.offset);
      const resultArray = new Uint8Array(resultBuffer);

      resultArray.set(this.byteView.subarray(0, this.offset));

      return resultArray;
    }

    const bytes = [];
    for (let i = 0; i < this.offset; i++) {
      bytes.push(this.byteView[i]);
    }
    return bytes;
  }

  vector(fn, data: any) {
    const l = data.length;
    this.int(481674261);
    this.int(l);

    for (let i = 0; i < data.length; i++) {
      fn(this, data[i], i);
    }

    return this;
  }

  pack() {
    const resultBuffer = new ArrayBuffer(this.offset);
    const resultArray = new Int32Array(resultBuffer);

    resultArray.set(this.intView.subarray(0, this.offset / 4));

    return resultArray.buffer;
  }
}
