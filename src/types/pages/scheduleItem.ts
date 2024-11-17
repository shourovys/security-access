import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'

export interface IScheduleItemResult {
  ItemNo: number // Item No - Integer - Primary Key
  ScheduleNo: number // Schedule No - Integer - Schedules->ScheduleNo
  ScheduleType: number // Schedule Type - Integer - 0: Daily, 1: Weekly, 2: Monthly, 3: OneTime
  Weekdays?: string // Weekdays - Validate - Text - i0: Sunday, i1: Monday, ..., i7: Holiday (Hide if ScheduleType != 1)
  Monthday?: number // Month Day - Validate - Integer - 1~31 (Hide if ScheduleType != 2)
  OneDate?: string // One Date - Validate - Text - YYYY-MM-DD (Hide if ScheduleType != 3)
  TimeType: number // Time Type - Integer - 0: Normal, 1: Dawn To Dusk, 2: Dusk To Dawn
  StartTime?: string // Start Time - Validate - Text - HH:MM (Hide if TimeType != 0)
  EndTime?: string // End Time - Validate - Text - HH:MM (Hide if TimeType != 0)
  Latitude: number
  Longitude: number
}

export interface IScheduleItemFormData {
  ScheduleType: ISelectOption | null // Schedule Type - Integer - 0: Daily, 1: Weekly, 2: Monthly, 3: OneTime
  Weekdays?: string[] // Weekdays - Validate - Text - i0: Sunday, i1: Monday, ..., i7: Holiday (Hide if ScheduleType != 1)
  Monthday?: ISelectOption | null // Month Day - Validate - Integer - 1~31 (Hide if ScheduleType != 2)
  OneDate?: string // One Date - Validate - Text - YYYY-MM-DD (Hide if ScheduleType != 3)
  TimeType: ISelectOption | null // Time Type - Integer - 0: Normal, 1: Dawn To Dusk, 2: Dusk To Dawn
  StartTime?: string // Start Time - Validate - Text - HH:MM (Hide if TimeType != 0)
  EndTime?: string // End Time - Validate - Text - HH:MM (Hide if TimeType != 0)
  Latitude: string
  Longitude: string
}

export interface ISunriseSunset {
  city: string
  sunrise: string
  sunset: string
}

export const monthdayOptions: ISelectOption[] = Array.from({ length: 31 }, (_, index) => ({
  value: (index + 1).toString(),
  label: (index + 1).toString(),
}))

export const scheduleWeekdaysOptions = [
  { value: '0', label: t`Sun` },
  { value: '1', label: t`Mon` },
  { value: '2', label: t`Tue` },
  { value: '3', label: t`Wed` },
  { value: '4', label: t`Thu` },
  { value: '5', label: t('Fri') },
  { value: '6', label: t('Sat') },
  { value: '7', label: t`Hol` },
]
export const scheduleWeekdaysObject = optionsToObject(scheduleWeekdaysOptions)

export const scheduleTypeOptions = [
  { value: '0', label: t`Daily` },
  { value: '1', label: t('Weekly') },
  { value: '2', label: t`Monthly` },
  { value: '3', label: t`OneTime` },
]
export const scheduleTypeObject = optionsToObject(scheduleTypeOptions)

export const scheduleTimeTypeOptions = [
  { value: '0', label: t`Normal` },
  { value: '1', label: t`Dawn To Dusk` },
  { value: '2', label: t`Dusk To Dawn` },
]
export const scheduleTimeTypeObject = optionsToObject(scheduleTimeTypeOptions)
