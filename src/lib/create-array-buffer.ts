import { BinaryWriter } from "../modules";
import { EncodedArray } from "../types";
import { shouldAddFlagByte } from "./should-add-flag-byte";

export function createArrayBuffer(encodedData: EncodedArray, flagBytes: number[], uint8Length: number) {
  const binaryWriter = new BinaryWriter(uint8Length + flagBytes.length)
  const lengthEncodedData = encodedData.length

  encodedData.forEach((encoding, index) => {
    if (shouldAddFlagByte(index, lengthEncodedData)) binaryWriter.setUint8(flagBytes[index / 8])

    if (typeof encoding === 'string') binaryWriter.setUint8(encoding.charCodeAt(0))

    else binaryWriter.setLengthDistancePair(encoding)
  })

  return binaryWriter.buffer
}