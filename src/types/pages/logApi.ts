import { ISelectOption } from '../../components/atomic/Selector'

export interface ILogApiResult {
  No: number
  Enable: number
  EndPoint: string
  UserId: string
  Password: string
  SiteId: string
}

export interface ILogApiFormData {
  Enable: ISelectOption | null
  EndPoint: string
  UserId: string
  Password: string
  SiteId: string
}
