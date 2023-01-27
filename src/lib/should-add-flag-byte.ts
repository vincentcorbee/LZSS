export function shouldAddFlagByte(index: number, lengthEncodedData: number) {
  return index == 0 || lengthEncodedData !== 8 && index % 8 === 0 && index < lengthEncodedData
}