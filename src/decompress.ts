import { BinaryReader } from "./modules"

export function decompress(buffer: ArrayBuffer) {
  const binaryReader = new BinaryReader(buffer)

  let output = ''

  let flagByte = binaryReader.getUint8()
  let flagBytePosition = 7

  while (binaryReader.peak() !== null) {
    const flag = flagByte & 2**(flagBytePosition)

    if (flag == 0) output += binaryReader.getCharacter()

    else {
      const [length, distance] = binaryReader.getLengthDistancePair()

      const startIndex = output.length - distance

      const overflow = Math.max(startIndex + length - output.length, 0)

      const chars = output.substring(startIndex, startIndex + length)

      if (overflow) {
        let runLength = length / (length - overflow)

        while (runLength > 0) {
          output += chars

          runLength--
        }
      } else {
        output += chars
      }
    }

    flagBytePosition --

    if (flagBytePosition < 0 && binaryReader.peakNext() !== null) {
      flagByte = binaryReader.getUint8()
      flagBytePosition = 7
    }
  }

  return output
}