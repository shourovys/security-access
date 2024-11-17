import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { IScheduleResult } from './schedule'
import t from '../../utils/translator'

export interface IBackupScheduleResult {
  BackupNo: number
  Schedule: IScheduleResult
  BackupName: string
  BackupDesc: string
  Media: number
  BackupData: number
  ScheduleNo: number
  BackupTime: number
}

export interface IBackupScheduleFilters {
  BackupNo: string
  BackupName: string
  Media: ISelectOption | null
  Apply: boolean
}

export interface IBackupScheduleRouteQueryParams {
  Page: number
  BackupNo: string
  BackupName: string
  MediaValue: string | undefined
  MediaLabel: string | undefined
}

export interface IBackupScheduleApiQueryParams extends IApiQueryParamsBase {
  BackupNo_icontains?: string
  BackupName_icontains?: string
  Media?: string
}

export interface IBackupScheduleFormData {
  Schedule: ISelectOption | null
  BackupName: string
  BackupDesc: string
  Media: ISelectOption | null
  BackupData: string
}

export interface IBackupScheduleInfoFormData extends IBackupScheduleFormData {
  BackupTime: number
}

export const backupScheduleMediaOptions = [
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

export const backupScheduleMediaObject = optionsToObject(backupScheduleMediaOptions)

export const maintenanceBackupScheduleOptions = [
  {
    label: t`All Data`,
    value: '0',
  },
  {
    label: t`Node DB`,
    value: '1',
  },
  {
    label: t`System DB`,
    value: '2',
  },
  {
    label: t`Log DB`,
    value: '3',
  },
  {
    label: t`Image File`,
    value: '4',
  },
]

export const maintenanceBackupScheduleObject = optionsToObject(maintenanceBackupScheduleOptions)
