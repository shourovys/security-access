import { ISelectOption } from '../../components/atomic/Selector'
import { IAccessElementResult, IGroupElementResult } from '../../types/hooks/selectData'
import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'
import { IAccessResult, IAccessResultOld } from './access'
import { IApiQueryParamsBase } from './common'
import { IFormatResult, IFormatResultOld } from './format'
import { IGroupResultOld } from './group'
import { IPersonFormData, IPersonResult, IPersonResultOld } from './person'

export interface ICredentialResultOld extends IPersonResult {
  id: number
  person: IPersonResultOld
  format: IFormatResultOld
  credential_groups: IGroupResultOld[]
  credential_accesses: IAccessResultOld[]
  created_at: string
  updated_at: string
  number: number
  sub_key_number: number
  type: number
  stat: number
  never_expired: boolean
  select_type: string
  start_time: null | string
  end_time: null | string
  event_time: null | string
}

export interface ICredentialResult {
  CredentialNo: number // Primary Key
  Person: IPersonResult | null // Persons->PersonNo
  Format: IFormatResult // Formats->FormatNo
  PersonNo: number
  CredentialNumb: string
  SubKeyNumb: string
  CredentialType: number // 0: Normal, 1: Guard Tour, 2: Toggle, 3: Passage, 4: Relock, 5: One Time, 6: Hazmat Unlock, 7: Deadman Check, 8: Latch
  CredentialStat: number // 0: Active, 1: Lost, 2: Stolen, 3: Inactive
  NeverExpired: number // 0: No, 1: Yes
  StartTime: string // Validate: YYYY-MM-DD HH:MM // Hide if NeverExpired=1
  EndTime: string // Validate: YYYY-MM-DD HH:MM // Hide if NeverExpired=1
  AccessSelect: number // 0: Individual, 1: Group
  Accesses: IAccessResult[] | null
  Groups: IGroupElementResult[] | null
  EventTime: number // Timestamp
  Comment?: string // BackupMedia: number // 0: System, 1: SD Card, 2: USB Memory
}

export interface ICredentialFilters {
  CredentialNo: string
  Format: ISelectOption | null
  CredentialNumb: string
  CredentialType: ISelectOption | null
  CredentialStat: ISelectOption | null
  LastName: string
  FirstName: string
  Email: string
  Apply: boolean
}

export interface ICredentialApiQueryParams extends IApiQueryParamsBase {
  CredentialNo_icontains?: string
  FormatNo?: string
  CredentialNumb?: string
  CredentialType?: string
  CredentialStat?: string
  LastName?: string
  FirstName?: string
  Email?: string
}

export interface ICredentialFormData extends IPersonFormData {
  Format: ISelectOption | null
  CredentialNumb: string
  SubKeyNumb: string
  CredentialType: ISelectOption | null
  CredentialStat: ISelectOption | null
  NeverExpired: ISelectOption | null
  StartTime: string
  EndTime: string
  EventTime: string
  CredentialAccessSelect: ISelectOption | null
  CredentialGroupIds: string[]
  CredentialAccessIds: string[]
  CredentialAccesses?: IAccessElementResult[] // for show access in info page
  CredentialGroups?: IGroupElementResult[] // for show access in info page
}

export interface ICredentialBulkLoadFormData {
  Format: ISelectOption | null
  StartCredentialNumb: string
  BulkCount: string
  SubKeyNumb: string
  CredentialType: ISelectOption | null
  CredentialStat: ISelectOption | null
  NeverExpired: ISelectOption | null
  StartTime: string
  EndTime: string
  CredentialAccessSelect: ISelectOption | null
  CredentialGroupIds: string[]
  CredentialAccessIds: string[]
}

export interface ICredentialGroupEditFormData {
  CredentialType: ISelectOption | null
  CredentialStat: ISelectOption | null
  NeverExpired: ISelectOption | null
  StartTime: string
  EndTime: string
  CredentialAccessSelect: ISelectOption | null
  CredentialGroupIds: string[]
  CredentialAccessIds: string[]
}

export interface ICredentialBulkFromData extends ICredentialGroupEditFormData {
  Format: ISelectOption | null
  CredentialNumb: string
  SubKeyNumb: string
}

export interface ICredentialScanResult {
  CardData: string
  FormatNo: string
  CredentialNumb: string
}
export interface ICredentialScanFormData {
  Door: ISelectOption | null
  Status: string
  CurrentTime: string
  isScanning: boolean
}

export const credentialTypesOptions = [
  { value: '0', label: t`Normal` },
  { value: '1', label: t('Guard Tour') },
  { value: '2', label: t('Toggle') },
  { value: '3', label: t('Passage') },
  { value: '4', label: t`Relock` },
  { value: '5', label: t('One Time') },
  { value: '6', label: t`Hazmat Unlock` },
  { value: '7', label: t`Deadman Check` },
  { value: '8', label: t('Latch') },
]
export const credentialTypesObject = optionsToObject(credentialTypesOptions)

export const credentialStatsOptions = [
  { value: '0', label: t`Active` },
  { value: '1', label: t('Lost') },
  { value: '2', label: t`Stolen` },
  { value: '3', label: t`Inactive` },
]
export const credentialStatsObject = optionsToObject(credentialStatsOptions)
