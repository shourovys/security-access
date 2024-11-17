import { ISelectOption } from '../../components/atomic/Selector'

export interface IRestApiResult {
  No: number
  Enable: number
  ApiKey: string
}

export interface IRestApiFormData {
  Enable: ISelectOption | null
  ApiKey: string
}
