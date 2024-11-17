import { ISelectOption } from '../../components/atomic/Selector'

export interface IGeminiResult {
  No: number
  Enable: number
  SecuKey: string
  Address: string
  Online: number
  ArmStat: number
  ZoneStat: number
}

export interface IGeminiFormData {
  Enable: ISelectOption | null
  SecuKey: string
}
