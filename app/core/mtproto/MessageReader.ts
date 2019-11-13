import { lshift32 } from 'app/core/mtproto/utils';

type FieldName = string;

export class MessageReader {
  result: { [key: string]: any } = {};

  offset: number;

  buffer: ArrayBuffer;

  intView: Uint32Array;

  byteView: Uint8Array;

  constructor(data: ArrayBuffer) {
    this.offset = 0;
    this.buffer = data;
    this.intView = new Uint32Array(this.buffer);
    this.byteView = new Uint8Array(this.buffer);
  }

  _int() {
    let i = this.intView[this.offset / 4];
    this.offset += 4;

    return i;
  }

  int(field: FieldName) {
    this.result[field] = this._int();

    return this;
  }

  intBytes(bits: number, typed: boolean = false) {
    if (bits % 32) {
      throw new Error('Invalid bits: ' + bits);
    }

    let len = bits / 8;
    if (typed) {
      let result = this.byteView.subarray(this.offset, this.offset + len);
      this.offset += len;
      return result;
    }

    let bytes = [];
    for (let i = 0; i < len; i++) {
      bytes.push(this.byteView[this.offset++]);
    }

    return bytes;
  }

  int128(field: FieldName, signed = false) {
    this.result[field] = this.intBytes(128, signed);

    return this;
  }

  int256(field: FieldName, signed = false) {
    this.result[field] = this.intBytes(256, signed);

    return this;
  }

  int512(field: FieldName, signed = false) {
    this.result[field] = this.intBytes(512, signed);

    return this;
  }

  vector(type: string, field: string) {
    this._int();
    const counts = this._int();
    const res = [];

    for (let i = 0; i < counts; i++) {
      res.push(this._long());
    }

    this.result[field] = res;

    return this;
  }

  bytes(field: FieldName) {
    let len = this.byteView[this.offset++];

    if (len == 254) {
      len =
        this.byteView[this.offset++] |
        (this.byteView[this.offset++] << 8) |
        (this.byteView[this.offset++] << 16);
    }

    let bytes = this.byteView.subarray(this.offset, this.offset + len);
    this.offset += len;

    // Padding
    while (this.offset % 4) {
      this.offset++;
    }

    this.result[field] = bytes;

    return this;
  }

  rawBytes(field: string, len?: number) {
    if (!len) {
      len = this.byteView[this.offset / 4];
      this.offset += 4;
    }
    const result = this.byteView.subarray(this.offset, this.offset + len);

    this.offset += len;

    this.result[field] = result;
    return this;
  }

  bool(field: FieldName) {
    let i = this._int();

    if (i === 0x997275b5) {
      this.result[field] = true;
      return true;
    } else if (i === 0xbc799737) {
      this.result[field] = false;

      return false;
    }

    this.offset -= 4;
  }

  _long() {
    let iLow = this._int();
    let iHigh = this._int();

    return lshift32(iHigh, iLow);
  }

  long(field: FieldName) {
    this.result[field] = this._long();

    return this;
  }

  string(field: FieldName) {
    return this.bytes(field);
  }

  toJSON() {
    return this.result;
  }
}
