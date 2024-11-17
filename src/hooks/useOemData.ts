import { useEffect, useState } from 'react'
import { IOemData } from '../types/pages/oem'
import isOemNoPresent from '../utils/isOemNoPresent'

interface UseOemDataProps {
  oemNo: number | undefined
}

const useOemData = ({ oemNo }: UseOemDataProps) => {
  const [oemData, setOemData] = useState<IOemData | null>(null)

  useEffect(() => {
    const fetchOemData = async () => {
      if (isOemNoPresent(oemNo)) {
        try {
          const response = await fetch(`/oem/${oemNo}/data.json`)
          if (!response.ok) {
            throw new Error('Failed to fetch oemData')
          }
          const text: IOemData = await response.json()
          setOemData(text)
        } catch (error) {
          console.error('Error fetching EULA data:', error)
        }
      }
    }

    fetchOemData()

    // Cleanup function if necessary
    return () => {
      // Cleanup logic here if needed
    }
  }, [oemNo])

  return oemData
}

export default useOemData
