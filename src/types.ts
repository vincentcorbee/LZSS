export type LZSSOptions = {
  searchBufferLength: number
  lookaheadBufferLength: number
}

export type Encoding = string | [number, number]

export type Match = [number, number, string]

export type EncodedArray = Encoding[]