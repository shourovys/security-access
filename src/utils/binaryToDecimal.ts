const binaryRegex = /^[01]+$/

function isValidBinary(binary: string): boolean {
  return binaryRegex.test(binary)
}

function getValidSubBinary(binary: string, startPosition: number, length: number): string | null {
  const subBinary = binary.substr(startPosition - 1, length) // Extract the desired substring
  if (isValidBinary(subBinary)) {
    return subBinary
  }
  return null
}

function binaryToDecimal(binary: string): number {
  // Convert the substring to decimal
  return parseInt(binary, 2)
}

export { binaryToDecimal, getValidSubBinary }
