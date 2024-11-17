const kbToMb = (kb: number) => {
  return Math.round((kb / 1024) * 100) / 100
}

export default kbToMb
