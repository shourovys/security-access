const capitalize = (str: string, lower: boolean = false) =>
  (lower ? str.toLowerCase() : str)
    .replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters following a lowercase letter

export default capitalize
