import { IPermissionResult } from '../../types/context/auth'
import { ILicenseResult } from './license'
import { IPartitionResult } from './partition'
import { IUserResult } from './user'

// export interface IUser {
//   UserNo: number
//   role: IUserResult | null
//   person: IPersonResult | null
//   last_login: string | null
//   PartitionNo: number
//   UserId: string
//   UserDesc: string
//   Email: string
//   RoleNo: number
//   PersonNo: number
//   PushToken: string
//   LoginToken: string
// }

export type Language = 'generic' | 'en' | 'fr' | 'de' | 'es'

export interface ISystemConfigResponse {
  user: IUserResult | null
  partition: IPartitionResult | null
  license: ILicenseResult | null
  layout: '' | 'Master' | 'Worker' | 'Initial'
  permissions: IPermissionResult[]
  date_format: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'
  time_format: 'HH:mm:ss' | 'hh:mm A'
  timezone: string
  language: Language
  total_partition: number
}

export interface IConfigWithToken {
  token: string
  config: ISystemConfigResponse
}

export interface IOemResult {
  No: number
  OemNo: number
  OemName: string
  LicenseAddr: string
  LicensePort: number
  CloudAddr: string
  CloudPort: number
  StorageAddr: string
  StoragePort: number
  StorageUser: string
  StoragePass: string
  SmtpAddr: string
  SmtpPort: number
  SmtpUser: string
  SmtpPass: string
  UpdateAddr: string
  UpdatePort: number
  UpdateUser: string
  UpdatePass: string
}
