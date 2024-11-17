import { ISelectOption } from '../../components/atomic/Selector'

export interface IFtpResult {
  No: number
  Enable: number
  ServerAddr: string
  ServerPort: number
  UserId: string
  Password: string
  Path: string
}

export interface IFtpFormData {
  Enable: ISelectOption | null
  ServerAddr: string
  ServerPort: string
  UserId: string
  Password: string
  Path: string
}
