const isOemNoPresent = (_oemNo: number | undefined): boolean => {
  return typeof _oemNo !== 'undefined' && !Number.isNaN(_oemNo)
}

export default isOemNoPresent
