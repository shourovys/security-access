import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { IScheduleResult } from './schedule'
import t from '../../utils/translator'

export interface IArchiveScheduleResult {
  ArchiveNo: number
  Schedule: IScheduleResult | null
  ArchiveName: string
  ArchiveDesc: string
  Media: number
  UsageBased: number
  UsagePercent: number
  ScheduleNo: number
  ArchiveTime: number
  ArchiveLogNo: number
}

export interface IArchiveScheduleFilters {
  ArchiveNo: string
  ArchiveName: string
  Media: ISelectOption | null
  Apply: boolean
}

export interface IArchiveScheduleRouteQueryParams {
  Page: number
  ArchiveNo: string
  ArchiveName: string
  MediaValue: string | undefined
  MediaLabel: string | undefined
}

export interface IArchiveScheduleApiQueryParams extends IApiQueryParamsBase {
  ArchiveNo_icontains?: string
  ArchiveName_icontains?: string
  Media?: string
}

export interface IArchiveScheduleFormData {
  Schedule: ISelectOption | null
  ArchiveName: string
  ArchiveDesc: string
  Media: ISelectOption | null
  UsageBased: ISelectOption | null
  UsagePercent: string
}

export interface IArchiveScheduleInfoFormData extends IArchiveScheduleFormData {
  ArchiveTime: number
  ArchiveLogNo: string
}

export const archiveScheduleMediaOptions = [
  {
    label: t`Local Media`,
    value: '1',
  },
  {
    label: t`FTP Server`,
    value: '2',
  },
  {
    label: t`Cloud Server`,
    value: '3',
  },
]

export const archiveScheduleMediaObject = optionsToObject(archiveScheduleMediaOptions)
