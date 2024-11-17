import { ISelectOption } from '../../components/atomic/Selector'
import { IGroupElementResult } from '../../types/hooks/selectData'
import { IDoorResult } from '../../types/pages/door'
import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'
import { IApiQueryParamsBase } from './common'
import { IPartitionResult } from './partition'
import { IPersonResult } from './person'
import { IScheduleResult } from './schedule'

export interface IDoorRuleResult {
  RuleNo: number
  Persons: IPersonResult[] | null
  Persons2: IPersonResult[] | null
  Groups: IGroupElementResult[] | null
  Groups2: IGroupElementResult[] | null
  Partition: IPartitionResult
  DoorSelect: 0 | 1
  Doors: IDoorResult[] | null
  GroupDoors: IGroupElementResult[] | null
  Schedule: IScheduleResult
  PartitionNo: number
  RuleName: string
  RuleDesc: string
  RuleType: number
  DoorNo: number
  ScheduleNo: number
  PersonSelect: 0 | 1
  PersonSelect2: 0 | 1
  GraceTime: number
  CardTime: number
}

export interface IDoorRuleFilters {
  RuleNo: string
  RuleName: string
  Partition: ISelectOption | null
  RuleType: ISelectOption | null
  // Door: ISelectOption | null
  Apply: boolean
}

export interface IDoorRuleRouteQueryParams {
  page: number
  RuleNo: string
  RuleName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  RuleTypeValue: string | undefined
  RuleTypeLabel: string | undefined
  // DoorValue: string | undefined
  // DoorLabel: string | undefined
}

export interface IDoorRuleApiQueryParams extends IApiQueryParamsBase {
  RuleNo_icontains?: string
  RuleName_icontains?: string
  PartitionNo?: string
  RuleType?: string
  // DoorNo?: string
}

export interface IDoorRuleFormData {
  Partition: ISelectOption | null
  Schedule: ISelectOption | null
  DoorSelect: ISelectOption | null
  DoorIds: string[]
  GroupDoorIds: string[]
  PersonIds: string[]
  PersonIds2: string[]
  GroupIds: string[]
  GroupIds2: string[]
  RuleName: string
  RuleDesc: string
  RuleType: ISelectOption | null
  GraceTime: string
  CardTime: string
  PersonSelect: ISelectOption | null
  PersonSelect2: ISelectOption | null
}

export interface IDoorRuleInfoFormData extends IDoorRuleFormData {
  Doors: IDoorResult[] | null
  GroupDoors: IGroupElementResult[] | null
  Persons: IPersonResult[] | null
  Persons2: IPersonResult[] | null
  Groups: IGroupElementResult[] | null
  Groups2: IGroupElementResult[] | null
}

export const doorRuleTypeOption = [
  {
    label: t`First Person Rule`,
    value: '1',
  },
  {
    label: t`Manager In Rule`,
    value: '2',
  },
  {
    label: t`Two Person Rule`,
    value: '3',
  },
  {
    label: t`Gemini Panel Rule`,
    value: '4',
  },
]

export const doorRuleTypeObject = optionsToObject(doorRuleTypeOption)
