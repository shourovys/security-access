import { ISelectOption } from '../../components/atomic/Selector'

export interface ITimeResult {
  Timezone: string
  Ntp: number
  CurrentTime: string
  CurrentTimeZone: string | null
}

export interface ITimeFormData {
  Timezone: ISelectOption | null
  Ntp: ISelectOption | null // 0: No (Manual), 1: Yes (NTP)
  CurrentTime: string
}
