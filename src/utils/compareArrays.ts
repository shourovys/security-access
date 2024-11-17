function compareArrays<T>(array1: T[], array2: T[]): boolean {
  const array2Sorted = array2.slice().sort()

  return (
    array1.length === array2.length &&
    array1
      .slice()
      .sort()
      .every(function (v, index) {
        return v === array2Sorted[index]
      })
  )
}
export default compareArrays
