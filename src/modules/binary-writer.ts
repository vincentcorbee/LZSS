import { Encoding } from '../types';
import { BinaryReader } from './binary-reader'

export class BinaryWriter extends BinaryReader {
  constructor(length: number) {
    super(new ArrayBuffer(length))
  }

  private setData(data: number, type = 'Uint8') {
    let advance = 0

    switch(type) {
      case 'Uint16':
        advance = 2
        break;
      default:
        advance = 1
    }

    if (this.view.byteLength > this.pos) {
      // @ts-ignore
      this.view[`set${type}`](this.pos, data)

      this.pos += advance

      return this
    }

    return this
  }

  setLengthDistancePair(encoding: Encoding) {
    if (typeof encoding == 'string') throw Error('Encoding is not a length distance pair')

    return this.setUint16(encoding[0] << 12 | encoding[1])
  }

  setUint16(data: number) {
    return this.setData(data, 'Uint16')
  }

  setUint8(data: number) {
    return this.setData(data)
  }
}