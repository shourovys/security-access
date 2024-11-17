import { ISelectOption } from '../../components/atomic/Selector'
import { MultiSelectOption } from '../../reducer/multiSelectReducer'
import { IApiQueryParamsBase } from './common'
import { ILogResult } from './log'

export interface ISmartReportFilters {
  StartTime?: string
  EndTime?: string
  EventName?: string
  DeviceName?: string
  PersonName?: string
  EventType: ISelectOption | null
  EventCodes?: string[]
  DeviceType: ISelectOption | null
  DeviceIds?: string[]
  PersonIds?: string[]
  OutputList: (keyof ILogResult)[]
  Reference: string
  Apply: boolean
}

export interface ISmartReportApiQueryParams extends IApiQueryParamsBase {
  StartTime?: string
  EndTime?: string
  EventName?: string
  DeviceName?: string
  PersonName?: string
  // EventType?: string
  EventCodes?: string[]
  // DeviceType?: string
  DeviceIds?: string[]
  PersonIds?: string[]
  Reference?: string
}

export type ISmartReportSaveQueryParams = Omit<ISmartReportApiQueryParams, 'offset' | 'limit'>

const logResultKeys: (keyof ILogResult)[] = [
  'LogNo',
  'Partition',
  'Format',
  'Credential',
  'Person',
  'Region',
  'Channel',
  'PartitionNo',
  'LogTime',
  'EventTime',
  'EventCode',
  'EventName',
  'DeviceType',
  'DeviceNo',
  'DeviceName',
  'FormatNo',
  'CredentialNumb',
  'CredentialNo',
  'PersonNo',
  'PersonName',
  'ReaderPort',
  'RegionNo',
  'ChannelNo',
  'Message',
  'AckRequired',
  'AckTime',
  'AckUser',
  'Comment',
  'LogSent',
]

export const LogKeysOptions: MultiSelectOption[] = logResultKeys.map((key) => ({
  id: key,
  label: `${key.replace(/([a-z])([A-Z])/g, '$1 $2')}`,
}))
