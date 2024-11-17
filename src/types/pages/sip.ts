import { ISelectOption } from '../../components/atomic/Selector'
import { IDefinedFieldResult } from './definedField'

export interface ISipResult {
  No: number
  Enable: number
  ServerAddr: string
  ServerPort: number
  SipFieldNo: number
  SipFields: IDefinedFieldResult | null
}

export interface ISipFormData {
  Enable: ISelectOption | null
  ServerAddr: string
  ServerPort: string
  SipFieldNo: ISelectOption | null
}
