export function swappedValuesWithKey<T extends string>(
  obj: Record<T, string>
): { [key: string]: T } {
  const swapped: { [key: string]: T } = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      swapped[obj[key]] = key
    }
  }
  return swapped
}
