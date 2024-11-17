import { LicenseCheckType } from '../types/context/auth'
import { ILicenseResult } from '../types/pages/license'
import { IPageResult } from '../types/pages/userRole'

const pagesLicenseFilter = (
  pages: IPageResult[],
  license: ILicenseResult | null,
  has_license: (k: LicenseCheckType) => boolean
) => {
  return pages.filter((page) => {
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

    if (license && option_map[page.PageNo] !== undefined) {
      return license.Options[option_map[page.PageNo]] === '1'
    }

    if (map[page.PageNo]) {
      return has_license(map[page.PageNo])
    }
    return true
  })
}

export default pagesLicenseFilter
