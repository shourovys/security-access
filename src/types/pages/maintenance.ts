import { ISelectOption } from '../../components/atomic/Selector'
import t from '../../utils/translator'

export interface IUpdateServerFilesResult {
  data: string[]
}

export interface IUpdateServerResult {
  CurrentVersion: string
  LatestVersion: string
}

export interface IUpdateFormData {
  Action: 'update'
  MediaType: ISelectOption | null
  File: FileList | null
  FileName: ISelectOption | null
}

export interface IBackupFormData {
  MediaType: ISelectOption | null
  BackupType: string
}

export interface IRestoreFormData {
  Action: 'restore'
  MediaType: ISelectOption | null
  File: FileList | null
  FileName: ISelectOption | null
  BackupType: string
}

export interface IArchiveFormData {
  MediaType: ISelectOption | null
  LogNo: string
}

export interface IGetBackFormData {
  MediaType: ISelectOption | null
  File: FileList | null
  FileName: ISelectOption | null
  DeleteExisting: ISelectOption | null
}

export const maintenanceUpdateMediaOptions = [
  {
    label: t`User PC`,
    value: 'UserPC',
  },
  {
    label: t`Update Server`,
    value: 'UpdateServer',
  },
  {
    label: t`FTP Server`,
    value: 'FTPServer',
  },
]

export const maintenanceBackupMediaOptions = [
  {
    label: t`User PC`,
    value: 'UserPC',
  },
  {
    label: t`Local Media`,
    value: 'LocalMedia',
  },
  {
    label: t`FTP Server`,
    value: 'FTPServer',
  },
  {
    label: t`Cloud Server`,
    value: 'CloudServer',
  },
]

export const maintenanceBackupOptions = [
  {
    label: t`All Data`,
    value: 'AllData',
  },
  {
    label: t`Node DB`,
    value: 'NodeDB',
  },
  {
    label: t`System DB`,
    value: 'SystemDB',
  },
  {
    label: t`Log DB`,
    value: 'LogDB',
  },
  {
    label: t`Image File`,
    value: 'ImageFile',
  },
]

// export const maintenanceBackupObject = optionsToObject(maintenanceBackupOptions)
