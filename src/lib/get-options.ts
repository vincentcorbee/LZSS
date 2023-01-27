import { LZSSMaxSearchBufferLength, LZSSMaxLookaheadBufferLength } from "../constants";
import { LZSSOptions } from "../types";

export function getOptions(options: Partial<LZSSOptions> = {}): LZSSOptions {
  const { searchBufferLength = 255, lookaheadBufferLength = 15 } = options

  return {
    searchBufferLength: Math.min(searchBufferLength, LZSSMaxSearchBufferLength),
    lookaheadBufferLength: Math.min(lookaheadBufferLength, LZSSMaxLookaheadBufferLength)
  }
}