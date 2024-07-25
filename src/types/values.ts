export class OSCColorValue {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(rgba: number);
  constructor(r: number, g: number, b?: number, a?: number);
  constructor(r: number, g?: number, b: number = 0, a: number = 0) {
    if (typeof g === 'number') {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    } else {
      this.r = ((r >>> 24) & 0xff) >>> 0;
      this.g = ((r >>> 16) & 0xff) >>> 0;
      this.b = ((r >>> 8) & 0xff) >>> 0;
      this.a = (r & 0xff) >>> 0;
    }
  }

  isSameAs(other: OSCColorValue): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
  }

  valueOf(): number {
    return (
      (((this.r & 0xff) << 24) |
        ((this.g & 0xff) << 16) |
        ((this.b & 0xff) << 8) |
        (this.a & 0xff)) >>>
      0
    );
  }
}

export class OSCMIDIValue {
  port: number;
  status: number;
  data1: number;
  data2: number;

  constructor(data: number);
  constructor(port: number, status: number, data1?: number, data2?: number);
  constructor(port: number, status?: number, data1: number = 0, data2: number = 0) {
    if (typeof status === 'number') {
      this.port = port;
      this.status = status;
      this.data1 = data1;
      this.data2 = data2;
    } else {
      this.port = ((port >>> 24) & 0xff) >>> 0;
      this.status = ((port >>> 16) & 0xff) >>> 0;
      this.data1 = ((port >>> 8) & 0xff) >>> 0;
      this.data2 = (port & 0xff) >>> 0;
    }
  }

  isSameAs(other: OSCMIDIValue): boolean {
    return (
      this.port === other.port &&
      this.status === other.status &&
      this.data1 === other.data1 &&
      this.data2 === other.data2
    );
  }

  valueOf(): number {
    return (
      (((this.port & 0xff) << 24) |
        ((this.status & 0xff) << 16) |
        ((this.data1 & 0xff) << 8) |
        (this.data2 & 0xff)) >>>
      0
    );
  }
}
