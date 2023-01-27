import { breakEven } from "./constants";
import { getOptions, getMatch, getLookaheadBuffer, getSearchBuffer, createArrayBuffer } from "./lib";
import { LZSSOptions, EncodedArray } from './types'

export function compress(
  input: string,
  options?: Partial<LZSSOptions>
) {
  const { searchBufferLength, lookaheadBufferLength } = getOptions(options)

  const encodedArray: EncodedArray = []
  const end = input.length - 1

  let searchBuffer = ''

  let codingPosition = 0

  let uint8Length = 0

  let flagByte = 0
  let flagCount = 0

  const flagBytes: number[] = []

  while (codingPosition <= end) {
    const lookaheadBuffer = getLookaheadBuffer(input, codingPosition, lookaheadBufferLength)
    const match = getMatch(
      searchBuffer,
      lookaheadBuffer,
      breakEven
    )

    if (match) {
      const [length, distance, matchedChars] = match

      encodedArray.push([length, distance])

      /*
        We have length distance pair so we add a one to our flag byte.
      */

      flagByte = flagByte << 1 | 1

      uint8Length += 2

      codingPosition += length

      searchBuffer += matchedChars
    }

    else {
      const [characterAtCodingPosition] = lookaheadBuffer

      encodedArray.push(characterAtCodingPosition)

      /*
        We are going to store the symbol as is, so we add a 0 to our flag byte.
      */

      flagByte <<= 1

      uint8Length ++

      codingPosition++

      searchBuffer += characterAtCodingPosition
    }

    flagCount ++

    searchBuffer = getSearchBuffer(searchBuffer, searchBufferLength)

    /*
      If we have a whole flag byte, add it to the flag byte array.
    */

    if (flagCount === 8) {
      flagBytes.push(flagByte)

      flagCount = 0

      flagByte = 0
    }
  }

  /*
    If we have a remaining flag byte, pad it to one byte and add it to the flag byte array.
  */

  if (flagCount) flagBytes.push(flagByte <<= 8 - flagCount)

  return createArrayBuffer(encodedArray, flagBytes, uint8Length)
}