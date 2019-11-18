import { lshift32 } from 'app/core/mtproto/utils';
import { uintToInt } from 'app/core/mtproto/sharedUtils'

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

  extend(field: string, val: any) {
    this.result[field] = val;
    
    return this;
  }

  _int(onlyRead = false) {
    let i = this.intView[this.offset / 4];
    
    if (!onlyRead) {
      this.offset += 4;
    }
    
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

  int64(field: FieldName, typed = false) {
    this.result[field] = this.intBytes(64, typed);

    return this;
  }

  int128(field: FieldName, typed = false) {
    this.result[field] = this.intBytes(128, typed);

    return this;
  }

  int256(field: FieldName, typed = false) {
    this.result[field] = this.intBytes(256, typed);

    return this;
  }

  int512(field: FieldName, typed = false) {
    this.result[field] = this.intBytes(512, typed);

    return this;
  }

  vector(fn: (reader: MessageReader) => any, field: string) {
    this._int(); // pass vector type
    const counts = this._int();
    const res = [];
    
    for (let i = 0; i < counts; i++) {
      res.push(fn(this));
    }

    this.result[field] = res;
    
    return this;
  }

  _bytes(len = this.byteView[this.offset++], onlyRead = false) {

    if (len == 254) {
      len =
        this.byteView[this.offset++] |
        (this.byteView[this.offset++] << 8) |
        (this.byteView[this.offset++] << 16);
    }

    let bytes = this.byteView.subarray(this.offset, this.offset + len);
    if (!onlyRead) {
      this.offset += len;

      // Padding
      while (this.offset % 4) {
        this.offset++;
      }
    }

    return bytes;
  }
  
  bytes(field: FieldName) {
    this.result[field] = this._bytes();

    return this;
  }
  
  _rawBytes(len?: number, typed: boolean = false) {
    if (len == null) {
      len = this._int();
      if (len > this.byteView.byteLength) {
        throw new Error(
          'Invalid raw bytes length: ' +
          len +
          ', buffer len: ' +
          this.byteView.byteLength,
        );
      }
    }

    if (typed) {
      const bytes = new Uint8Array(len);
      bytes.set(this.byteView.subarray(this.offset, this.offset + len));
      this.offset += len;

      return bytes;
    }

    const bytes = [];
    for (let i = 0; i < len; i++) {
      bytes.push(this.byteView[this.offset++]);
    }

    return bytes;
  }

  rawBytes(field: string, len?: number, typed: boolean = false) {
    this.result[field] = this._bytes(len, typed);

    return this;
  }

  bool(field: FieldName) {
    let i = uintToInt(this._int());

    if (i === -1720552011) {
      this.result[field] = true;
      return this;
    } else if (i === -1132882121) {
      this.result[field] = false;
      return this;
    }

    this.offset -= 4;
    return this;
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
