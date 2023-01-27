import { Match } from "../types"

export function getMatch(searchBuffer: string, lookaheadBuffer: string, breakEven: number): Match | null {
  const [char] = lookaheadBuffer

  let distance = 0
  let length = 0

  let matchedChars = searchBuffer.lastIndexOf(char) === -1 ? null : char

  if (!matchedChars) return null

  const searchBufferEnd = searchBuffer.length

  let indexLookaheadBuffer = lookaheadBuffer.length

  while (indexLookaheadBuffer > 0) {
    const chars = lookaheadBuffer.substring(0, indexLookaheadBuffer)

    const indexInSearchBuffer = searchBuffer.lastIndexOf(chars)

    if (indexInSearchBuffer > -1) {
      length = chars.length

      matchedChars = chars

      distance = searchBufferEnd - indexInSearchBuffer

      /* Get the run length of the matched chars in the lookahead buffer */
      if (indexInSearchBuffer + chars.length === searchBufferEnd) {
        while (indexLookaheadBuffer <= lookaheadBuffer.length) {
          const remainingChars = lookaheadBuffer.substring(indexLookaheadBuffer)
          const match = remainingChars.indexOf(chars) === 0

          if (!match) break

          matchedChars += chars

          indexLookaheadBuffer += chars.length

          length = matchedChars.length
        }
      }

      break
    }

    indexLookaheadBuffer--
  }

  /*
    If our length is bigger then the break even point, we return a match.

    Otherwise we return null
  */
  if (length > breakEven) return [length, distance, matchedChars]

  return null
}