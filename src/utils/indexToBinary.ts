export function indexToBinary(indices: (number | string)[] | null, size: number): string {
  const binaryArray: number[] = Array.from({ length: size }, () => 0)
  if (indices) {
    indices.forEach((index) => {
      const numberIndexElement = Number(index)
      if (numberIndexElement >= 0 && numberIndexElement < size) {
        binaryArray[numberIndexElement] = 1
      }
    })
  }

  return binaryArray.join('')
}

export function binaryToIndex(binary?: string): string[] {
  const indices: string[] = []
  if (binary) {
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === '1') {
        indices.push(i.toString())
      }
    }
  }
  return indices
}
