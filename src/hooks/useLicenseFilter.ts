import { ISelectOption } from '../components/atomic/Selector'
import { LicenseCheckType } from '../types/context/auth'
import useAuth from './useAuth'

const useLicenseFilter = <T extends ISelectOption>(
  data: T[],
  value_and_license_key_map: { [k: string]: LicenseCheckType }
): T[] => {
  const { has_license } = useAuth()

  return data.filter((item) => {
    const key = value_and_license_key_map[item.value]
    if (key) {
      return has_license(key)
    }
    return true
  })
}

export default useLicenseFilter
