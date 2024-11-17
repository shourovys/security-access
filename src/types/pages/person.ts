import { ISelectOption } from '../../components/atomic/Selector'
import { IAccessElementResult, IGroupElementResult } from '../../types/hooks/selectData'
import { IApiQueryParamsBase } from './common'
import { IDoorResultOld } from './door'
import { IGroupResultOld } from './group'
import { IPartitionResult, IPartitionResultOld } from './partition'
import t from '../../utils/translator'

export interface IPersonResultOld {
  id: number
  partition: IPartitionResultOld
  groups: IGroupResultOld[]
  doors: IDoorResultOld[]
  created_at: string
  updated_at: string
  first_name: string
  middle_name: string | null
  last_name: string
  email: string | null
  image: string | null
  ada: boolean
  exempt: boolean
  invite: boolean
  threat_level: number
  access_type: string
  field1: string | null
  field2: string | null
  field3: string | null
  field4: string | null
  field5: string | null
  field6: string | null
  field7: string | null
  field8: string | null
  field9: string | null
  field10: string | null
  field11: string | null
  field12: string | null
  field13: string | null
  field14: string | null
  field15: string | null
}

export interface IParsonCredentials {
  CredentialNo: 19
  FormatNo: number
  FormatName: string
  CredentialNumb: number | string
  CredentialType: number
  CredentialStat: number
}

export interface IPersonResult {
  PersonNo: number // Primary Key
  Partition: IPartitionResult // Partitions -> PartitionNo
  LastName: string
  FirstName: string
  MiddleName: string
  Email: string
  ImageFile: string
  Credentials: IParsonCredentials[]
  Ada: number // 0: No, 1: Yes
  Exempt: number // 0: No, 1: Yes
  Invite: number // 0: No, 1: Yes
  ThreatLevel: number // 1: Low, 2: Guarded, 3: Elevated, 4: High, 5: Severe
  AccessSelect: number // 0: Individual, 1: Group
  Accesses: IAccessElementResult[] | null
  Groups: IGroupElementResult[] | null
  InviteBy: IPersonResult | null // Persons -> PersonNo
  RegionNo: number // Regions -> RegionNo
  EventTime: number // Timestamp
  Field1: string
  Field2: string
  Field3: string
  Field4: string
  Field5: string
  Field6: string
  Field7: string
  Field8: string
  Field9: string
  Field10: string
  Field11: string
  Field12: string
  Field13: string
  Field14: string
  Field15: string
  Field16: string
  Field17: string
  Field18: string
  Field19: string
  Field20: string
}

export interface IPersonFilters {
  PersonNo: string
  LastName: string
  FirstName: string
  Email: string
  PartitionNo: ISelectOption | null
  Field1: string
  Field2: string
  Field3: string
  Field4: string
  Field5: string
  Field6: string
  Field7: string
  Field8: string
  Field9: string
  Field10: string
  Field11: string
  Field12: string
  Field13: string
  Field14: string
  Field15: string
  Apply: boolean
}

export interface IPersonRouteQueryParams {
  page: number
  PersonNo: string
  LastName: string
  FirstName: string
  Email: string
  PartitionNoValue: string | undefined
  PartitionNoLabel: string | undefined
  Field1: string
  Field2: string
  Field3: string
  Field4: string
  Field5: string
  Field6: string
  Field7: string
  Field8: string
  Field9: string
  Field10: string
  Field11: string
  Field12: string
  Field13: string
  Field14: string
  Field15: string
}

export interface IPersonApiQueryParams extends IApiQueryParamsBase {
  PersonNo_icontains?: string
  LastName_icontains?: string
  FirstName_icontains?: string
  Email_icontains?: string
  PartitionNo?: string
  Field1?: string
  Field2?: string
  Field3?: string
  Field4?: string
  Field5?: string
  Field6?: string
  Field7?: string
  Field8?: string
  Field9?: string
  Field10?: string
  Field11?: string
  Field12?: string
  Field13?: string
  Field14?: string
  Field15?: string
}

export interface IPersonFormData {
  Partition: ISelectOption | null
  LastName: string
  FirstName: string
  MiddleName: string
  Email: string
  ImageFile: string
  Ada: ISelectOption | null
  Exempt: ISelectOption | null
  Invite: ISelectOption | null
  Credentials?: IParsonCredentials[] // need for info page
  ThreatLevel: ISelectOption | null
  AccessSelect: ISelectOption | null
  AccessIds: string[]
  GroupIds: string[]
  Accesses?: IAccessElementResult[] // for show access in info page
  Groups?: IGroupElementResult[] // for show access in info page
  Field1: string
  Field2: string
  Field3: string
  Field4: string
  Field5: string
  Field6: string
  Field7: string
  Field8: string
  Field9: string
  Field10: string
  Field11: string
  Field12: string
  Field13: string
  Field14: string
  Field15: string
  Field16: string
  Field17: string
  Field18: string
  Field19: string
  Field20: string
}

export type IPersonInfoFormData = Required<IPersonFormData>

export type IPersonGroupEditFormData = Omit<
  IPersonFormData,
  'LastName' | 'FirstName' | 'MiddleName' | 'Email' | 'ImageFile' | 'Credentials'
>

export const personThreatOptions = [
  {
    label: t`Low`,
    value: '1',
  },
  {
    label: t`Guarded`,
    value: '2',
  },
  {
    label: t`Elevated`,
    value: '3',
  },
  {
    label: t`High`,
    value: '4',
  },
  {
    label: t`Severe`,
    value: '5',
  },
]
