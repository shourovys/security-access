import { ISelectOption } from '../../components/atomic/Selector'
import t from '../../utils/translator'

export interface ISystemResult {
  No: number
  Name: string
  Validate: string
  BackupMedia: number // 0: System, 1: SD Card, 2: USB Memory
  RecordMedia: number // 0: System, 1: SD Card, 2: USB Memory
  SystemTotal: number // MB
  SystemFree: number // MB
  SdMount: number // 0: No, 1: Yes
  SdTotal: number // MB
  SdFree: number // MB
  UsbMount: number // 0: No, 1: Yes
  UsbTotal: number // MB
  UsbFree: number // MB
  StartTime: number // Timestamp
  BoardCount: number // 1, 2
  Board1: string // 4-2.9
  Board2: string // 4-2.9
  Product: number // 8
  Version: string // 50-1.1
  ReleaseDate: number // yyyyMMdd
  AutoUpdate: number //0:No, 1:Yes
  LatestVersion: string // 50-2.1
}

export interface ISystemInfoFormData {
  Name: string
  BackupMedia: string
  RecordMedia: string
  SystemTotal: string
  SystemFree: string
  SdMount: ISelectOption | null
  SdTotal: string
  SdFree: string
  UsbMount: ISelectOption | null
  UsbTotal: string
  UsbFree: string
  StartTime: string
  BoardCount: ISelectOption | null
  Version: string
  LatestVersion: string
  ReleaseDate: string
  AutoUpdate: ISelectOption | null
  Board1: string
  Board2: string
  Product: string
}

export interface ISystemEditFormData {
  No: string
  Name: string
  BackupMedia: ISelectOption | null
  RecordMedia: ISelectOption | null
  BoardCount: ISelectOption | null
  AutoUpdate?: ISelectOption | null
}

export const systemMediaOptions = [
  {
    label: t`System`,
    value: '0',
  },
  {
    label: t`SD Card`,
    value: '1',
  },
  {
    label: t`USB Memory`,
    value: '2',
  },
]

export const systemBoardCountOptions = [
  {
    label: t`1`,
    value: '1',
  },
  {
    label: t`2`,
    value: '2',
  },
]
