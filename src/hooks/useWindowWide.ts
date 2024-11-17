import { useEffect, useState } from 'react'

enum Breakpoint {
  sm = '640px',
  md = '768px',
  lg = '1024px',
  xl = '1280px',
  // '2xl' = '1536px',
}

const useWindowWide = (size: keyof typeof Breakpoint): boolean => {
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWidth])

  return width > parseInt(Breakpoint[size])
}

export default useWindowWide
