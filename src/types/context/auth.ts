import { ISystemConfigResponse } from '../pages/login'

export type IPermission = string[] | '*'

export interface IPermissionResult {
  id: number
  name: string
  url: string
  access: boolean
  is_favorite: boolean
  position: number
  limit: number
}

export type LicenseCheckType =
  | 'Camera'
  | 'Channel'
  | 'Lockset'
  | 'Subnode'
  | 'ContLock'
  | 'Facegate'
  | 'Intercom'

export type IAuthContext = Pick<
  ISystemConfigResponse,
  'user' | 'partition' | 'license' | 'layout' | 'permissions'
> & {
  loading: boolean
  isAuthenticated: boolean
  logout: () => void
  login: (config: ISystemConfigResponse) => void
  refresh: () => void
  has_license: (k: LicenseCheckType) => boolean
  showPartition: boolean
}

// extends ISystemConfigResponse {
//   loading: boolean
//   isAuthenticated: boolean
//   logout: () => void
//   login: (config: ISystemConfigResponse) => void
// }
