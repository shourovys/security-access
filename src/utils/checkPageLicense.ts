import { LicenseCheckType } from '../types/context/auth'
import { ILicenseResult } from '../types/pages/license'

const checkPageLicense = (
  pageId: number,
  license: ILicenseResult | null,
  has_license: (k: LicenseCheckType) => boolean
): boolean => {
  const map: { [PageNo: number]: LicenseCheckType } = {
    3: 'Channel',
    4: 'Camera',
    22: 'Camera',
    23: 'Channel',
    24: 'Channel',
    25: 'Lockset',
    26: 'Lockset',
    60: 'Facegate',
    63: 'Subnode',
    64: 'Subnode',
    65: 'ContLock',
    66: 'ContLock',
    69: 'Intercom',
  }

  const option_map: { [PageNo: number]: number } = {
    37: 0,
    36: 1,
    61: 2,
    67: 3,
    68: 4,
  }

  if (license && option_map[pageId] !== undefined) {
    return license.Options[option_map[pageId]] === '1'
  }

  if (map[pageId]) {
    return has_license(map[pageId])
  }

  return true
}

export default checkPageLicense
